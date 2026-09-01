"use client";

import { useState } from "react";
import { Lock, Phone } from "lucide-react";
import { FormTimestamp } from "@/components/FormTimestamp";
import { HONEYPOT_FIELD, THANK_YOU_PATH, submitLead } from "@/lib/contact";
import type { LandingContent } from "@/lib/landing";
import { siteConfig } from "@/lib/site";

/**
 * The form on a paid landing page.
 *
 * Rewritten because the first one looked, in the client's words, illegal — and
 * it did. Grey inputs on a grey panel with no real borders, placeholder text
 * reading "jane@example.ca", an all-caps saturated orange bar, and not one
 * trust signal within reach of it. That is the visual grammar of a phishing
 * form, and no amount of good copy above it survives that.
 *
 * Four things fix it, and they are all about legitimacy rather than polish:
 *
 *   1. The card is white on both pages, including the dark one. A white form on
 *      a dark page reads as a document; a dark form on a dark page reads as an
 *      overlay somebody injected.
 *   2. Real bordered inputs with dark text on white, so a field looks like a
 *      field.
 *   3. A named human, a privacy line and the licence row directly under the
 *      button. Who gets this, what happens to it, and who is asking.
 *   4. Sentence case on the button. Tracked-out uppercase on a saturated block
 *      is what ad-network creative looks like.
 *
 * Still four fields plus a qualifier — the completion argument has not changed.
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

const FIELD =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-[0.9375rem] text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15";
const LABEL = "grid gap-1.5 text-[0.8125rem] font-semibold text-stone-700";

export function LandingLeadForm({ content }: { content: LandingContent }) {
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

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
    <form onSubmit={onSubmit} data-analytics={`meta-lp-${content.campaign}`} className="grid gap-4">
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" readOnly />
      </div>
      <FormTimestamp />

      <label className={LABEL}>
        Your name
        <input name="name" required autoComplete="name" className={FIELD} placeholder="First and last name" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={LABEL}>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" className={FIELD} placeholder="604 000 0000" />
        </label>
        <label className={LABEL}>
          City
          <input name="location" autoComplete="address-level2" className={FIELD} placeholder="Surrey" />
        </label>
      </div>

      <label className={LABEL}>
        Email
        <input name="email" type="email" required autoComplete="email" className={FIELD} placeholder="you@yourclinic.ca" />
      </label>

      <label className={LABEL}>
        What are you building?
        <select name="projectType" required defaultValue="" className={FIELD}>
          <option value="" disabled>
            Select one
          </option>
          {OPTIONS[content.campaign].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-1 inline-flex min-h-14 items-center justify-center rounded-xl bg-orange-600 px-6 text-base font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "sending" ? "Sending…" : "Request a callback"}
      </button>

      {/* Who is asking, and what happens to this. Directly under the button,
          because that is the moment the question occurs. */}
      <p className="flex items-start gap-2 text-[0.8125rem] leading-6 text-stone-500">
        <Lock size={14} aria-hidden="true" className="mt-1 shrink-0" />
        <span>
          Goes straight to {siteConfig.founderName} and the {siteConfig.name} office in White Rock.
          We reply the same working day. Your details are never sold or shared.
        </span>
      </p>

      <p className="border-t border-stone-200 pt-4 text-[0.75rem] leading-5 text-stone-500">
        {siteConfig.licenceStatus} · {siteConfig.insuranceStatus}
      </p>

      {state === "error" && (
        <div role="status" className="rounded-xl bg-orange-50 px-4 py-3 text-sm leading-6 text-stone-700">
          That did not go through. Call{" "}
          <a href={siteConfig.phoneHref} className="font-bold underline underline-offset-2">
            {siteConfig.phone}
          </a>{" "}
          and we will take the details over the phone.
        </div>
      )}
    </form>
  );
}

/** The phone number, for pages that want it beside the form rather than in it. */
export function LandingCallLine({ campaign }: { campaign: LandingContent["campaign"] }) {
  return (
    <a
      href={siteConfig.phoneHref}
      data-analytics={`meta-lp-${campaign}-call`}
      className="inline-flex items-center gap-2 text-base font-bold text-stone-900 underline-offset-4 hover:underline"
    >
      <Phone size={16} aria-hidden="true" className="text-orange-600" />
      {siteConfig.phone}
    </a>
  );
}
