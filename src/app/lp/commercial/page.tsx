import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { altFor } from "@/lib/photos";
import { commercialLanding as content } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";
import { reviews, siteConfig } from "@/lib/site";

/**
 * Meta ads landing page — clinics, offices, retail.
 *
 * Dark, dense and technical, because the visitor is a practice owner whose real
 * fear is downtime and overrun, not aesthetics. It deliberately looks unlike the
 * marketing site: no navigation, one destination, and the form in the first
 * screen beside the headline rather than at the bottom of a scroll.
 *
 * noindex — see the note at the top of src/lib/landing.ts.
 */

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  image: content.gallery[0].image,
  index: false,
});

export default function CommercialLandingPage() {
  return (
    <div data-landing className="bg-ink text-white">
      {/* Bar, not a nav. The logo and the phone number are the only two things
          here, because every other link is a way out of a page the click was
          paid for. */}
      <header className="border-b border-white/10 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            width={192}
            height={88}
            className="h-9 w-auto brightness-0 invert sm:h-11"
            priority
          />
          <a
            href={siteConfig.phoneHref}
            data-analytics="meta-lp-commercial-header-call"
            className="ui-font inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:border-orange-400 hover:text-orange-400"
          >
            <Phone size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{siteConfig.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      {/* Above the fold: headline, three objections answered, and the form. */}
      <section className="relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
        <Image
          src={content.gallery[1].image}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/90 to-ink" />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="ui-font text-[0.6875rem] font-extrabold uppercase tracking-[0.22em] text-orange-400">
              {content.eyebrow}
            </p>
            <h1 className="serif-font mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              {content.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">{content.subhead}</p>

            <ul className="mt-8 grid gap-3">
              {content.reassurance.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[0.9375rem] leading-7 text-white/85">
                  <CheckCircle2 size={19} aria-hidden="true" className="mt-1 shrink-0 text-orange-400" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/12 pt-8 sm:grid-cols-3">
              {content.proof.map((item) => (
                <div key={item.label}>
                  <p className="serif-font text-3xl leading-none sm:text-4xl">
                    {item.figure}
                    <span className="text-xl text-orange-400">{item.unit}</span>
                  </p>
                  <p className="mt-2 text-sm leading-5 text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur sm:p-8 lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-2xl font-bold leading-tight">{content.formHeading}</h2>
            <div className="mt-6">
              <LandingLeadForm content={content} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Delivered work, named. A photograph with an address under it is the one
          thing a competitor cannot copy onto their own page. */}
      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="serif-font text-3xl sm:text-4xl">Recent clinic and commercial work.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.gallery.map((shot) => (
              <figure key={shot.image} className="overflow-hidden rounded-2xl bg-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={shot.image}
                    alt={altFor(shot.image)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-start gap-2 px-4 py-3.5 text-[0.8125rem] leading-5 text-white/70">
                  <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-orange-400" />
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="serif-font text-3xl sm:text-4xl">
              The questions <span className="orange-italic">everyone asks.</span>
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-white/60">
              Answered here rather than on a call, because they are the reason people hesitate.
            </p>
          </div>
          <dl className="grid gap-6">
            {content.objections.map((item) => (
              <div key={item.question} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                <dt className="text-lg font-bold">{item.question}</dt>
                <dd className="mt-2.5 leading-7 text-white/70">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="serif-font text-3xl sm:text-4xl">How a build runs.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step) => (
              <li key={step.step}>
                <p className="ui-font text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
                  {step.step}
                </p>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-7 text-white/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Real reviews, attributed. All three are clinic owners, which is what
          the project list says the work is. */}
      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="serif-font text-3xl sm:text-4xl">What clinic owners say.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.author} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                <blockquote className="leading-7 text-white/80">“{review.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-white/55">
                  <span className="font-bold text-white">{review.author}</span> · {review.role}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-8">
        <div id="request" className="mx-auto grid max-w-6xl scroll-mt-4 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="serif-font text-3xl sm:text-4xl">{content.closingHeading}</h2>
            <p className="mt-5 max-w-xl leading-8 text-white/70">{content.closingText}</p>
          </div>
          <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-6 sm:p-8">
            <LandingLeadForm content={content} tone="dark" />
          </div>
        </div>
      </section>

      <LandingStickyCta content={content} tone="dark" />

      <footer className="border-t border-white/10 px-5 pb-28 pt-8 text-sm lg:pb-8 text-white/45 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>
            {siteConfig.name} · {siteConfig.address}
          </p>
          <p>{siteConfig.licenceStatus} · {siteConfig.insuranceStatus}</p>
        </div>
      </footer>
    </div>
  );
}
