import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Eye,
  Globe2,
  Phone,
  Receipt,
  Sparkles,
  Star,
  Users,
  Workflow,
} from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { ExpertiseHub } from "@/components/ExpertiseHub";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HomeConsultationForm } from "@/components/HomeConsultationForm";
import { ProofBar } from "@/components/ProofBar";
import { ReviewAvatar } from "@/components/ReviewAvatar";
import { aiFaqs, processSteps, reviews, serviceAreas, siteConfig, trustItems } from "@/lib/site";

const verticals = [
  {
    label: "Vertical 01",
    title: "Healthcare Construction",
    text: "Dental, medical, pharmacy, physio, and med spas - built around workflow, services, permits, and daily operation.",
    href: "/services/healthcare-construction",
    image: "/oberizon/optimized/dental-clinic.jpg",
  },
  {
    label: "Vertical 02",
    title: "Commercial Interiors",
    text: "Office, retail, and tenant improvements built around how the business actually needs to operate.",
    href: "/services/commercial-construction",
    image: "/oberizon/optimized/project-dental-1.jpg",
  },
  {
    label: "Vertical 03",
    title: "Luxury Residential",
    text: "Custom homes and high-end residential projects managed with planning, detail, and finish control.",
    href: "/services/luxury-residential-construction",
    image: "/oberizon/optimized/hero-commercial.webp",
  },
];

// One icon per reason. All five previously shared a single clipboard glyph,
// which made the column read as an unfinished placeholder rather than five
// distinct claims.
const difference = [
  {
    title: "Planning Before Construction",
    text: "We review the space, layout, services, permits, budget, and timeline before work starts.",
    icon: ClipboardCheck,
  },
  {
    title: "One Accountable Team",
    text: "Permits, trades, construction, inspections, and handover managed through one process.",
    icon: Users,
  },
  {
    title: "Built Around Operations",
    text: "How the space will actually work for patients, staff, customers, and daily use.",
    icon: Workflow,
  },
  {
    title: "Clear Scope & Budget",
    text: "Clear scope, clear budget, clear timeline, and fewer surprises.",
    icon: Receipt,
  },
  {
    title: "Senior Oversight",
    text: "Oberizon stays involved in planning, sequencing, and execution.",
    icon: Eye,
  },
];

/**
 * These sit beside the claims above — service coordination, operations, senior
 * oversight — so they are the rooms that prove those claims rather than four
 * more wide interiors: sterilization suites and operatory corridors from
 * delivered clinics. Generic stock stood here while photographs of the real
 * thing existed.
 */
const differenceImages = [
  "/oberizon/optimized/project-abby-dental-sterilization-live.jpg",
  "/oberizon/optimized/project-kanwarveer-corridor-live.jpg",
  "/oberizon/optimized/project-shine-dental-sterilization-live.jpg",
  "/oberizon/optimized/project-kanwarveer-operatory-live.jpg",
];

/**
 * Five, not six. The grid below runs four columns with the first card spanning
 * two of them in both directions, so five cards fill it exactly — a sixth would
 * sit alone against three empty cells. Dr. Kanwarveer is on /projects instead.
 *
 * The images are client photographs of these named jobs, not stock chosen to
 * resemble them.
 */
const projects = [
  {
    title: "The Shine Dental, White Rock",
    label: "Healthcare",
    text: "Dental clinic construction with operatory, sterilization, and workflow coordination.",
    // The lead card, and the only photograph here carrying the client's own
    // signage — which is the part no competitor can copy onto their site.
    image: "/oberizon/optimized/project-shine-dental-reception-live.jpg",
  },
  {
    title: "Skinholic Aesthetics, Abbotsford",
    label: "Med Spa",
    text: "Medical spa interior built around client experience, treatment flow, and finish detail.",
    image: "/oberizon/optimized/project-skinholic-reception-live.jpg",
  },
  {
    title: "Dental Clinic, 104 33069 Marshall Road Abbotsford",
    label: "Healthcare",
    text: "Dental clinic build-out with clinical service coordination and clean handover.",
    image: "/oberizon/optimized/project-abby-dental-reception-live.jpg",
  },
  {
    title: "Luxury Residential",
    label: "Residential",
    text: "Custom residential construction with high-end finish planning and project control.",
    image: "/oberizon/optimized/project-luxury-live.jpg",
  },
  {
    title: "Private Office, White Rock",
    label: "Commercial",
    text: "Commercial office interior built for professional use and daily operation.",
    image: "/oberizon/optimized/project-private-office-live.jpg",
  },
];

