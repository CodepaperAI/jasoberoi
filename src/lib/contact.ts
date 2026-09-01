import { getAttribution, isPaidGoogle, leadSource } from "@/lib/attribution";
import { TIMESTAMP_FIELD } from "@/components/FormTimestamp";
import { siteConfig } from "@/lib/site";

/**
 * How an enquiry leaves this site.
 *
 * next.config.ts sets `output: "export"`, so there is no server here to receive
 * a POST and no safe place to keep an API token. The lead therefore goes
 * straight from the browser to a GoHighLevel inbound webhook, which is the one
 * GHL entry point designed to be called by an untrusted client: it is write-only
 * into a single workflow and carries no credential.
 *
 * What this replaces was a `mailto:`. It composed a draft in whatever mail
 * client the visitor's device had and relied on them pressing Send themselves —
 * so on a phone with no mail app configured, or a desktop where webmail is not
 * the registered handler, "Send request" did nothing at all and the enquiry was
 * gone. Nothing recorded it, because nothing else existed.
 *
 * The mailto is still here as the fallback path, deliberately. If the webhook is
 * unset or the POST fails, an enquiry that would otherwise vanish still has
 * somewhere to go, and `lead_capture_failed` goes to the dataLayer so the
 * failure is visible in GTM rather than silent.
 */

/**
 * Leads go to our own function, not to GHL.
 *
 * Same origin, so there is no CORS to negotiate and nothing about the CRM is
 * visible to the browser — no webhook URL, no account id, and above all no
 * token. api/lead.ts holds the credential and talks to GHL from the server.
 *
 * A relative path rather than an env var, deliberately: there is nothing here
 * left to configure, and a missing variable can no longer be the reason a form
 * silently stops capturing.
 */
const LEAD_ENDPOINT = "/api/lead";

/**
 * The honeypot's field name, shared with the form and echoed to the server.
 *
 * Meaningless on purpose. The previous name, `companyWebsite`, was a real field
 * name under a real label, and browser autofill filled it — see the note in
 * ConsultationForm.tsx. Anything recognisable here will eventually be autofilled
 * by something, so if this ever needs changing, keep it opaque.
 */
export const HONEYPOT_FIELD = "obz_f7";

export const isLeadCaptureConfigured = true;

/** Where a completed enquiry lands. GTM matches on "URL contains /thank-you". */
export const THANK_YOU_PATH = "/thank-you/";

export type LeadFields = {
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  details: string;
};

function readForm(form: HTMLFormElement): LeadFields {
  const data = new FormData(form);
  const get = (key: string) => String(data.get(key) ?? "").trim();

  return {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    location: get("location"),
    projectType: get("projectType"),
    details: get("details"),
  };
}

/**
 * GHL wants a first and last name as separate fields on the contact record, and
 * the form asks for one. Splitting on the last space is wrong for a handful of
 * names and right for most; sending the whole string as firstName would put
 * "Jane Doe Smith" in the greeting of every automated email.
 */
function splitName(full: string) {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { firstName: full, lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) ?? "" };
}

