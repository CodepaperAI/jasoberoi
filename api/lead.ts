/**
 * Lead capture, server side.
 *
 * The site is a Next.js static export, so it has no route handlers and nowhere
 * to keep a credential — which is why leads previously went to a GoHighLevel
 * *inbound webhook* from the browser. A webhook is the only GHL entry point
 * safe to call from an untrusted client, but it can only start a workflow, so
 * every field had to be mapped by hand in GHL's builder before anything was
 * created.
 *
 * This is a standalone Vercel function rather than a Next route. It deploys
 * beside the static output rather than through the Next builder, which is what
 * makes it possible at all here — verified on a preview deployment, which built
 * it as `λ api/lead` while still serving the exported site.
 *
 * With a server the token can be private, so this calls the GHL API directly
 * and creates the contact and the opportunity itself. No workflow, and the
 * opportunity Source is set in the same call rather than mapped downstream.
 *
 * GHL_API_TOKEN must be a Private Integration token with contacts.write and
 * opportunities.write. It is server-only — never prefix it with NEXT_PUBLIC_,
 * which would inline it into the browser bundle and hand every visitor write
 * access to the whole account.
 */

/**
 * Vercel's Node runtime, with Vercel's own (req, res) handler signature.
 *
 * api/package.json exists solely to mark this directory as ESM, and it is
 * load-bearing. This compiles to api/lead.js, the root package.json declares no
 * "type", so Node loaded the output as CommonJS and died on the first line of
 * the handler — `SyntaxError: Unexpected token 'export'`, every POST returning
 * FUNCTION_INVOCATION_FAILED. `vercel dev` transpiles differently and passed
 * cleanly, so it only appeared in production. Renaming to .mts was the obvious
 * fix and is worse: Vercel does not detect .mts as a function at all, so the
 * endpoint silently stopped existing.
 *
 * The Web-standard `(request: Request) => Response` form looks tidier and it
 * does not work here: under `runtime: "nodejs"` the response is never flushed,
 * so `vercel dev` reported "The function lead.ts is still running after 30s"
 * and the request hung until the client gave up. A lead form that hangs is
 * worse than one that errors, so this uses the signature the runtime actually
 * implements.
 *
 * Types are declared locally rather than by adding @vercel/node — the surface
 * used here is four methods wide and does not justify a dependency.
 */
type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

const GHL = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

const TOKEN = process.env.GHL_API_TOKEN ?? "";
const LOCATION_ID = process.env.GHL_LOCATION_ID ?? "";
const PIPELINE_ID = process.env.GHL_PIPELINE_ID ?? "";
const STAGE_ID = process.env.GHL_PIPELINE_STAGE_ID ?? "";
/**
 * The inbound webhook, used for two different jobs.
 *
 * It is the fallback when the API path fails, so a token problem degrades to
 * the old route rather than losing the enquiry. It is also how Jas is told a
 * lead arrived at all: GHL sends internal notifications from workflows and
 * nowhere else, workflow creation is not in the API (POST /workflows/ answers
 * 404), so the notification has to run from a workflow someone builds by hand —
 * and the webhook is what starts one.
 *
 * Writing the CRM record through the API and firing the notification through the
 * webhook splits the two cleanly: the contact and the opportunity no longer
 * depend on anyone mapping fields correctly in a builder, and the workflow is
 * reduced to the one thing only it can do.
 */
const FALLBACK_WEBHOOK = process.env.GHL_WEBHOOK_URL ?? "";
/** Who hears about a new lead, and the GHL contact the email is threaded on. */
const NOTIFY_EMAIL = process.env.GHL_NOTIFY_EMAIL ?? "";
const NOTIFY_CONTACT_ID = process.env.GHL_NOTIFY_CONTACT_ID ?? "";

type Lead = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  projectLocation?: string;
  projectType?: string;
  details?: string;
  source?: string;
  gclid?: string;
  /** Cookieless Google click ids — iOS and consent-limited traffic. */
  gbraid?: string;
  wbraid?: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmTerm?: string;
  landingPage?: string;
  submittedFrom?: string;
  formLocation?: string;
  /** Honeypot. Only a bot fills this in. */
  companyWebsite?: string;
};

/**
 * GoHighLevel custom field ids for the Oberizon location.
 *
 * The attribution has been reaching this function since it was written and
 * stopping here: it decided `source` and the tags, then dropped the rest. So
 * every contact in the CRM had an empty Google Click ID, and there was no way
 * to tie a booked job back to the ad group that bought it — which reads, from
 * inside GHL, exactly like the website form never sending anything.
 *
 * Hardcoded rather than configured. They are not credentials, they are
 * meaningless outside this one location, and an id that lives in the file can
 * be checked against GHL by reading it — a mistyped environment variable fails
 * silently, which is the failure mode this whole file exists to avoid.
 */
