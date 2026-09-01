import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { altFor } from "@/lib/photos";
import { commercialLanding as content } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";
import { reviews, siteConfig } from "@/lib/site";

/**
 * Meta ads landing page — clinics, offices, retail.
 *
 * Rebuilt cinematic. The first version put the photograph in a rounded card
 * beside a large form panel, which read as a document with a contact form
 * attached rather than as a landing page — the client's word for it was
 * garbage, and they were right. The reference work in this category does the
 * opposite: one photograph filling the viewport, oversized type sitting on it,
 * and the numbers running across the foot of the image.
 *
 * The form moves to the second screen. The hero keeps two buttons and the
 * sticky bar keeps the form one tap away, so the call to action is still above
 * the fold even though the fields are not.
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
  const [lead, ...rest] = content.gallery;

  return (
    <div data-landing className="bg-ink text-white">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative isolate flex min-h-[88svh] flex-col">
        <Image
          src={content.gallery[1].image}
          alt={altFor(content.gallery[1].image)}
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        {/* Two scrims: a hard floor under the type, a softer wash over the rest,
            so the photograph still reads as a photograph. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/35" />
        <div className="absolute inset-0 -z-10 bg-ink/25" />

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
              data-analytics="meta-lp-commercial-header-call"
              className="ui-font inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] backdrop-blur transition hover:border-orange-400 hover:text-orange-400"
            >
              <Phone size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{siteConfig.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[86rem] flex-1 flex-col justify-end px-5 pb-7 pt-12 max-lg:pb-24 sm:px-10">
          <p className="ui-font text-[0.6875rem] font-extrabold uppercase tracking-[0.28em] text-orange-400">
            {content.eyebrow}
          </p>
          {/* Fluid, and large. This is the one thing every visitor sees. */}
          <h1 className="serif-font mt-6 max-w-[18ch] text-[clamp(2.5rem,7.2vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.02em]">
            {content.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 sm:mt-7 sm:text-lg sm:leading-8 text-white/80">{content.subhead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#request"
              data-analytics="meta-lp-commercial-hero-cta"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full bg-orange-600 px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-orange-600/30 transition hover:bg-orange-500"
            >
              Get a build plan
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.phoneHref}
              data-analytics="meta-lp-commercial-hero-call"
              className="ui-font hidden sm:inline-flex min-h-14 items-center gap-2.5 rounded-full border border-white/35 px-8 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur transition hover:border-orange-400 hover:text-orange-400"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
        </div>

        {/* The numbers, on the image. */}
        <div className="border-t border-white/20 bg-ink/35 backdrop-blur-sm">
          <dl className="mx-auto grid max-w-[86rem] grid-cols-2 gap-y-5 px-5 py-6 sm:px-10 lg:grid-cols-4">
            {content.proof.map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="serif-font block text-4xl leading-none sm:text-5xl">
                    {item.figure}
                    <span className="text-orange-400">{item.unit}</span>
                  </span>
                  <span className="mt-2.5 block text-[0.8125rem] leading-5 text-white/60">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* -------------------------------------------------------------- FORM */}
      <section id="request" className="scroll-mt-2 border-t border-white/10 px-5 py-20 sm:px-10">
        <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
              {content.formHeading}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">{content.closingText}</p>

            <ul className="mt-10 grid gap-5">
              {content.reassurance.map((line, index) => (
                <li key={line} className="flex items-start gap-5 border-t border-white/10 pt-5">
                  <span className="ui-font text-xs font-extrabold text-orange-400">
                    0{index + 1}
                  </span>
                  <span className="text-[0.9375rem] leading-7 text-white/80">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.05] p-6 sm:p-9">
            <LandingLeadForm content={content} tone="dark" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- WORK */}
      <section className="border-t border-white/10 px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-[86rem]">
          <h2 className="serif-font max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            Delivered clinics, with the address attached.
          </h2>

          {/* Layered rather than a flat row: the lead frame is tall and the
              other three stack beside it, which is what stops a gallery
              reading as a contact sheet. */}
          <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <figure className="group relative overflow-hidden rounded-[1.5rem]">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
                <Image
                  src={lead.image}
                  alt={altFor(lead.image)}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-6">
                <figcaption className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={15} aria-hidden="true" className="text-orange-400" />
                  {lead.caption}
                </figcaption>
              </div>
            </figure>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-3">
              {rest.map((shot) => (
                <figure key={shot.image} className="group relative overflow-hidden rounded-[1.5rem]">
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[10.5rem]">
                    <Image
                      src={shot.image}
                      alt={altFor(shot.image)}
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5">
                    <figcaption className="flex items-center gap-2 text-[0.8125rem] font-semibold">
                      <MapPin size={14} aria-hidden="true" className="text-orange-400" />
                      {shot.caption}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- OBJECTIONS */}
      <section className="border-t border-white/10 px-5 py-20 sm:px-10">
        <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            The questions <span className="orange-italic">everyone asks.</span>
          </h2>
          <dl className="grid gap-0">
            {content.objections.map((item, index) => (
              <div key={item.question} className="border-t border-white/12 py-7 last:border-b">
                <dt className="flex items-baseline gap-5 text-xl font-bold">
                  <span className="ui-font text-xs font-extrabold text-orange-400">
                    0{index + 1}
                  </span>
                  {item.question}
                </dt>
                <dd className="mt-3 pl-[2.4rem] leading-7 text-white/70">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- PROCESS */}
      <section className="border-t border-white/10 px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-[86rem]">
          <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">How a build runs.</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step) => (
              <li key={step.step} className="border-t border-orange-500/40 pt-6">
                <p className="serif-font text-5xl leading-none text-orange-400">{step.step}</p>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-7 text-white/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- REVIEWS */}
      <section className="border-t border-white/10 px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-[86rem]">
          <h2 className="serif-font text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">
            What clinic owners say.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.author} className="border-t border-white/15 pt-6">
                <blockquote className="text-[1.0625rem] leading-8 text-white/80">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-white/50">
                  <span className="block font-bold text-white">{review.author}</span>
                  {review.role}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CLOSE */}
      <section className="relative isolate overflow-hidden border-t border-white/10 px-5 py-24 sm:px-10">
        <Image
          src={content.gallery[3].image}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/75 to-ink" />
        <div className="mx-auto max-w-[86rem] text-center">
          <h2 className="serif-font mx-auto max-w-[20ch] text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
            {content.closingHeading}
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#request"
              data-analytics="meta-lp-commercial-close-cta"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full bg-orange-600 px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-orange-600/30 transition hover:bg-orange-500"
            >
              Get a build plan
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href={siteConfig.phoneHref}
              data-analytics="meta-lp-commercial-close-call"
              className="ui-font inline-flex min-h-14 items-center gap-2.5 rounded-full border border-white/35 px-8 text-xs font-extrabold uppercase tracking-[0.16em] transition hover:border-orange-400 hover:text-orange-400"
            >
              <Phone size={15} aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <LandingStickyCta content={content} tone="dark" />

      <footer className="border-t border-white/10 px-5 pb-28 pt-8 text-sm text-white/45 sm:px-10 lg:pb-8">
        <div className="mx-auto flex max-w-[86rem] flex-wrap items-center justify-between gap-3">
          <p>
            {siteConfig.name} · {siteConfig.address}
          </p>
          <p>
            {siteConfig.licenceStatus} · {siteConfig.insuranceStatus}
          </p>
        </div>
      </footer>
    </div>
  );
}
