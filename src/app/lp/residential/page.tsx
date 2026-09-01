import Image from "next/image";
import type { Metadata } from "next";
import { Phone, ShieldCheck } from "lucide-react";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { altFor } from "@/lib/photos";
import { residentialLanding as content } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";
import { reviews, siteConfig } from "@/lib/site";

/**
 * Meta ads landing page — custom homes and renovations.
 *
 * Light, warm and editorial, and deliberately the opposite of the commercial
 * page: a homeowner is buying a year of their life in their own house, not
 * uptime. Full-bleed photograph, serif headline, generous measure.
 *
 * The proof problem is real and is handled honestly. Every review Oberizon has
 * is from a clinic owner, so they are labelled as exactly that and framed as
 * what the same team is like to work with — no invented homeowner testimonial,
 * which is the one thing that would make this page worthless if spotted.
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

export default function ResidentialLandingPage() {
  return (
    <div data-landing className="bg-[#faf7f3] text-stone-900">
      <header className="px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Image
            src="/oberizon/oberizon-logo.svg"
            alt="Oberizon Construction"
            width={192}
            height={88}
            className="h-10 w-auto sm:h-12"
            priority
          />
          <a
            href={siteConfig.phoneHref}
            data-analytics="meta-lp-residential-header-call"
            className="ui-font inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-orange-600"
          >
            <Phone size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{siteConfig.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </header>

      <section className="px-5 pb-12 pt-3 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="ui-font text-[0.6875rem] font-extrabold uppercase tracking-[0.22em] text-orange-600">
            {content.eyebrow}
          </p>
          {/* Held to 2.9rem at lg so the form's submit button clears 900px.
              A CTA below the fold on a page where most visitors never scroll
              is a CTA most visitors never see. */}
          <h1 className="serif-font mt-4 max-w-3xl text-[2rem] leading-[1.12] sm:text-[2.6rem] lg:text-[2.9rem]">
            {content.headline}
          </h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              {/* The photograph leads on this page. A homeowner is buying a
                  finished result they can picture themselves inside. */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-stone-200">
                <Image
                  src={content.gallery[0].image}
                  alt={altFor(content.gallery[0].image)}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>

              <p className="mt-8 max-w-xl text-lg leading-8 text-stone-600">{content.subhead}</p>

              <div className="mt-8 grid gap-3">
                {content.reassurance.map((line) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-[0.9375rem] leading-6 text-stone-700"
                  >
                    <ShieldCheck size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-orange-600" />
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-8 lg:sticky lg:top-8 lg:self-start">
              <h2 className="serif-font text-2xl leading-tight">{content.formHeading}</h2>
              <div className="mt-6">
                <LandingLeadForm content={content} tone="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          {content.proof.map((item) => (
            <div key={item.label}>
              <p className="serif-font text-3xl leading-none text-stone-900 sm:text-4xl">
                {item.figure}
                <span className="text-xl text-orange-600">{item.unit}</span>
              </p>
              <p className="mt-2 text-sm leading-5 text-stone-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="serif-font text-3xl sm:text-4xl">
              What people <span className="orange-italic">actually worry about.</span>
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-stone-500">
              Answered here rather than on a call, because they are the reason people hesitate.
            </p>
          </div>
          <dl className="grid gap-6">
            {content.objections.map((item) => (
              <div key={item.question} className="border-b border-stone-200 pb-6 last:border-b-0 last:pb-0">
                <dt className="text-lg font-bold text-stone-900">{item.question}</dt>
                <dd className="mt-2.5 leading-7 text-stone-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="serif-font text-3xl sm:text-4xl">From first walk to handover.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step) => (
              <li key={step.step}>
                <p className="ui-font text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
                  {step.step}
                </p>
                <h3 className="mt-3 text-xl font-bold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-7 text-stone-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/*
        Labelled for exactly what it is. Every review Oberizon holds is from a
        clinic owner; presenting one as a homeowner would be the only real lie
        available on this page, so the heading says whose words these are and
        why a homeowner should care.
      */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="serif-font text-3xl sm:text-4xl">The same team, in their clients&rsquo; words.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-stone-500">
            Most of Oberizon&rsquo;s work is clinical construction, so most of its reviews are from clinic
            owners. It is the same site leads and the same process on a house.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.author} className="rounded-2xl border border-stone-200 bg-white p-6">
                <blockquote className="leading-7 text-stone-700">“{review.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-stone-500">
                  <span className="font-bold text-stone-900">{review.author}</span> · {review.role}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white px-5 py-16 sm:px-8">
        <div id="request" className="mx-auto grid max-w-6xl scroll-mt-4 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="serif-font text-3xl sm:text-4xl">{content.closingHeading}</h2>
            <p className="mt-5 max-w-xl leading-8 text-stone-600">{content.closingText}</p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-[#faf7f3] p-6 sm:p-8">
            <LandingLeadForm content={content} tone="light" />
          </div>
        </div>
      </section>

      <LandingStickyCta content={content} tone="light" />

      <footer className="border-t border-stone-200 px-5 pb-28 pt-8 text-sm lg:pb-8 text-stone-500 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>
            {siteConfig.name} · {siteConfig.address}
          </p>
          <p>{siteConfig.licenceStatus} · {siteConfig.warranty}</p>
        </div>
      </footer>
    </div>
  );
}
