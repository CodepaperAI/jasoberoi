import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Phone, Quote, Star } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ReviewAvatar } from "@/components/ReviewAvatar";
import {
  portfolioTally,
  processSteps,
  siteConfig,
  type Project,
  type Review,
  type ServiceArea,
} from "@/lib/site";

/**
 * The trust-first landing page, in the order a visitor earns confidence:
 *
 *   1. Keyword confirmation — "yes, this page is about the thing you searched"
 *   2. Experience          — who is doing the work, and for how long
 *   3. The work            — proof they have done it before
 *   4. Reviews             — proof other people were happy with it
 *   5. Why these services  — where to go next, and why
 *   6. FAQs                — the specifics, with real numbers
 *   7. CTA                 — the ask, once trust has been built
 *
 * Message match is the first principle of a converting page: mirroring the
 * search query in the headline is what confirms, in about a second, that the
 * visitor is in the right place. Everything below the hero exists to convert
 * that recognition into trust before anything is asked of them.
 */

const yearsBuilding = new Date().getFullYear() - siteConfig.foundedYear;
// Counts come from portfolioTally, not from the `projects` array. These 140
// landing pages sit beside the homepage stats band, and counting only the
// documented case studies here while the homepage says 40+ would read as one of
// the two being untrue. The project *cards* below still come from `projects` —
// only the count is the client's figure.
const { delivered: deliveredCount, inProgress: inProgressCount } = portfolioTally;

/**
 * Click-to-call. Roughly two thirds of contractor leads arrive as phone calls,
 * so this is never buried.
 *
 * `onDark` rather than passing colour classes in. Both variants set the same
 * properties, so appending overrides would leave the winner down to which
 * utility Tailwind happens to emit last — order in a className string decides
 * nothing. The caller states which surface it is on and the component owns both
 * answers.
 */
export function CallLink({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <a
      href={siteConfig.phoneHref}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-400/70",
        onDark
          ? "border-white/30 bg-white/10 text-white backdrop-blur hover:border-white/60 hover:bg-white/20"
          : "border-zinc-900/15 bg-white text-zinc-900 hover:border-orange-300 hover:text-accent",
        className,
      ].join(" ")}
    >
      <Phone aria-hidden="true" size={17} strokeWidth={2.4} />
      <span>{siteConfig.phone}</span>
    </a>
  );
}

/**
 * Specific trust beats generic trust: years in business and a countable project
 * total outperform "trusted by thousands" badges. The licence entry stays
 * non-numeric until the client confirms the BC contractor and WorkSafeBC numbers.
 *
 * One line each, no sub-labels, no cards. This sits in the hero's left column,
 * which is only ~600px wide — as three bordered cards with a stacked uppercase
 * sub-label, every entry wrapped and "Fully insured, WorkSafeBC registered" ran
 * to three tracked-out lines. Short single-line labels fit across without
 * wrapping, and match the credential row on the homepage hero.
 */
