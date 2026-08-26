import { getAttribution, isPaidGoogle, leadSource } from "@/lib/attribution";
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
export function buildLeadPayload(form: HTMLFormElement, formSource: string) {
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

    source: leadSource(attribution),
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
): Promise<SubmitResult> {
  /*
    A person cannot see the honeypot field, so anything in it came from a bot.
    Report success and post nothing: an error would tell the bot to retry with a
    different shape, and the pipeline stays clean either way.
  */
  const honeypot = String(new FormData(form).get("companyWebsite") ?? "").trim();
  if (honeypot) return { captured: true };

  const payload = buildLeadPayload(form, formSource);

  const captured = await postLead(payload);

  if (captured) {
    track("generate_lead", {
      form_source: formSource,
      lead_source: payload.source,
      project_type: payload.projectType,
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
