import { siteConfig } from "@/lib/site";

/**
 * Turns a consultation form into a prefilled mailto.
 *
 * next.config.ts sets `output: "export"`, so the site builds to static files and
 * there is no server to receive a POST — a route handler is not available here.
 *
 * Before this, both lead forms rendered their submit as `type="button"` with no
 * handler at all. Clicking did nothing, so every enquiry anyone typed into this
 * site was silently discarded.
 *
 * A mailto is not the right long-term answer: it depends on the visitor having a
 * mail client configured and it loses anyone on a phone without one. It is
 * however strictly better than a dead button, and it needs no credentials.
 * Replace with a hosted endpoint — Formspree, Web3Forms, Vercel Forms — as soon
 * as the client picks one.
 */
export function composeConsultationMailto(form: HTMLFormElement) {
  const data = new FormData(form);
  const get = (key: string) => String(data.get(key) ?? "").trim();

  const body = [
    `Name: ${get("name")}`,
    `Email: ${get("email")}`,
    `Phone: ${get("phone")}`,
    `Location: ${get("location")}`,
    `Project type: ${get("projectType")}`,
    "",
    get("details"),
  ].join("\n");

  const subject = `Consultation request — ${get("projectType") || "Oberizon Construction"}`;

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Where a completed enquiry lands. GTM matches on "URL contains /thank-you". */
export const THANK_YOU_PATH = "/thank-you/";

/**
 * Opens the prefilled email, then sends the visitor to the thank-you page.
 *
 * The Google Ads conversion 4peQCKv4psYcEIXTsKU_ fires on a trigger whose
 * condition is "Page URL contains /thank-you". That page existed on the old
 * site; after the cutover it redirected to /contact/, so the trigger stopped
 * matching and the conversion has reported zero ever since — while the campaign
 * kept spending. Landing a submitted enquiry on a real /thank-you/ restores it
 * without touching the Ads or GTM account.
 *
 * The two navigations have to be sequenced. A mailto: hands off to the OS mail
 * handler and leaves the document in place, but assigning location.href twice in
 * the same tick means the second assignment wins and the mail client never
 * opens. The timeout lets the handoff start before the page navigates away.
 *
 * What this measures is an enquiry composed, not an email confirmed sent — the
 * browser cannot see whether the visitor pressed send. That is the same thing
 * the old site's thank-you page measured, so the conversion stays comparable to
 * its own history rather than to an ideal.
 */
export function submitConsultation(form: HTMLFormElement) {
  window.location.href = composeConsultationMailto(form);

  window.setTimeout(() => {
    window.location.assign(THANK_YOU_PATH);
  }, 600);
}