export function HomeExperience() {
  return (
    <>
      {/*
        The first screen used to be ~900px of centred type on a flat panel: no
        image, no proof, no phone number, and the video pushed entirely below the
        fold. The landing pages had a stronger hero than the homepage did.

        Three changes. The vertical padding is roughly halved so the top of the
        video is visible before any scrolling, which is what makes the expansion
        discoverable at all. Credentials and a phone number sit under the CTA, so
        the screen carries evidence rather than only a claim. And the flat panel
        gets the same soft radial wash used elsewhere on the site.
      */}
      {/*
        A full-bleed hero: the work behind the headline, not beside it.

        This used to be a pale wash with the headline on it and the video
        following underneath in a rounded card that grew on scroll — two separate
        things, and the reason the hero never felt like much. The video is now
        the background and the headline sits on it, so the first screen is one
        composition instead of a stack.

        min-h uses svh, not vh. On mobile browsers vh is the tallest possible
        viewport including the chrome that hides on scroll, so a 100vh hero is
        cut off on arrival — svh is the height actually visible.
      */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink pt-24">
        {/*
          Desktop gets the video, phones get its poster frame.

          preload="none" plus the media query means a phone never fetches
          1920x1080 of video for a background it would barely resolve. The
          poster is a still from the same clinic, so the composition is identical
          either way.
        */}
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/oberizon/optimized/project-dental-1.jpg"
          aria-hidden="true"
        >
          <source src={siteConfig.heroVideo} type="video/mp4" />
        </video>
        <Image
          src="/oberizon/optimized/project-dental-1.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover md:hidden"
        />

        {/*
          Two scrims, not one. A flat overlay dark enough to carry white text
          kills the footage; this darkens hardest where the words actually sit
          and lets the top and bottom of the frame stay legible as an image. The
          second layer is a plain floor so the brightest frames of the clinic —
          it is a white room — can never wash the headline out.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/90" />
        <div className="absolute inset-0 bg-ink/25" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow">White Rock · Serving the Lower Mainland</p>
            {/*
              Category altitude, deliberately. This said "Dental & Commercial",
              and before that "British Columbia's Dental & Commercial" — both
              wrong for a homepage, for two different reasons.

              Geography first was a location claim before a capability one, so
              BC moved to the end where it qualifies the offer.

              Dental was the bigger problem: it is a sub-service, and
              /services/dental-clinic-construction plus fourteen city pages
              already target that exact term. A homepage repeating its own hubs'
              keyword competes with the pages built to win it. The homepage sits
              one level up — Healthcare covers dental, medical, pharmacy, clinic
              renovation and healthcare construction; Commercial covers the other
              three. Eight of ten services, and no page fighting another.

              Order still matters: healthcare is the specialism and where the
              portfolio is strongest, commercial is the volume at 4.2x the search
              demand. Two categories with a hierarchy, not three with none.

              The explicit space matters: the span is display:block, so the line
              break is visual, but without it the H1's text content extracts as
              "Healthcare & CommercialConstruction".
            */}
            <h1 className="h-hero mt-5 text-white">
              <span className="block orange-italic">Healthcare &amp; Commercial</span>{" "}
              Construction Specialists in BC.
            </h1>
            {/*
              Deliberately narrow and quiet. The hero carries six elements where
              the reference site carries three, and the failure was not that any
              one of them is wrong — it is that they all read at the same weight,
              so nothing led. These stay, because between them they hold the
              location keyword, the credentials and the click-to-call that most
              contractor leads arrive through. They just stop competing with the
              headline: one tight measure directly beneath it rather than a wide
              band of body copy.
            */}
            <p className="mx-auto mt-7 max-w-lg text-lg font-medium leading-8 text-white/75">
              Clinics, pharmacies and commercial interiors — planned before the site gets busy.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" className="px-9 py-4 text-base">
                Book a Consultation
              </ButtonLink>
              {/*
                Glass rather than the white pill it was. On a pale hero a solid
                white button read as secondary; over footage it would read as a
                hole punched in the image. A translucent border with a blur sits
                on the video instead of covering it.
              */}
              <a
                href={siteConfig.phoneHref}
                data-analytics="hero-call"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20"
              >
                <Phone size={17} strokeWidth={2.4} aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>

            {/* Credentials, not numbers — the ProofBar below the hero already
                carries the counts, and repeating them here would be noise. */}
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.08em] text-white/70">
              {trustItems.slice(0, 3).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </section>

      {/*
        A light band of real numbers separates the full-bleed video above from
        the dark statement below. Two dark blocks in sequence read as one
        undifferentiated mass however the seam is treated, so the page breathes
        back to light in between — and does it with evidence rather than filler.
      */}
      <ProofBar />

      {/*
        Solid, not another photograph. When this carried its own background image
        the join with the video read as two unrelated pictures stacked on each
        other, and the statement was harder to read for it.
      */}
      <section className="relative isolate overflow-hidden bg-ink px-5 py-28 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,79,10,0.12),transparent_28rem)]" />
        <div className="mx-auto max-w-5xl text-center">
          {/*
            Was 24 words fronting six abstract nouns before saying what Oberizon
            builds, with none of the priority keywords in it. Now 9 words, and the
            supporting line names the actual highest-volume services.
          */}
          <h2 className="h-section">
            Commercial, Dental &amp; Medical Construction —{" "}
            <span className="orange-italic">Built Right, On Time.</span>
          </h2>
          <div className="mx-auto mt-8 h-1 w-20 bg-orange-600" />
          <p className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-8 text-white/88">
            From commercial renovations and tenant improvements to dental clinics, medical offices
            and pharmacies — we manage permits, trades and timelines so your space opens on
            schedule.
          </p>
          {/* ButtonLink, not a bespoke square block — every other call to action
              on the site is a rounded pill with the same arrow affordance. */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact" className="px-8 py-4 text-base">
              Book a Consultation
            </ButtonLink>
          </div>
          <p className="mt-10 border-t border-white/35 pt-6 text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
            Serving {serviceAreas.map((area) => area.city).join(" . ")}
          </p>
        </div>
      </section>

      <ExpertiseHub />

      <section className="blueprint-grid bg-paper px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="h-section">
              What We <span className="text-accent">Build</span>
            </h2>
            <div className="mx-auto mt-5 h-1 w-48 bg-orange-600" />
            <p className="mx-auto mt-7 max-w-3xl text-2xl leading-10 text-black">
              We focus on healthcare, commercial, and luxury residential projects where planning
              and execution matter.
            </p>
          </div>
          <div className="mt-20 grid gap-10 lg:grid-cols-3">
            {verticals.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-[420px] overflow-hidden rounded-2xl bg-zinc-900 shadow-xl shadow-slate-900/10"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-orange-400">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold leading-tight">{item.title}</h3>
                  <div className="mt-4 h-1 w-14 bg-orange-500" />
                  <p className="mt-4 text-base font-medium leading-7 text-white/90">{item.text}</p>
                  <p className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-300">
                    Explore <ArrowRight size={16} aria-hidden="true" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* overflow-clip, not overflow-hidden: hidden establishes a scroll
          container, which silently disables the sticky image column below.
          clip still contains the corner decoration without that side effect. */}
      <section className="corner-dots relative overflow-clip bg-raised px-5 py-24 sm:px-6 lg:px-8">
        {/* items-start, not items-center — sticky positioning needs the column
            to be free to scroll within the grid area rather than be centred. */}
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
              The Difference
            </p>
            {/* Serif, matching every other section heading on the page. */}
            <h2 className="h-section mt-4">
              Why Owners <span className="orange-italic">Choose Oberizon.</span>
            </h2>
            <p className="mt-4 text-xl leading-8 text-muted">
              Because the build has to be managed before the site gets busy.
            </p>
            <div className="mt-10 grid gap-4">
              {difference.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
                  >
                    <div className="flex items-start gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-accent ring-1 ring-orange-100">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        {/* The number sits inline with the title. Absolutely
                            positioned, it landed on top of the icon tile. */}
                        <h3 className="flex items-baseline gap-3 text-2xl font-bold text-zinc-950">
                          <span className="text-sm font-extrabold tabular-nums text-orange-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-base leading-7 text-muted">{item.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/*
            The image grid is shorter than the five cards beside it, so it used
            to leave a large void. Sticking it to the viewport keeps it beside
            whichever card you are reading and removes the dead space.
          */}
          <div className="lg:sticky lg:top-28">
            <div className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-200 bg-white p-3">
              {differenceImages.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
                >
                  <Image
                    src={image}
                    alt={`Oberizon clinic planning detail ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-accent">
            Our Process
          </p>
          <h2 className="h-section mt-5">
            Four Steps. <span className="orange-italic">One Accountable Team.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
            A streamlined construction process designed to keep your project efficient,
            transparent, and stress-free from start to finish.
          </p>
          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="relative overflow-hidden rounded-2xl bg-white p-8 text-left shadow-sm ring-1 ring-orange-100"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-orange-600 text-lg font-bold text-white shadow-lg shadow-orange-600/20">
                  {step.number}
                </span>
                <h3 className="mt-8 text-2xl font-semibold text-zinc-950">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-ink text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col lg:min-h-[720px] lg:flex-row">
          <div className="relative min-h-[380px] lg:w-1/2">
            <Image
              src="/oberizon/optimized/project-dental-1.jpg"
              alt="90-day dental clinic case study"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute left-6 top-10 flex h-28 w-28 flex-col items-center justify-center bg-orange-600 text-white sm:left-12">
              <span className="serif-font text-6xl font-bold italic leading-none">90</span>
              <span className="text-sm font-extrabold uppercase tracking-[0.28em]">Days</span>
            </div>
          </div>
          <div className="flex items-center px-6 py-20 sm:px-12 lg:w-1/2 lg:px-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-orange-500">
                Featured Case Study
              </p>
              <h2 className="h-section mt-8">
                Built in <span className="orange-italic">90 days.</span>
              </h2>
              <p className="mt-8 text-2xl font-semibold leading-9 text-white">
                From property to fully functioning dental clinic.
              </p>
              <p className="mt-7 text-lg leading-8 text-white/84">
                One of our dental clinic projects was completed in 90 days because the planning was
                handled before construction became chaotic.
              </p>
              <p className="mt-6 text-lg leading-8 text-white/84">
                The layout was clear. Operatories were mapped. Plumbing and electrical were
                coordinated. Millwork was measured. Equipment locations were planned. Trades knew
                the sequence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="blueprint-grid bg-stone px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">
              Recent Work
            </p>
            <h2 className="h-section mt-4">
              Selected <span className="orange-italic">Projects.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Healthcare, Commercial, And Residential Projects Across The Lower Mainland.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={[
                  "group relative overflow-hidden bg-zinc-900 shadow-xl shadow-slate-900/10",
                  // min-h is md:-guarded like the spans beside it. Unprefixed,
                  // the lead card was 520px tall in a 280px-wide single column
                  // on a phone — a portrait slab twice the height of the rest.
                  index === 0
                    ? "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[520px]"
                    : "min-h-[250px]",
                ].join(" ")}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                {/*
                  Heavier than it looks like it needs to be, because these are
                  now real clinic photographs: bright white walls and pale wood,
                  where the old stock was dark. At from-black/74 via-black/18 the
                  orange eyebrow and the white heading sat on near-white pixels
                  and were unreadable. The floor of /25 at the top keeps the
                  label legible wherever a photo happens to be brightest.
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/55 to-black/25" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
                    {project.label}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/84">{project.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white px-10 py-5 text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-900 shadow-sm transition hover:border-orange-300 hover:text-accent"
            >
              View All Projects <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="blueprint-grid bg-raised px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} aria-hidden="true" /> Client Success
            </span>
            <h2 className="h-section mt-8">
              What Clinic <span className="text-accent">Owners</span> Say
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-muted">
              Real feedback from healthcare professionals who trusted us with their vision.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {reviews.map((item) => (
              <article key={item.author} className="live-card-shadow rounded-3xl bg-white p-9">
                <div className="flex gap-1 text-orange-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-8 text-base font-medium italic leading-8 text-slate-700">
                  {item.quote}
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <ReviewAvatar author={item.author} image={item.image} />
                  <div>
                    <p className="font-bold text-zinc-950">{item.author}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                      {[item.role, item.city].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="service-areas" className="overflow-hidden bg-paper px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
              Service Areas
            </p>
            <h2 className="h-section mt-4">
              Construction Services Across The
              <span className="block orange-italic">Lower Mainland</span>
            </h2>
            <p className="mt-7 text-xl font-semibold leading-8 text-black">
              Oberizon Construction manages healthcare, commercial, and luxury residential projects
              across the Lower Mainland.
            </p>
            <div className="mt-12 grid gap-x-12 gap-y-5 sm:grid-cols-2">
              {serviceAreas.map((city) => (
                <Link
                  key={city.slug}
                  href={`/construction/${city.slug}/commercial-construction`}
                  className="flex items-center gap-4 text-base font-bold text-zinc-950 transition hover:text-accent"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-accent">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {city.city}
                </Link>
              ))}
            </div>
            <div className="mt-14 flex gap-5 rounded-3xl bg-raised p-8 ring-1 ring-slate-100">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 ring-1 ring-slate-200">
                <Globe2 size={26} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
                  HQ White Rock
                </p>
                <p className="mt-2 text-base leading-7 text-muted">
                  Centrally located to manage projects from West Vancouver to Chilliwack with
                  senior oversight.
                </p>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl border border-orange-100 p-4 shadow-2xl shadow-slate-900/12">
            <iframe
              title="Oberizon Construction service area map"
              src="https://www.google.com/maps?q=1493%20Foster%20St%20305%20White%20Rock%20BC&output=embed"
              className="h-[560px] w-full rounded-3xl bg-slate-100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="blueprint-grid bg-raised px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="eyebrow">
              Frequently Asked
            </p>
            <h2 className="h-section mt-4">
              What Owners <span className="orange-italic">Ask Us.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
              Answers to the most common questions about healthcare, dental, medical, and pharmacy
              construction in British Columbia.
            </p>
          </div>
          <FaqAccordion items={aiFaqs} className="mx-auto mt-14 max-w-4xl" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-orange-600/15 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-orange-500">
            Book a Consultation
          </span>
          <h2 className="h-section mt-8">
            Planning a clinic, commercial space, or luxury home?{" "}
            <span className="orange-italic">Book a consultation.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70">
            Before you commit to a space, drawings, budget, or construction timeline, let Oberizon
            review the project and help you understand what needs to be planned before construction
            starts.
          </p>
          <HomeConsultationForm />
        </div>
      </section>
    </>
  );
}
