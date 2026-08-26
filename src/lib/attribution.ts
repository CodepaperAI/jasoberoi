/**
 * Where a visitor came from, captured once and carried to the lead.
 *
 * The Google Ads campaign points at /services/dental-clinic-construction/, but
 * almost nobody submits from the page they landed on — they read, click through
 * to another service or a guide, and enquire from somewhere else entirely. By
 * that point the URL carries no gclid and document.referrer is this same site,
 * so a lead captured at submit time looks organic and the campaign gets credited
 * with nothing it actually paid for.
 *
 * So the click identifiers are read on the first page of the session and kept in
 * sessionStorage. Session, not local: attribution should expire when the visit
 * does, otherwise a lead six weeks later still reports as paid.
 *
 * Every access is wrapped, because sessionStorage throws outright in some
 * privacy modes rather than returning null — and a storage error must never be
 * the reason a lead form stops working.
 */

const KEY = "oberizon:attribution";

export type Attribution = {
  gclid?: string;
  /** Set instead of gclid when the click was cookieless — iOS and consent-limited traffic. */
  wbraid?: string;
  gbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** The page the session started on, which is the ad's landing page for paid traffic. */
  landingPage?: string;
  /** The external site that sent them, empty for direct. */
  referrer?: string;
  capturedAt?: string;
};

/**
 * The opportunity Source written into GHL.
 *
 * Two values, deliberately. Anything more granular is better expressed by the
 * campaign fields that travel alongside it — a source per ad group would make
 * the pipeline unreadable, which is the thing a Source field is for.
 */
export const PAID_SOURCE = "Rohit Google Ads";
export const ORGANIC_SOURCE = "Website";

function read(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function write(value: Attribution) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Private mode. The lead still submits, it just submits unattributed.
  }
}

/**
 * Records the click identifiers if this is the first page of the session.
 *
 * First write wins. A visitor who arrives on an ad and then navigates to a page
 * carrying its own utm_source in a shared link would otherwise have the paid
 * click overwritten by the later one, and the campaign would lose the lead it
 * bought.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;

  const existing = read();
  if (existing.capturedAt) return;

  const params = new URLSearchParams(window.location.search);
  const value = (key: string) => params.get(key) ?? undefined;

  const captured: Attribution = {
    gclid: value("gclid"),
    wbraid: value("wbraid"),
    gbraid: value("gbraid"),
    utmSource: value("utm_source"),
    utmMedium: value("utm_medium"),
    utmCampaign: value("utm_campaign"),
    utmTerm: value("utm_term"),
    utmContent: value("utm_content"),
    landingPage: window.location.pathname,
    // Only an external referrer is worth keeping; our own pages are noise.
    referrer: document.referrer && !document.referrer.includes(window.location.host)
      ? document.referrer
      : undefined,
    capturedAt: new Date().toISOString(),
  };

  write(captured);
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return read();
}

/**
 * Whether this visit was bought.
 *
 * gclid is the reliable signal and is present on every Google Ads click with
 * auto-tagging on. wbraid and gbraid replace it where the click was cookieless,
 * so treating their absence as organic would misreport a large share of iOS
 * traffic. The utm pair is the fallback for manually tagged campaigns.
 */
export function isPaidGoogle(attribution: Attribution = getAttribution()) {
  if (attribution.gclid || attribution.wbraid || attribution.gbraid) return true;

  const source = attribution.utmSource?.toLowerCase();
  const medium = attribution.utmMedium?.toLowerCase();
  return source === "google" && (medium === "cpc" || medium === "ppc" || medium === "paid");
}

export function leadSource(attribution: Attribution = getAttribution()) {
  return isPaidGoogle(attribution) ? PAID_SOURCE : ORGANIC_SOURCE;
}