function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export function composeConsultationMailto(form: HTMLFormElement) {
  const fields = readForm(form);

  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Location: ${fields.location}`,
    `Project type: ${fields.projectType}`,
    "",
    fields.details,
  ].join("\n");

  const subject = `Consultation request — ${fields.projectType || "Oberizon Construction"}`;

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The payload the GHL workflow maps its fields from.
 *
 * `source` is the value the workflow writes to the opportunity's Source, and it
 * is decided here rather than in GHL because only the browser knows whether the
 * session began on a paid click — by submit time the gclid is long gone from
 * the URL. The campaign fields travel alongside it so a lead can be traced back
 * to an ad group without the Source field having to carry that detail.
 */
export function buildLeadPayload(
  form: HTMLFormElement,
  formSource: string,
  /**
   * Overrides the Source written to the opportunity.
   *
   * The paid landing pages need to be tellable apart in the pipeline — a Meta
   * commercial lead and a Meta residential lead are different campaigns with
   * different budgets, and "Website" for both makes the ad spend unreadable.
   * Left unset, the browser's own paid/organic call stands.
   */
  sourceOverride?: string,
) {
  const fields = readForm(form);
  const attribution = getAttribution();
  const { firstName, lastName } = splitName(fields.name);

  return {
    firstName,
    lastName,
    fullName: fields.name,
    email: fields.email,
    phone: fields.phone,

    projectLocation: fields.location,
    projectType: fields.projectType,
    details: fields.details,

    source: sourceOverride ?? leadSource(attribution),
    isPaidGoogle: isPaidGoogle(attribution),

    gclid: attribution.gclid ?? "",
    wbraid: attribution.wbraid ?? "",
    gbraid: attribution.gbraid ?? "",
    utmSource: attribution.utmSource ?? "",
    utmMedium: attribution.utmMedium ?? "",
    utmCampaign: attribution.utmCampaign ?? "",
    utmTerm: attribution.utmTerm ?? "",
    utmContent: attribution.utmContent ?? "",

    landingPage: attribution.landingPage ?? "",
    referrer: attribution.referrer ?? "",
    submittedFrom: typeof window === "undefined" ? "" : window.location.pathname,
    formLocation: formSource,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Sends the lead to our function. Resolves true only when it was stored.
 *
 * Two lessons from talking to GHL directly are still encoded here, because the
 * function inherits both. Its response must be read rather than trusted: GHL
 * answers a rejected payload with HTTP 200 and the failure in the body, so a
 * status-code check reported dropped leads as captured. And the request is
 * plain JSON — the text/plain trick that avoids a preflight is unnecessary now
 * that this is same-origin, and GHL rejected it anyway.
 */
async function postLead(payload: ReturnType<typeof buildLeadPayload>) {
  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    const body = (await response.json().catch(() => null)) as { captured?: boolean } | null;
    return response.ok && body?.captured === true;
  } catch {
    return false;
  }
}

export type SubmitResult = {
  captured: boolean;
  /** Set only when capture failed, so the form can offer email as a way out. */
  mailto?: string;
};

/**
 * Submits an enquiry and returns once it has somewhere to live.
 *
 * The caller navigates, not this function. The old version fired a mailto and
 * then moved the page to /thank-you on a 600ms timer that ran whether or not
 * anything had happened — so the Google Ads conversion recorded a lead every
 * time the button was pressed, including the times the mail client never opened.
 * Reported conversions were therefore not leads. Awaiting the result is what
 * makes that number mean something again.
 */
export async function submitLead(
  form: HTMLFormElement,
  formSource: string,
  sourceOverride?: string,
): Promise<SubmitResult> {
  /*
    The honeypot no longer decides anything here.

    It used to return { captured: true } and post nothing, which is a silent
    drop: the visitor is sent to /thank-you believing the enquiry was sent, and
    no record of it exists anywhere — not in the CRM, not in the server log, not
    in the dataLayer. That is exactly what happened once Chrome started
    autofilling the old `companyWebsite` field, and it is unrecoverable because
    nothing knows the lead existed.

    A false positive costs a customer; a false negative costs a tagged contact
    somebody deletes in two seconds. So the decision moves to the server, which
    still keeps bot submissions out of the pipeline but records them — and every
    submission now leaves a trace, whichever way it is judged.
  */
  const data = new FormData(form);
  const renderedAt = Number(data.get(TIMESTAMP_FIELD) ?? 0);

  const payload = {
    ...buildLeadPayload(form, formSource, sourceOverride),
    honeypot: String(data.get(HONEYPOT_FIELD) ?? "").trim(),
    /*
      How long the form was on screen before it was submitted. Reported, not
      judged — the server decides, for the same reason the honeypot moved there:
      a rule the browser enforces is a rule that silently loses leads with no
      record that they existed. 0 means the field never initialised, which is
      itself worth knowing.
    */
    elapsedMs: renderedAt ? Date.now() - renderedAt : 0,
  };

  const captured = await postLead(payload);

  if (captured) {
    /*
      form_source and form_name carry the same value. The existing GTM trigger
      matches on form_source and renaming it would silently stop the Google Ads
      conversion firing, so the new name is added beside the old one rather than
      replacing it.

      user_data is what enhanced conversions match on. Google hashes it in the
      browser before it leaves — it is not sent in the clear — and without it a
      click that converts on a different device to the one that saw the ad goes
      unmatched, which is most of the mobile traffic these campaigns buy.
    */
    track("generate_lead", {
      form_source: formSource,
      form_name: formSource,
      lead_source: payload.source,
      project_type: payload.projectType,
      user_data: {
        email: payload.email || undefined,
        phone_number: payload.phone || undefined,
      },
    });
    return { captured: true };
  }

  /*
    Nothing received it. Say so in the dataLayer — a capture path that has
    started failing is otherwise indistinguishable from a quiet week — and hand
    the mailto back so the form can offer it as an explicit choice.

    The mailto is deliberately not fired from here any more. Doing that meant a
    mail draft opening at the same moment the page was navigating to
    /thank-you, and which of the two the visitor saw first came down to how
    quickly their mail client woke up. Same code, different order on different
    machines — the exact behaviour that got reported as a bug. Handing the URL
    back leaves the timing to a click.
  */
  track("lead_capture_failed", {
    form_source: formSource,
    configured: isLeadCaptureConfigured,
  });

  return { captured: false, mailto: composeConsultationMailto(form) };
}
