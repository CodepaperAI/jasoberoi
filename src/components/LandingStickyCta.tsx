import { Phone } from "lucide-react";
import type { LandingContent } from "@/lib/landing";
import { siteConfig } from "@/lib/site";

/**
 * The bar that makes the form reachable on a phone.
 *
 * Measured on the built pages at 390x844: the submit button sits about 1,600px
 * down, which is nearly two full screens. Meta traffic is overwhelmingly mobile
 * and roughly 60% of landing-page visitors never scroll, so without this the
 * form on both pages is effectively invisible to most of the spend.
 *
 * Two actions and no more. Calling is the higher-intent one and gets the solid
 * button; the anchor jumps to the form rather than opening anything, so the
 * page never has to load or render a second thing to convert.
 *
 * Hidden from lg up, where the form is already beside the headline.
 *
 * Sentence case, matching the form's own button. Tracked-out uppercase on a
 * saturated block is what ad-network creative looks like, and it was part of
 * why these pages read as untrustworthy.
 */
export function LandingStickyCta({
  content,
  tone,
}: {
  content: LandingContent;
  tone: "dark" | "light";
}) {
  const dark = tone === "dark";

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-50 flex items-center gap-2.5 border-t px-4 py-3 lg:hidden",
        dark ? "border-white/12 bg-ink/95 backdrop-blur" : "border-stone-200 bg-white/95 backdrop-blur",
      ].join(" ")}
    >
      <a
        href="#request"
        data-analytics={`meta-lp-${content.campaign}-sticky-form`}
        className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-orange-600 px-4 text-[0.9375rem] font-bold text-white transition hover:bg-orange-700"
      >
        Request a callback
      </a>
      <a
        href={siteConfig.phoneHref}
        aria-label={`Call Oberizon Construction at ${siteConfig.phone}`}
        data-analytics={`meta-lp-${content.campaign}-sticky-call`}
        className={[
          "inline-flex min-h-12 w-14 items-center justify-center rounded-xl border transition",
          dark
            ? "border-white/25 text-white hover:border-orange-400 hover:text-orange-400"
            : "border-stone-300 text-stone-800 hover:border-orange-400 hover:text-orange-600",
        ].join(" ")}
      >
        <Phone size={19} aria-hidden="true" />
      </a>
    </div>
  );
}
