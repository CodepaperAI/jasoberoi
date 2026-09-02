import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, HardHat, Home, Phone, ShieldCheck, Star } from "lucide-react";
import { LandingFormDialog } from "@/components/LandingFormDialog";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { altFor } from "@/lib/photos";
import { residentialLanding as content, landingCounts } from "@/lib/landing";
import { buildMetadata } from "@/lib/seo";
import { reviews, siteConfig } from "@/lib/site";

/**
 * Meta ads landing page — custom homes and renovations.
 *
 * Third rebuild, and this one follows a reference the client supplied rather
 * than my reading of the category. The language is warm off-white, floating
 * white cards on soft shadows, a bold sans headline with a serif italic accent
 * line under it, pill buttons with a near-black primary, a stat rail beside the
 * photograph and a four-up assurance bar under the fold line.
 *
 * Near-black rather than orange on the primary button is deliberate. A large
 * saturated orange block is what made the earlier versions read as ad-network
 * creative; orange stays as the accent on the italic line, the icons and the
 * small marks, which is more of the brand in less of the page.
 *
 * noindex — see the note at the top of src/lib/landing.ts.
 */

const FEATURE_ICONS = [ShieldCheck, CalendarCheck, Home, HardHat];

export const metadata: Metadata = buildMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: content.path,
  image: content.gallery[0].image,
  index: false,
});