const CUSTOM_FIELD = {
  googleClickId: "b9sswjB83vF5uui8qWnz",
  gbraid: "52ZjWgtzQACt2wu4FvVh",
  wbraid: "LrzCMupIyU9cs4R98ZoW",
  utmSource: "ZBdckL5rKZpXWaASy7V9",
  utmMedium: "mC8d9xtbuIzyaoCFouyf",
  utmCampaign: "ZpMUO13xXxvPi1KuRuho",
  utmTerm: "XDzxECGtOKpEtlO3rU2K",
  landingPage: "EPeAsSnTLqv0LOb1gFsp",
  leadSource: "bBNrZVZnDKMm8rP7M453",
} as const;

/**
 * The attribution, shaped for the contact record.
 *
 * Empty values are dropped rather than sent blank: writing "" over a field that
 * already holds a click id would erase the attribution of a returning enquirer,
 * since the contact is upserted rather than created.
 */
function attributionFields(lead: Lead, fromGoogle: boolean) {
  return [
    { id: CUSTOM_FIELD.googleClickId, field_value: lead.gclid },
    { id: CUSTOM_FIELD.gbraid, field_value: lead.gbraid },
    { id: CUSTOM_FIELD.wbraid, field_value: lead.wbraid },
    { id: CUSTOM_FIELD.utmSource, field_value: lead.utmSource },
    { id: CUSTOM_FIELD.utmMedium, field_value: lead.utmMedium },
    { id: CUSTOM_FIELD.utmCampaign, field_value: lead.utmCampaign },
    { id: CUSTOM_FIELD.utmTerm, field_value: lead.utmTerm },
    { id: CUSTOM_FIELD.landingPage, field_value: lead.landingPage },
    { id: CUSTOM_FIELD.leadSource, field_value: fromGoogle ? "Google Ads" : "Website" },
  ].filter((field) => field.field_value);
}

function ghlHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Version: API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * The stage a new opportunity opens in.
 *
 * Explicit configuration or nothing. An earlier version fell back to the first
 * pipeline the API returned, which read as a sensible default until the account
 * turned out to hold fourteen — almost all of them commercial real estate, with
 * "2026 Commercial Plaza Seller" first in the list. A dental clinic construction
 * enquiry filed as a plaza seller is worse than no opportunity at all, because
 * the contact is captured either way and a misfiled card is one nobody trusts.
 *
 * Auto-selection therefore happens only when the account has exactly one
 * pipeline, where there is nothing to get wrong.
 */
async function resolvePipeline() {
  if (PIPELINE_ID && STAGE_ID) return { pipelineId: PIPELINE_ID, stageId: STAGE_ID };

  const response = await fetch(
    `${GHL}/opportunities/pipelines?locationId=${encodeURIComponent(LOCATION_ID)}`,
    { headers: ghlHeaders() },
  );
  if (!response.ok) return null;

  const body = (await response.json()) as {
    pipelines?: Array<{ id: string; stages?: Array<{ id: string }> }>;
  };
  const pipelines = body.pipelines ?? [];
  if (pipelines.length !== 1) return null;

  const stage = pipelines[0].stages?.[0];
  if (!stage) return null;

  return { pipelineId: pipelines[0].id, stageId: stage.id };
}

/**
 * Emails the new lead to whoever runs the business.
 *
 * GHL sends internal notifications from workflows and nowhere else, and
 * workflow creation is not in the API — POST /workflows/ answers 404 — so the
 * obvious route required someone to build one by hand in the builder and
 * remember to publish it. Until that happened a captured lead sat in the
 * pipeline and told nobody.
 *
 * The conversations API sends email directly, which removes that dependency
 * entirely. It is addressed to a contact rather than to a bare address, so the
 * recipient is a real contact record tagged internal-notifications — that also
 * means the notification is threaded and visible in GHL rather than vanishing
 * into an outbox.
 *
 * Failure here is deliberately silent to the caller. The lead is already
 * recorded; a notification that did not send is a problem worth solving, but
 * not one worth telling the visitor about by failing their form.
 */
