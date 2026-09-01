"use client";

import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { HONEYPOT_FIELD, THANK_YOU_PATH, submitLead } from "@/lib/contact";
import type { LandingContent } from "@/lib/landing";
import { siteConfig } from "@/lib/site";

/**
 * The form on a paid landing page.
 *
 * Deliberately not ConsultationForm. That one asks six questions because a
 * visitor who has read a service page has already decided to talk to somebody;
 * a visitor who tapped an ad thirty seconds ago has not, and every field after
 * the fourth costs completions. This asks four, one of which is the qualifier
 * that makes the lead worth calling.
 *
 * The project-type options differ per campaign, which is the qualifier doing
 * its work: a residential ad that offers "Dental clinic" as an option is an ad
 * whose landing page did not match it.
 */

const OPTIONS: Record<LandingContent["campaign"], string[]> = {
  commercial: [
    "Dental clinic",
    "Medical clinic",
    "Physiotherapy or med spa",
    "Pharmacy",
    "Office",
    "Retail or other commercial",
  ],
  residential: [
    "Custom home build",
    "Whole-house renovation",
    "Addition or extension",
    "Kitchen or bathroom",
    "Basement conversion",
    "Not sure yet",
  ],
};

export function LandingLeadForm({
  content,
  tone,
}: {
  content: LandingContent;
  /** Matches the page it sits on; changes colour only. */
  tone: "dark" | "light";
}) {
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  const dark = tone === "dark";
  const field = dark
    ? "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-400"
    : "w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-500";
  const label = dark
    ? "grid gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70"
    : "grid gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-stone-500";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    const result = await submitLead(
      event.currentTarget,
      `meta-lp-${content.campaign}`,
      content.leadSource,
    );

    if (result.captured) {
      window.location.assign(THANK_YOU_PATH);
      return;
    }
    setState("error");
  }

  return (
    <form onSubmit={onSubmit} data-analytics={`meta-lp-${content.campaign}`} className="grid gap-3.5">
      {/* Same trap, same opaque name as the main form — see ConsultationForm. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" readOnly />
      </div>

      <label className={label}>
        Full name
        <input name="name" required className={field} placeholder="Jane Doe" />
      </label>
      <label className={label}>
        Phone
        <input name="phone" type="tel" required className={field} placeholder="(604) 000-0000" />
      </label>
      <label className={label}>
        Email
        <input name="email" type="email" required className={field} placeholder="jane@example.ca" />
      </label>
      <label className={label}>
        What are you building?
        <select name="projectType" required defaultValue="" className={field}>
          <option value="" disabled>
            Select one
          </option>
          {OPTIONS[content.campaign].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      {/* Not asked for, but carried: the city makes the lead callable. */}
      <label className={label}>
        City
        <input name="location" className={field} placeholder="Surrey, BC" />
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="ui-font mt-1 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-xl shadow-orange-600/25 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send size={16} aria-hidden="true" />
        {state === "sending" ? "Sending…" : "Request a callback"}
      </button>

      <p className={dark ? "text-xs leading-5 text-white/55" : "text-xs leading-5 text-stone-500"}>
        {content.formNote}
      </p>

      {state === "error" && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-sm leading-6 ${
            dark ? "bg-white/10 text-white/85" : "bg-orange-50 text-stone-700"
          }`}
        >
          That did not go through. Call{" "}
          <a href={siteConfig.phoneHref} className="font-bold underline underline-offset-2">
            {siteConfig.phone}
          </a>{" "}
          and we will take the details over the phone.
        </div>
      )}

      <a
        href={siteConfig.phoneHref}
        data-analytics={`meta-lp-${content.campaign}-call`}
        className={`ui-font inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border text-xs font-extrabold uppercase tracking-[0.14em] transition ${
          dark
            ? "border-white/25 text-white hover:border-orange-400 hover:text-orange-400"
            : "border-stone-300 text-stone-800 hover:border-orange-400 hover:text-orange-600"
        }`}
      >
        <Phone size={15} aria-hidden="true" />
        Or call {siteConfig.phone}
      </a>
    </form>
  );
}
