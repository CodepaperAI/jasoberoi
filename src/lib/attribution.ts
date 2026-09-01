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
 * So the click identifiers are read from whatever page carries them and kept.
 *
 * Stored for ninety days, and a fresh ad click overwrites a stored one.
 *
 * This used sessionStorage with first-write-wins, on the reasoning that
 * attribution should expire when the visit does. That is defensible for
 * reporting and wrong for this business: a clinic owner reads a cost guide on
 * Monday and books on Thursday, and under session storage Thursday's lead
 * reported as organic while Google Ads had already been paid for Monday's
 * click. Ninety days matches the Google Ads conversion window, so what the
 * pipeline says and what the ads account says now agree.
 *
 * Last-click-wins for the same reason. If someone arrives on one ad, leaves,
 * and returns on a second, the second is the click that earned the enquiry.
 * The old first-write rule existed to stop a shared link carrying utm_source
 * from stealing credit from a real ad click — still a real risk, so a bare utm
 * set no longer displaces a stored Google click id. Only a new click id, or a
 * utm set arriving where none was stored, replaces what is there.
 *
 * Every access is wrapped, because storage throws outright in some privacy
 * modes rather than returning null — and a storage error must never be the
 * reason a lead form stops working.
 */

const KEY = "oberizon:attribution";

/** Ninety days, matching the Google Ads conversion window. */
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

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
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};

    const stored = JSON.parse(raw) as Attribution;

    // Past the conversion window it is no longer the click that earned the
    // lead, so it is treated as absent rather than reported as paid.
    const capturedAt = stored.capturedAt ? Date.parse(stored.capturedAt) : NaN;
    if (Number.isFinite(capturedAt) && Date.now() - capturedAt > TTL_MS) return {};

    return stored;
  } catch {
    return {};
  }
}

function write(value: Attribution) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Private mode. The lead still submits, it just submits unattributed.
  }
}

/**
 * Records the click identifiers when this page carries any.
 *
 * A Google click id always wins: it is the only unambiguous evidence that this
 * visit was bought. A bare utm set does not displace a stored click id, because
 * the common way that happens is a visitor sharing a link that already carried
 * campaign tags — which would hand the credit for a paid click to whoever
 * forwarded the URL.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const value = (key: string) => params.get(key) ?? undefined;

  const clickId = value("gclid") ?? value("wbraid") ?? value("gbraid");
  const hasUtm = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].some(
    (key) => params.get(key),
  );

  // Nothing on this URL to record.
  if (!clickId && !hasUtm) return;

  const existing = read();

  // A utm-only arrival must not overwrite a stored Google click.
  if (!clickId && (existing.gclid || existing.wbraid || existing.gbraid)) return;

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