async function notify(lead: Lead, opportunityId?: string) {
  if (!NOTIFY_EMAIL || !NOTIFY_CONTACT_ID) return false;

  /*
    The colon lives inside the label cell on purpose. Email clients that fall
    back to plain text strip the tags and concatenate the cells, and without it
    the first test arrived reading "NameNotify Test Emailnotify-test@..." —
    correct in HTML, unreadable everywhere else.
  */
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#6b6358">${label}:&nbsp;</td><td style="padding:4px 0"><strong>${value}</strong></td></tr>`
      : "";

  const html = `
    <p style="margin:0 0 12px">New enquiry from the website.</p>
    <table style="border-collapse:collapse;font-size:15px">
      ${row("Name", lead.fullName)}
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("Location", lead.projectLocation)}
      ${row("Project", lead.projectType)}
      ${row("Source", lead.source)}
      ${row("Campaign", lead.utmCampaign)}
      ${row("Landed on", lead.landingPage)}
      ${row("Submitted from", lead.submittedFrom)}
    </table>
    ${lead.details ? `<p style="margin:16px 0 0;white-space:pre-wrap">${lead.details}</p>` : ""}
    ${opportunityId ? `<p style="margin:16px 0 0;color:#6b6358;font-size:13px">Opportunity ${opportunityId} — Oberizon Construction pipeline.</p>` : ""}
  `;

  try {
    const response = await fetch(`${GHL}/conversations/messages`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        type: "Email",
        contactId: NOTIFY_CONTACT_ID,
        emailTo: NOTIFY_EMAIL,
        subject: `New lead — ${lead.fullName || "website"}${lead.projectType ? ` (${lead.projectType})` : ""}`,
        html,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function forwardToWebhook(lead: Lead) {
  if (!FALLBACK_WEBHOOK) return false;
  const response = await fetch(FALLBACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!response.ok) return false;
  const body = (await response.json().catch(() => null)) as { status?: string } | null;
  return !(body?.status ?? "").toLowerCase().startsWith("error");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return send(res, { error: "Method not allowed" }, 405);
  }

  // Vercel parses a JSON body for us; a string arrives when the content type
  // said otherwise, and that is still worth trying to read rather than refuse.
  let lead: Lead;
  try {
    lead = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as Lead;
    if (!lead || typeof lead !== "object") throw new Error("empty body");
  } catch {
    return send(res, { error: "Invalid JSON" }, 400);
  }

  /*
    Honeypot, checked again here. submitLead() drops these before they leave the
    browser, but /api/lead is a public endpoint and a bot posting straight at it
    never runs that code. Answered as success on purpose: an error tells the bot
    to retry with a different shape.
  */
  if (String(lead.companyWebsite ?? "").trim()) {
    return send(res, { captured: true }, 200);
  }

  if (!lead.email && !lead.phone) {
    return send(res, { error: "An email address or a phone number is required" }, 400);
  }

  if (!TOKEN || !LOCATION_ID) {
    // Not configured yet. Try the webhook so the lead still lands somewhere.
    const forwarded = await forwardToWebhook(lead);
    return send(res, { captured: forwarded, via: forwarded ? "webhook" : "none" }, forwarded ? 200 : 500);
  }

  // A click id is the unambiguous evidence the visit was bought. The browser
  // already computed `source` from the same facts; this is the CRM's own flag.
  const fromGoogle = Boolean(lead.gclid || lead.gbraid || lead.wbraid);

  try {
    // 1. Contact. Upsert rather than create: an enquiry from someone already in
    //    the account should update them, not produce a duplicate record.
    const contactResponse = await fetch(`${GHL}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        firstName: lead.firstName || lead.fullName || "",
        lastName: lead.lastName || "",
        email: lead.email || undefined,
        phone: lead.phone || undefined,
        source: lead.source || "Website",
        city: lead.projectLocation || undefined,
        tags: [lead.source || "Website", lead.projectType].filter(Boolean) as string[],
        customFields: attributionFields(lead, fromGoogle),
      }),
    });

    if (!contactResponse.ok) {
      const detail = await contactResponse.text();
      return send(res, { captured: false, step: "contact", status: contactResponse.status, detail }, 502);
    }

    const contactBody = (await contactResponse.json()) as {
      contact?: { id?: string };
      id?: string;
    };
    const contactId = contactBody.contact?.id ?? contactBody.id;
    if (!contactId) return send(res, { captured: false, step: "contact", detail: "no id" }, 502);

    // 2. Opportunity. This is the part the workflow existed to do, and Source is
    //    set here directly — the browser already decided whether the session
    //    began on a paid click, which is knowledge GHL does not have.
    const pipeline = await resolvePipeline();
    if (!pipeline) {
      return send(res, { captured: true, contactId, opportunity: false, detail: "no pipeline" }, 200);
    }

    const name = [lead.fullName || lead.firstName, lead.projectType]
      .filter(Boolean)
      .join(" — ");

    const opportunityResponse = await fetch(`${GHL}/opportunities/`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        pipelineId: pipeline.pipelineId,
        pipelineStageId: pipeline.stageId,
        contactId,
        name: name || "Website enquiry",
        status: "open",
        source: lead.source || "Website",
      }),
    });

    if (!opportunityResponse.ok) {
      const detail = await opportunityResponse.text();
      // The contact exists, so the lead is not lost even though the pipeline
      // card is missing. Reported as captured with the failure attached.
      return send(res, 
        { captured: true, contactId, opportunity: false, status: opportunityResponse.status, detail },
        200,
      );
    }

    const opportunity = (await opportunityResponse.json()) as { opportunity?: { id?: string } };

    // Awaited so the function is not killed mid-request, but its result cannot
    // fail the lead — the record is already safely in GHL.
    const notified = await notify(lead, opportunity.opportunity?.id).catch(() => false);

    return send(res,
      {
        captured: true,
        contactId,
        opportunity: true,
        opportunityId: opportunity.opportunity?.id,
        notified,
      },
      200,
    );
  } catch (error) {
    const forwarded = await forwardToWebhook(lead);
    return send(res, 
      { captured: forwarded, via: forwarded ? "webhook" : "none", detail: String(error) },
      forwarded ? 200 : 502,
    );
  }
}

function send(res: VercelResponse, body: unknown, status: number) {
  res.status(status).json(body);
}
