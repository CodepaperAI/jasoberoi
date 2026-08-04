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
