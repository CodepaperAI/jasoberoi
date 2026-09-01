import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { altFor } from "@/lib/photos";
import { residentialLanding as content } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";
import { reviews, siteConfig } from "@/lib/site";

/**
 * Meta ads landing page — custom homes and renovations.
 *
 * Same cinematic structure as the commercial page and a deliberately different
 * register: warm paper, an elegant serif at a lighter weight, and generous
 * measure, because a homeowner is buying a year of their life in their own
 * house rather than uptime. The commercial page is dark and blunt; this one
 * should feel like the brochure for the house.
 *
 * The proof problem is handled honestly. Every review Oberizon has is from a
 * clinic owner, so the section says so and explains why a homeowner should
 * care — inventing a homeowner is the one thing that would make this page
 * worthless the moment somebody checked.
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
    <div data-landing className="bg-[#f7f3ed] text-stone-900">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative isolate flex min-h-[88svh] flex-col">
        <Image
          src={content.gallery[0].image}
          alt={altFor(content.gallery[0].image)}
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        {/* Warmer and lighter than the commercial scrim — the house is the
            product here, so the photograph is held brighter. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/68 to-[#1a1512]/25" />

        {/* Top scrim. The residential hero opens on a bright dusk sky and the
            white logo disappeared into it — a header you cannot read is a
            brand the ad did not get credit for. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/55 to-transparent" />
        <header className="px-5 py-6 sm:px-10">
          <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4">
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
              data-analytics="meta-lp-residential-header-call"
              className="ui-font inline-flex items-center gap-2 rounded-full border border-white/35 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:border-orange-300 hover:text-orange-300"
            >
              <Phone size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{siteConfig.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[86rem] flex-1 flex-col justify-end px-5 pb-7 pt-12 max-lg:pb-24 text-white sm:px-10">
          <p className="ui-font text-[0.6875rem] font-extrabold uppercase tracking-[0.28em] text-orange-300">
            {content.eyebrow}
          </p>
          <h1 className="serif-font mt-6 max-w-[17ch] text-[clamp(2.4rem,6.6vw,5.25rem)] font-normal leading-[1.02] tracking-[-0.02em]">
            {content.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 sm:mt-7 sm:text-lg sm:leading-8 text-white/85">{content.subhead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#request"
              data-analytics="meta-lp-residential-hero-cta"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full bg-orange-600 px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/30 transition hover:bg-orange-500"
            >
              Get a plan and a timeline
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.phoneHref}
              data-analytics="meta-lp-residential-hero-call"
              className="ui-font hidden sm:inline-flex min-h-14 items-center gap-2.5 rounded-full border border-white/40 px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:border-orange-300 hover:text-orange-300"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <div className="border-t border-white/25 bg-black/25 backdrop-blur-sm">
          <dl className="mx-auto grid max-w-[86rem] grid-cols-2 gap-y-5 px-5 py-6 text-white sm:px-10 lg:grid-cols-4">
            {content.proof.map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="serif-font block text-4xl leading-none sm:text-5xl">
                    {item.figure}
                    <span className="text-orange-300">{item.unit}</span>
                  </span>
                  <span className="mt-2.5 block text-[0.8125rem] leading-5 text-white/70">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------------------------------------- FORM */}
      <section id="request" className="scroll-mt-2 px-5 py-20 sm:px-10">
        <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
              {content.formHeading}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">{content.closingText}</p>

            <ul className="mt-10 grid gap-4">
              {content.reassurance.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-4 border-t border-stone-300/70 pt-4 text-[0.9375rem] leading-7 text-stone-700"
                >
                  <ShieldCheck size={19} aria-hidden="true" className="mt-1 shrink-0 text-orange-600" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-2xl shadow-stone-900/[0.07] sm:p-9">
            <LandingLeadForm content={content} tone="light" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- OBJECTIONS */}
      <section className="border-t border-stone-300/70 px-5 py-20 sm:px-10">
        <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            What people <span className="orange-italic">actually worry about.</span>
          </h2>
          <dl className="grid gap-0">
            {content.objections.map((item, index) => (
              <div key={item.question} className="border-t border-stone-300/70 py-7 last:border-b">
                <dt className="flex items-baseline gap-5 text-xl font-bold text-stone-900">
                  <span className="ui-font text-xs font-extrabold text-orange-600">0{index + 1}</span>
                  {item.question}
                </dt>
                <dd className="mt-3 pl-[2.4rem] leading-7 text-stone-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- PROCESS */}
      <section className="border-t border-stone-300/70 bg-white px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-[86rem]">
          <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            From first walk to handover.
          </h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step) => (
              <li key={step.step} className="border-t border-orange-500/40 pt-6">
                <p className="serif-font text-5xl leading-none text-orange-600">{step.step}</p>
                <h3 className="mt-5 text-xl font-bold text-stone-900">{step.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-7 text-stone-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- REVIEWS */}
      <section className="border-t border-stone-300/70 px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-[86rem]">
          <h2 className="serif-font max-w-[20ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            The same team, in their clients&rsquo; words.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
            Most of Oberizon&rsquo;s work is clinical construction, so most of its reviews are from
            clinic owners. It is the same site leads and the same process on a house.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.author} className="border-t border-stone-300 pt-6">
                <blockquote className="text-[1.0625rem] leading-8 text-stone-700">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-stone-500">
                  <span className="block font-bold text-stone-900">{review.author}</span>
                  {review.role}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CLOSE */}
      <section className="relative isolate overflow-hidden px-5 py-24 sm:px-10">
        <Image
          src={content.gallery[1].image}
          alt={altFor(content.gallery[1].image)}
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a1512]/85 via-[#1a1512]/75 to-[#1a1512]/90" />
        <div className="mx-auto max-w-[86rem] text-center text-white">
          <h2 className="serif-font mx-auto max-w-[20ch] text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
            {content.closingHeading}
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#request"
              data-analytics="meta-lp-residential-close-cta"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full bg-orange-600 px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/30 transition hover:bg-orange-500"
            >
              Get a plan and a timeline
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.phoneHref}
              data-analytics="meta-lp-residential-close-call"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full border border-white/40 px-8 text-xs font-extrabold uppercase tracking-[0.16em] transition hover:border-orange-300 hover:text-orange-300"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <LandingStickyCta content={content} tone="light" />

      <footer className="border-t border-stone-300/70 px-5 pb-28 pt-8 text-sm text-stone-500 sm:px-10 lg:pb-8">
        <div className="mx-auto flex max-w-[86rem] flex-wrap items-center justify-between gap-3">
          <p>
            {siteConfig.name} · {siteConfig.address}
          </p>
          <p>
            {siteConfig.licenceStatus} · {siteConfig.warranty}
          </p>
        </div>
      </footer>
    </div>
  );
}