export default function ResidentialLandingPage() {
  const [exterior, entry, kitchen] = content.gallery;

  return (
    <div data-landing className="bg-[#F4F1EB] text-[#1B1A18]">
      {/* ------------------------------------------------------------- HERO */}
      {/*
        Full bleed. The photograph is the hero rather than an illustration
        beside it — a contained image in a rounded box next to a column of text
        is a product page, and this is a builder whose entire case is the rooms
        they hand over. `isolate` so the -z-10 image and scrim stack behind the
        content and not behind the page.
      */}
      <section className="relative isolate flex min-h-[92svh] flex-col text-white">
        <Image
          src={exterior.image}
          alt={altFor(exterior.image)}
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        {/* Diagonal, so the type side is dark enough to read and the far corner
            still shows the photograph. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/62 via-black/34 to-black/10" />
        {/* A light second scrim under the type column — enough to hold the
            headline, not enough to read as a dark panel laid over the
            photograph. The description carries its own contrast in orange
            rather than relying on the background being dark. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

        <header className="px-5 pt-6 sm:px-8">
          <div className="mx-auto flex max-w-[82rem] items-center justify-between gap-4">
            <Image
              src="/oberizon/optimized/oberizon-logo.png"
              alt="Oberizon Construction"
              width={192}
              height={88}
              className="h-10 w-auto brightness-0 invert sm:h-12"
              priority
            />
            <a
              href={siteConfig.phoneHref}
              data-analytics="meta-lp-residential-header-call"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <Phone size={15} aria-hidden="true" />
              <span className="hidden sm:inline">{siteConfig.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </header>

        {/* pb clears the assurance bar, which is pulled up 14 units to straddle
            the hero edge and was landing on top of the social-proof row. */}
        <div className="mx-auto flex w-full max-w-[82rem] flex-1 items-center px-5 pb-28 pt-14 sm:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] backdrop-blur">
                {content.eyebrow}
              </span>

              <h1 className="mt-7 text-[clamp(2.2rem,4.2vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.025em]">
                {content.headline}
                <span className="serif-font mt-1 block font-normal italic text-[#FF811C]">
                  {content.headlineAccent}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[1.1875rem] font-bold leading-8 text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.6)] sm:text-[1.3125rem] sm:leading-9">
                {content.subhead}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#request"
                data-open-lead-form
                  data-analytics="meta-lp-residential-hero-cta"
                  className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-white px-8 text-[0.9375rem] font-semibold text-[#1B1A18] transition hover:bg-white/90"
                >
                  Book a consultation
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.phoneHref}
                  data-analytics="meta-lp-residential-hero-call"
                  className="hidden min-h-14 items-center gap-2.5 rounded-full border border-white/35 px-8 text-[0.9375rem] font-semibold backdrop-blur transition hover:bg-white/10 sm:inline-flex"
                >
                  <Phone size={16} aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </div>

              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {reviews.map((review) => (
                    <span
                      key={review.author}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/25 bg-white/15 text-xs font-bold backdrop-blur"
                    >
                      {review.author.replace("Dr. ", "").slice(0, 2)}
                    </span>
                  ))}
                </div>
                <div className="text-sm leading-5">
                  <p className="font-bold">{landingCounts.delivered}+ builds delivered</p>
                  <p className="text-white/80">Across {landingCounts.cities} Lower Mainland cities</p>
                </div>
              </div>
            </div>

            {/* Floating over the photograph rather than beside it. */}
            <div className="grid gap-4 sm:grid-cols-2 lg:ml-auto lg:w-[16rem] lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <ShieldCheck size={20} aria-hidden="true" className="text-[#FF811C]" />
                <p className="mt-3 text-2xl font-bold leading-none">2-5-10</p>
                <p className="mt-1.5 text-[0.8125rem] leading-5 text-white/65">Home Warranty on residential builds</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <Star size={20} aria-hidden="true" className="text-[#FF811C]" />
                <p className="mt-3 text-2xl font-bold leading-none">{landingCounts.yearsBuilding} yrs</p>
                <p className="mt-1.5 text-[0.8125rem] leading-5 text-white/65">Building in BC since {siteConfig.foundedYear}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The assurance bar straddles the hero edge, which is what stitches the
          cinematic top to the light page below it. */}
      <div className="relative z-10 -mt-14 px-5 sm:px-8">
        <div className="mx-auto max-w-[82rem] rounded-[1.75rem] bg-white p-3 shadow-[0_12px_44px_rgba(0,0,0,0.14)]">
          <dl className="grid divide-y divide-[#1B1A18]/8 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {content.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? ShieldCheck;
              return (
                <div key={feature.title} className="flex items-center gap-3.5 px-5 py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F1EB]">
                    <Icon size={19} aria-hidden="true" className="text-accent" />
                  </span>
                  <div>
                    <dt className="text-[0.9375rem] font-bold leading-snug text-[#1B1A18]">{feature.title}</dt>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------------------- WORK */}
      {/*
        Full-bleed, edge to edge, captions set on the photograph rather than
        under it. The rooms were sitting in rounded cards on cream like every
        other module on the page, which is a gallery, not a moment — these are
        the best assets on the site and they should own the full width.
      */}
      <section className="py-16">
        <div className="mx-auto max-w-[82rem] px-5 sm:px-8">
          <h2 className="max-w-[18ch] text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            Finished rooms in a home we
            <span className="serif-font font-normal italic text-accent"> actually built.</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-1 sm:grid-cols-2">
          {[entry, kitchen].map((shot) => (
            <figure key={shot.image} className="group relative overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={shot.image}
                  alt={altFor(shot.image)}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-6 sm:p-8">
                <figcaption className="text-sm font-semibold text-white">{shot.caption}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- FORM */}
      <section id="request" className="scroll-mt-4 px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_50px_rgba(27,26,24,0.09)]">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            {/*
              Dark left, white right. The right half used to be tinted the same
              value as the page, so the card had no edge on that side and read
              as an unfinished panel bleeding into the background.
            */}
            <div className="order-last bg-[#1B1A18] p-7 text-white sm:p-11 lg:order-first">
              <h2 className="text-[clamp(1.5rem,2.3vw,2rem)] font-bold leading-[1.1] tracking-[-0.02em]">
                {content.formHeading}
              </h2>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-7 text-white/65">
                {content.closingText}
              </p>

              <ul className="mt-9 grid gap-4">
                {content.reassurance.map((line) => (
                  <li key={line} className="flex items-start gap-3.5 text-[0.9375rem] leading-7">
                    <ShieldCheck size={19} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-7">
                {/* Initials, not a cropped interior. A round crop of a room reads
                    as a broken avatar, which is the opposite of reassuring next to
                    the sentence naming who reads the enquiry. */}
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-base font-bold text-accent">
                  JO
                </span>
                <p className="text-sm leading-6 text-white/60">
                  Every enquiry is read by {siteConfig.founderName}, {siteConfig.founderRole}, at the
                  White Rock office.
                </p>
              </div>
            </div>

            <div className="bg-white p-7 sm:p-11">
              <LandingLeadForm content={content} />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- OBJECTIONS */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[82rem]">
          <h2 className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            What people
            <span className="serif-font font-normal italic text-accent"> actually worry about.</span>
          </h2>
          <dl className="mt-10 grid gap-4 md:grid-cols-2">
            {content.objections.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] bg-white p-7 shadow-[0_4px_24px_rgba(27,26,24,0.05)]"
              >
                <dt className="text-lg font-bold leading-snug">{item.question}</dt>
                <dd className="mt-3 leading-7 text-[#1B1A18]/65">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- PROCESS */}
      {/* The one dark band. Seven light sections in a row read as one long
          page rather than a sequence, and the process is the natural place to
          break it: it is the only section that is a claim about how the
          company works rather than evidence. */}
      <section className="mx-5 mb-16 rounded-[2rem] bg-[#1B1A18] px-5 py-16 text-white sm:mx-8 sm:px-8">
        <div className="mx-auto max-w-[78rem]">
          <h2 className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            How your build
            <span className="serif-font font-normal italic text-accent"> actually runs.</span>
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.steps.map((step) => (
              <li key={step.step} className="rounded-[1.5rem] border border-white/12 bg-white/[0.05] p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-accent">
                  {step.step}
                </span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-7 text-white/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ BEFORE/AFTER */}
      {/*
        Renders nothing until content.beforeAfter has real pairs. A renovation
        page that fakes a "before" is worse than one that has none.
      */}
      {content.beforeAfter?.length ? (
        <section className="px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-[82rem]">
            <h2 className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
              The same room,
              <span className="serif-font font-normal italic text-accent"> before and after.</span>
            </h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {content.beforeAfter.map((pair) => (
                <figure key={pair.after}>
                  <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-[1.5rem]">
                    {([["Before", pair.before], ["After", pair.after]] as const).map(
                      ([label, src]) => (
                        <div key={label} className="relative aspect-[4/5]">
                          <Image
                            src={src}
                            alt={`${pair.caption} — ${label.toLowerCase()}`}
                            fill
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            className="object-cover"
                          />
                          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                            {label}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <figcaption className="mt-3 text-sm text-[#1B1A18]/55">{pair.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------- REVIEWS */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[82rem]">
          <h2 className="max-w-[22ch] text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            The same team, in their
            <span className="serif-font font-normal italic text-accent"> clients&rsquo; words.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-[#1B1A18]/60">
            Most of Oberizon&rsquo;s work is clinical construction, so most of its reviews are from
            clinic owners. It is the same site leads and the same process on a house.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.author}
                className="rounded-[1.5rem] bg-white p-7 shadow-[0_4px_24px_rgba(27,26,24,0.05)]"
              >
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} aria-hidden="true" fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 leading-7 text-[#1B1A18]/75">“{review.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-[#1B1A18]/50">
                  <span className="block font-bold text-[#1B1A18]">{review.author}</span>
                  {review.role}
                  {review.city ? ` · ${review.city}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CLOSE */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="relative mx-auto max-w-[82rem] overflow-hidden rounded-[2rem]">
          {/*
          `isolate` is load-bearing. The photograph and its scrim sit at
          -z-10, and without a stacking context here they render behind the
          page background rather than behind the text — so this section
          shipped as white type on cream with no image at all.
        */}
        <div className="relative isolate min-h-[24rem] p-8 sm:p-14">
            <Image
              src={exterior.image}
              alt=""
              fill
              sizes="100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#12100e]/90 via-[#12100e]/70 to-[#12100e]/35" />
            <div className="max-w-lg text-white">
              <h2 className="text-[clamp(1.6rem,2.6vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
                {content.closingHeading}
              </h2>
              <a
                href="#request"
                data-open-lead-form
                data-analytics="meta-lp-residential-close-cta"
                className="mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-white px-8 text-[0.9375rem] font-semibold text-[#1B1A18] transition hover:bg-white/90"
              >
                Book a consultation
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <LandingFormDialog content={content} />
      <LandingStickyCta content={content} tone="light" />

      <footer className="border-t border-[#1B1A18]/10 px-5 pb-28 pt-8 text-sm text-[#1B1A18]/50 sm:px-8 lg:pb-8">
        <div className="mx-auto flex max-w-[82rem] flex-wrap items-center justify-between gap-3">
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
