"use client";

import { ArrowUpRight } from "lucide-react";

/**
 * The event ContactDock listens for. Dispatched instead of shared React state
 * because this button renders inside server components (PageHero, ReviewCta)
 * while the dock is a client island mounted once in the layout — a window
 * event is the only channel they both already share.
 */
export const OPEN_CONSULTATION_EVENT = "oberizon:open-consultation";

/**
 * "Book a Consultation" for pages where linking to /contact would be a loop.
 *
 * Every CTA on the site funnels to /contact — correct everywhere except on
 * /contact itself, where the hero and closing band pointed the visitor back at
 * the page they were already reading. Clicking looked like a dead button, and
 * the only real form was hidden behind the floating dock.
 *
 * This opens that same dock dialog: one form, one submit path, one thank-you
 * conversion, rather than a second copy that would drift from the first.
 *
 * Styling matches ButtonLink's red tone exactly — same classes, same arrow —
 * so swapping the two is invisible.
 */
export function BookConsultationButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSULTATION_EVENT))}
      className={[
        "ui-font inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-orange-400/70",
        "amber-button text-white",
        className,
      ].join(" ")}
    >
      <span>Book a Consultation</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.4} />
    </button>
  );
}
