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

/** Click-to-call. Roughly two thirds of contractor leads arrive as phone calls, so this is never buried. */
export function CallLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={siteConfig.phoneHref}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-zinc-900/15 bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400/70",
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
export function TrustStrip({ className = "" }: { className?: string }) {
  const items = [
    { icon: CalendarDays, label: `Building since ${siteConfig.foundedYear}` },
    { icon: BadgeCheck, label: "Licensed & fully insured" },
    { icon: MapPin, label: `${deliveredCount}+ delivered projects` },
  ];

  return (
    <ul
      className={[
        "flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-600",
        className,
      ].join(" ")}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <item.icon className="shrink-0 text-orange-600" size={17} strokeWidth={2.4} aria-hidden="true" />
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
    <section className="soft-grid relative overflow-hidden px-5 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
            {eyebrow}
          </p>
          {/* leading-[1.05], not leading-tight. At 72px a 1.25 line-height opens
              ~18px of air between lines, which on a three-line display heading
              reads as a gap rather than a paragraph. Matches the homepage H1. */}
          <h1 className="serif-font mt-5 break-words text-5xl leading-[1.05] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-600">{intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">Book a Consultation</ButtonLink>
            <CallLink />
          </div>

          <TrustStrip className="mt-8" />

          {/* An honesty note, so it should read as an aside rather than as a
              claim. The rule and muted type keep it clearly subordinate to the
              trust row above it. */}
          {evidenceNote ? (
            <p className="mt-7 max-w-xl border-l-2 border-slate-200 pl-4 text-sm leading-6 text-slate-500">
              {evidenceNote}
            </p>
          ) : null}
        </div>

        <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-slate-900/12">
          <Image
            src={image}
            alt={`${heading} project image`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
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
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
            Experience
          </p>
          <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
            The same team, <span className="orange-italic">every build.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            {siteConfig.founderName} has run Oberizon from its White Rock office since{" "}
            {siteConfig.foundedYear}. Work near {city.city} runs through the same four stages.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
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
          <figure className="relative overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-slate-900/12">
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
              <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-orange-600">
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
            <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.text}</p>
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
    <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
          The work
        </p>
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
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
              <p className="mt-2 flex items-start gap-2 text-base font-medium leading-7 text-slate-600">
                <MapPin className="mt-1 shrink-0 text-slate-400" size={16} aria-hidden="true" />
                {project.address}
              </p>

              {project.challenge ? (
                <p className="mt-4 border-l-2 border-orange-200 pl-4 text-base font-medium leading-7 text-slate-600">
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
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
          Reviews
        </p>
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
          What clinic owners say.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((review) => (
            <figure
              key={review.author}
              className="flex flex-col rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-1 text-orange-600" aria-label="Five out of five">
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
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-orange-600">
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
    <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
          Where to go next
        </p>
        {/* Short. The old heading ran to two lines and repeated the city again;
            the cards underneath already say which city they are for. */}
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
          Also built <span className="orange-italic">in {cityName}.</span>
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 transition hover:border-orange-300"
            >
              <span className="flex items-center justify-between gap-3 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-900 group-hover:text-orange-600">
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
    <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
          Questions
        </p>
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
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
    <section className="relative overflow-hidden bg-[#0f1115] px-5 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{heading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/contact">Book a Consultation</ButtonLink>
          <CallLink className="border-white/25 bg-transparent text-white hover:border-orange-400 hover:text-orange-400" />
        </div>
      </div>
    </section>
  );
}