export function TrustStrip({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const items = [
    { icon: CalendarDays, label: `Building since ${siteConfig.foundedYear}` },
    { icon: BadgeCheck, label: "Licensed & fully insured" },
    { icon: MapPin, label: `${deliveredCount}+ delivered projects` },
  ];

  return (
    <ul
      className={[
        "flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold",
        onDark ? "text-white/75" : "text-muted",
        className,
      ].join(" ")}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <item.icon className="shrink-0 text-accent" size={17} strokeWidth={2.4} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/** 1 — Keyword confirmation. The H1 is the target keyword verbatim. */
export function LandingHero({
  eyebrow,
  heading,
  intro,
  image,
  evidenceNote,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  image: string;
  evidenceNote?: string;
}) {
  return (
    /*
      Full-bleed, matching PageHero. This template renders 150 of the site's 165
      pages, so it is where the treatment matters most: the photograph of real
      work fills the hero and the keyword headline sits on it.

      82svh — slightly taller than PageHero's 76 because this hero carries more:
      a headline, an intro paragraph, two CTAs, a trust row and sometimes an
      evidence note. Still short of full height, because the seven trust sections
      below are what these pages exist to show.
    */
    <section className="relative flex min-h-[82svh] items-center overflow-hidden bg-ink px-5 pb-20 pt-36 sm:px-6 lg:px-8">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/85" />
      <div className="absolute inset-0 bg-ink/20" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-hero-split mt-5 text-white">{heading}</h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-white/75">{intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">Book a Consultation</ButtonLink>
            <CallLink onDark />
          </div>

          <TrustStrip className="mt-8" onDark />

          {/* An honesty note, so it should read as an aside rather than as a
              claim. The rule and muted type keep it clearly subordinate to the
              trust row above it. */}
          {evidenceNote ? (
            <p className="mt-7 max-w-xl border-l-2 border-white/25 pl-4 text-sm leading-6 text-white/60">
              {evidenceNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * 2 — Experience.
 *
 * Was an eyebrow, a twenty-word sentence used as a heading, a dense paragraph
 * and four identical cards on plain white — nothing for the eye to land on and
 * the only real content, the numbers, buried mid-paragraph.
 *
 * Now the numbers are the anchor, in the same treatment as the homepage
 * ProofBar so the site has one way of presenting a figure, with a real photo of
 * work near this city beside them.
 */
export function ExperienceBlock({ city, items }: { city: ServiceArea; items: Project[] }) {
  const figures = [
    { value: `${yearsBuilding}+`, unit: "years", label: `Building since ${siteConfig.foundedYear}` },
    { value: `${deliveredCount}+`, unit: "delivered", label: `Plus ${inProgressCount} in progress` },
    { value: "90", unit: "days", label: "Fastest clinic, five operatories" },
  ];
  const shown = items.find((project) => project.images?.length);

  return (
    <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow">
            Experience
          </p>
          <h2 className="h-section mt-4">
            The same team, <span className="orange-italic">every build.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            {siteConfig.founderName} has run Oberizon from its White Rock office since{" "}
            {siteConfig.foundedYear}. Work near {city.city} runs through the same four stages.
          </p>

          {/*
            One column until sm, the same way the homepage ProofBar collapses.
            Held at three columns this row gave each figure ~101px on a phone
            while "35+ delivered" needs 168px — the unit ran into the next
            column and the row rendered as overlapping text on all 140 landing
            pages. A figure and its unit must never be split or stacked, so the
            row wraps instead of the number.
          */}
          <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-3 sm:gap-4">
            {figures.map((figure) => (
              <div key={figure.unit}>
                <dt className="sr-only">{figure.label}</dt>
                <dd>
                  <span className="serif-font block text-4xl leading-none text-zinc-950 sm:text-5xl">
                    {figure.value}
                    <span className="orange-italic ml-1.5 text-2xl sm:text-3xl">{figure.unit}</span>
                  </span>
                  <span className="mt-3 block text-sm font-medium leading-5 text-slate-500">
                    {figure.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {shown ? (
          <figure className="relative overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-slate-900/12">
            <div className="relative aspect-[4/3]">
              <Image
                src={shown.images![0]}
                alt={`${shown.name}, ${shown.address}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur">
              <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                {shown.discipline} · {shown.status}
              </span>
              <span className="mt-1 block text-base font-bold text-zinc-950">{shown.name}</span>
              <span className="block text-sm text-slate-500">{shown.address}</span>
            </figcaption>
          </figure>
        ) : null}
      </div>

      {/* The four stages, compact, so they support the numbers rather than compete with them. */}
      <ol className="mx-auto mt-14 grid max-w-7xl gap-px overflow-hidden rounded-2xl bg-slate-200 md:grid-cols-4">
        {processSteps.map((step) => (
          <li key={step.number} className="bg-white p-6">
            <span className="text-xs font-extrabold tracking-[0.18em] text-orange-500">
              {step.number}
            </span>
            <h3 className="mt-2 text-lg font-bold text-zinc-950">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * 3 — The work. The single strongest trust signal available to a contractor:
 * named projects with real addresses. The market leader holds 26 page-one
 * positions largely on the strength of a library of pages exactly like these.
 */
export function ProjectProof({
  items,
  cityName,
  heading,
}: {
  items: Project[];
  cityName?: string;
  heading?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  /**
   * The grid tracks the number of cards.
   *
   * A fixed three-column grid left a single card marooned beside two thirds of
   * empty row, which read as a section that had failed to load rather than as a
   * design. Fewer cards now means fewer columns.
   */
  const columns =
    items.length === 1
      ? "max-w-md"
      : items.length === 2
        ? "md:grid-cols-2 max-w-4xl"
        : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">
          The work
        </p>
        <h2 className="h-section mt-4">
          {heading ?? `Builds we have delivered near ${cityName}.`}
        </h2>

        <div className={`mt-10 grid gap-5 ${columns}`}>
          {items.map((project) => (
            <article
              key={project.slug}
              className="live-card-shadow flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200"
            >
              {project.images?.length ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={project.images[0]}
                    alt={`${project.name}, ${project.address}`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700">
                  {project.discipline}
                </span>
                <span
                  className={[
                    "text-xs font-extrabold uppercase tracking-[0.12em]",
                    project.status === "Delivered" ? "text-emerald-600" : "text-slate-400",
                  ].join(" ")}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-zinc-950">{project.name}</h3>
              <p className="mt-2 flex items-start gap-2 text-base font-medium leading-7 text-muted">
                <MapPin className="mt-1 shrink-0 text-slate-400" size={16} aria-hidden="true" />
                {project.address}
              </p>

              {project.challenge ? (
                <p className="mt-4 border-l-2 border-orange-200 pl-4 text-base font-medium leading-7 text-muted">
                  {project.challenge}
                </p>
              ) : null}

              {project.timeline ? (
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-zinc-900">
                  {project.timeline}
                </p>
              ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 4 — Reviews. A named person saying the work was good, not a star average. */
export function ReviewsBlock({ items }: { items: Review[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">
          Reviews
        </p>
        <h2 className="h-section mt-4">
          What clinic owners say.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((review) => (
            <figure
              key={review.author}
              className="flex flex-col rounded-3xl bg-raised p-6 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-1 text-accent" aria-label="Five out of five">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ))}
              </div>
              <Quote className="mt-4 text-orange-200" size={22} aria-hidden="true" />
              <blockquote className="mt-2 grow text-base font-medium italic leading-7 text-slate-700">
                {review.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-5">
                <ReviewAvatar author={review.author} image={review.image} size="sm" />
                <span className="min-w-0">
                  <span className="block text-base font-bold text-zinc-950">{review.author}</span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-accent">
                    {[review.role, review.city].filter(Boolean).join(", ")}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 5 — Why these services. Each link says what it is for, so the rail guides rather than pads. */
export function WhyTheseServices({
  links,
  cityName,
}: {
  links: Array<{ label: string; href: string; why?: string }>;
  cityName: string;
}) {
  return (
    <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">
          Where to go next
        </p>
        {/* Short. The old heading ran to two lines and repeated the city again;
            the cards underneath already say which city they are for. */}
        <h2 className="h-section mt-4">
          Also built <span className="orange-italic">in {cityName}.</span>
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-paper px-5 py-5 transition hover:border-orange-300"
            >
              <span className="flex items-center justify-between gap-3 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-900 group-hover:text-accent">
                {link.label}
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </span>
              {link.why ? (
                <span className="text-sm font-medium leading-6 text-slate-500">{link.why}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 6 — FAQs. */
export function LandingFaqs({
  items,
  heading,
}: {
  items: Array<{ question: string; answer: string }>;
  heading: string;
}) {
  return (
    <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">
          Questions
        </p>
        <h2 className="h-section mt-4">
          {heading}
        </h2>
        <FaqAccordion items={items} className="mt-10" />
      </div>
    </section>
  );
}

/** 7 — The ask, last, once the page has earned it. */
export function LandingCta({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="h-section">{heading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/contact">Book a Consultation</ButtonLink>
          <CallLink onDark />
        </div>
      </div>
    </section>
  );
}
