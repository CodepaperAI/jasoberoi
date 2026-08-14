import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { buildMetadata } from "@/lib/seo";
import { postsByDate, postPath } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * The page a submitted enquiry lands on.
 *
 * It exists for one measurable reason: the Google Ads conversion
 * 4peQCKv4psYcEIXTsKU_ fires on "Page URL contains /thank-you". That was a real
 * page on the old site. After the cutover it redirected to /contact/, the
 * trigger stopped matching, and the conversion reported zero while the campaign
 * kept spending.
 *
 * noindex, and deliberately absent from the sitemap. A thank-you page has
 * nothing to rank for, and one that turns up in results sends people who never
 * enquired through a conversion trigger — which is worse than not ranking.
 * noindex does not affect GTM: the container still fires on the pageview.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Thank you — we have your request | Oberizon Construction",
    description:
      "Your consultation request has been started. We reply to enquiries within one business day.",
    path: "/thank-you",
    index: false,
  }),
};

export default function ThankYouPage() {
  const reading = postsByDate().slice(0, 3);

  return (
    <section className="bg-paper px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2 text-accent">
            <CheckCircle2 size={16} aria-hidden="true" />
            Request started
          </p>

          <h1 className="h-section mt-5 text-ink">
            Thank you — check your email is on its way.
          </h1>

          {/* Honest about the mechanism. The form composes a message in the
              visitor's own mail client rather than posting to a server, so
              "we've received it" would be a claim the site cannot make. */}
          <p className="mt-6 text-lg leading-8 text-ink-soft">
            Your enquiry opens in your own email app with the details already
            filled in. If it did not open, or you would rather not use email,
            call or message us directly — both reach the same team.
          </p>

          <p className="mt-4 text-lg leading-8 text-ink-soft">
            We reply to enquiries within one business day. If your project has a
            lease deadline or a target opening date, say so in the message and we
            will prioritise it.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={siteConfig.phoneHref}
              data-analytics="thank-you-call"
              className="ui-font inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-600 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-orange-500"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <WhatsAppLink
              analytics="thank-you-whatsapp"
              iconSize={15}
              className="ui-font inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#1eb457]"
            />
          </div>
        </div>

        {/* Something to do while they wait, rather than a dead end. */}
        <div className="mt-16 border-t border-line pt-8">
          <h2 className="text-xl font-bold text-ink">While you wait</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {reading.map((post) => (
              <li key={post.slug}>
                <Link
                  href={postPath(post.slug)}
                  className="font-medium text-accent-dark underline decoration-orange-300 underline-offset-2 hover:decoration-orange-500"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
