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
  Star,
  Users,
  Workflow,
} from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HomeConsultationForm } from "@/components/HomeConsultationForm";
import { ProofBar } from "@/components/ProofBar";
import { ReviewAvatar } from "@/components/ReviewAvatar";
import { ScrollExpandVideo } from "@/components/ScrollExpandVideo";
import {
  aiFaqs,
  constructionServices,
  processSteps,
  reviews,
  serviceAreas,
  siteConfig,
  trustItems,
} from "@/lib/site";

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
      <section className="relative overflow-hidden bg-paper pt-24">
        {/*
          One wash layer, not two.

          A #eef8fc sheet at 70% opacity used to sit on top of this one. Because
          it was painted over the soft-grid, it multiplied the two orange pools
          underneath down to 2.4% effective alpha — the hero's only warm element
          was being erased by a cold sheet laid over it, which is why the whole
          thing read as grey. Deleting it is the entire fix; the warmth was
          always there.

          wash-fade replaces the hard cut. The wash used to stop dead at a fixed
          610px and snap back to the page colour, leaving a visible horizontal
          seam partway down the hero. It still needs to run taller on mobile,
          where the stacked layout pushes past 800px.
        */}
        <div className="soft-grid wash-fade absolute inset-x-0 top-20 h-[900px] sm:h-[680px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {/*
            max-w-7xl, not max-w-6xl, and more air above.

            The headline is capped by whatever track it sits in. Inside the old
            1152px wrapper its first line stopped fitting past 96px; the full
            track takes 100px, which is what turns a two-line 155px block into a
            three-line 306px one. The container width was silently setting the
            ceiling on how large the hero could ever be.

            pt-16 because the headline used to start 166px down the page against
            the live site's 240px — it read as tucked under the header rather
            than given the top of the page.
          */}
          <div className="mx-auto max-w-7xl pt-8 text-center sm:pt-16">
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
            <h1 className="h-hero mt-5">
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
            <p className="mx-auto mt-7 max-w-lg text-lg font-medium leading-8 text-muted">
              Clinics, pharmacies and commercial interiors — planned before the site gets busy.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" className="px-9 py-4 text-base">
                Book a Consultation
              </ButtonLink>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-zinc-900/15 bg-white/80 px-7 py-3.5 text-base font-bold text-zinc-900 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:text-accent"
              >
                <Phone size={17} strokeWidth={2.4} aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>

            {/* Credentials, not numbers — the ProofBar below the video already
                carries the counts, and repeating them here would be noise. */}
            <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted/80">
              {trustItems.slice(0, 3).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*
          Deliberately outside the max-w-7xl container above. The whole point is
          that it reaches the viewport edges, and it cannot do that from inside a
          padded, width-capped wrapper.
        */}
        <ScrollExpandVideo
          poster="/oberizon/optimized/project-dental-1.jpg"
          src={siteConfig.heroVideo}
        />
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
      {/*
        One services block, replacing three.

        This was a dark statement band, then a radial diagram, then "What We
        Build" — three sections in a row answering the same question, roughly
        2,500px of page. The diagram was the worst of it: an orange circle with
        dashed SVG connectors radiating to icon chips, with the right-hand column
        set `text-right` so its body copy was ragged-left. It read as a slide,
        not a page.

        What replaces it is composed rather than decorated. A left-aligned
        header against an intro on the right, the three verticals as full-bleed
        photography, then every service as a plain linked row. No circle, no
        connectors, no icon chips, no mirrored columns.
      */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {/*
            Asymmetric, not centred. Eight of the eleven section headings on this
            page were centred with a centred subheading under them — that repeated
            eleven times is what read as a template. Heading left, supporting copy
            in the opposite column.
          */}
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">What we build</p>
              <h2 className="h-section mt-4">
                Healthcare, commercial and{" "}
                <span className="orange-italic">luxury residential.</span>
              </h2>
            </div>
            <p className="text-lg font-medium leading-8 text-muted">
              Healthcare is the specialism. Commercial is the volume. Both run through the same
              team, from first review to handover.
            </p>
          </div>
        </div>

        {/*
          Full-bleed. This row deliberately sits outside the max-w-7xl wrapper —
          the photography is the strongest asset on the site and every image on
          the page was inside a padded, rounded container. Edge to edge is the
          thing the reference site does that this one never did.
        */}
        <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {verticals.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex min-h-[440px] items-end overflow-hidden bg-ink"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />
              <div className="relative p-8 text-white">
                {/* White, not accent. Brand orange at 12px over a bright clinic
                    photograph is barely legible — the contrast scan that caught
                    the invisible dark heading only checked headings, so these
                    slipped through. White holds against every frame under it. */}
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/85">
                  {item.label}
                </p>
                <h3 className="h-card mt-3 !text-white">{item.title}</h3>
                <p className="mt-3 max-w-sm text-base leading-7 text-white/80">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition group-hover:gap-3">
                  Explore <ArrowRight size={15} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/*
          Every service, as names only.

          This carried a full sentence of summary under each of the ten names —
          ten headings plus ten paragraphs, which is how a list meant to feel
          calm turned into the densest block on the page. The descriptions live
          on the service pages these link to; repeating them here bought nothing
          and cost about 120 words.

          gap-x-16 matters more than it looks. Without a column gap the left
          cell's arrow — pushed to its right edge by justify-between — landed
          flush against the right cell's heading, so every right-hand service
          read as "→Commercial Renovation" with a stray arrow prefixed to it.
        */}
        <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-6 lg:px-8">
          <p className="eyebrow">Every service</p>
          <div className="mt-6 grid border-t border-line md:grid-cols-2 md:gap-x-16">
            {constructionServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-line py-5 transition hover:text-accent"
              >
                <span className="h-card text-ink transition group-hover:text-accent">
                  {service.name}
                </span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-ink/25 transition group-hover:translate-x-1 group-hover:text-accent"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* overflow-clip, not overflow-hidden: hidden establishes a scroll
          container, which silently disables the sticky image column below.
          clip still contains the corner decoration without that side effect. */}
      {/*
        One "how we work" block, replacing two.

        "Why Owners Choose Oberizon" and "Four Steps. One Accountable Team." sat
        back to back answering the same question, roughly 1,850px between them,
        each with its own centred-ish header and its own set of ringed cards.

        The five reasons are now plain rows on hairline rules rather than five
        shadowed cards with icon tiles, and the four process steps follow as a
        numbered strip. Same content, one header, and far fewer boxes — the card
        density was most of what made this page read as decorated.
      */}
      <section className="bg-raised py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">The Difference</p>
              <h2 className="h-section mt-4">
                Why owners <span className="orange-italic">choose Oberizon.</span>
              </h2>
            </div>
            <p className="text-lg font-medium leading-8 text-muted">
              Because the build has to be managed before the site gets busy — review, scope,
              services, sequencing and handover, run by one team.
            </p>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="border-t border-line">
              {difference.map((item, index) => (
                <article key={item.title} className="border-b border-line py-6">
                  <h3 className="flex items-baseline gap-4">
                    <span className="text-sm font-extrabold tabular-nums text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-card text-ink">{item.title}</span>
                  </h3>
                  <p className="mt-2 pl-9 text-base leading-7 text-muted">{item.text}</p>
                </article>
              ))}
            </div>

            {/*
              Four images, tiled tight and unframed. This was a 2x2 grid inside a
              bordered white card with rounded tiles inside it — a frame around a
              frame around a photograph.
            */}
            <div className="lg:sticky lg:top-28">
              <div className="grid grid-cols-2 gap-px bg-line">
                {differenceImages.map((image, index) => (
                  <div key={image} className="relative aspect-square overflow-hidden bg-stone">
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

          {/* The four process steps, as a strip rather than a second section. */}
          <div className="mt-20 border-t border-line pt-10">
            <p className="eyebrow">Four steps, one accountable team</p>
            <div className="mt-8 grid gap-10 md:grid-cols-4">
              {processSteps.map((step) => (
                <article key={step.number}>
                  <span className="text-sm font-extrabold tabular-nums text-accent">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
                </article>
              ))}
            </div>
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

      <section className="bg-stone py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Recent Work</p>
            <h2 className="h-section mt-4">
              Selected <span className="orange-italic">Projects.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Healthcare, Commercial, And Residential Projects Across The Lower Mainland.
            </p>
          </div>
        </div>
        {/*
          Full-bleed, and gap-px rather than gap-6.

          These sixteen photographs are the strongest asset the site has and
          every one of them was sitting inside a padded, width-capped container
          with rounded corners and six pixels of air between. Edge to edge, tiled
          tight, they read as a body of work instead of as five thumbnails.
        */}
        <div className="mt-16 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={[
                  "group relative overflow-hidden bg-ink",
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
        <div className="mx-auto mt-14 max-w-7xl px-5 sm:px-6 lg:px-8">
          {/* A text link with an arrow, not a bordered pill. The reference site
              ends every block this way, and it is one less box. */}
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 border-b border-ink/25 pb-2 text-sm font-extrabold uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent"
          >
            View All Projects
            <ArrowRight
              size={17}
              aria-hidden="true"
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <section className="bg-raised px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {/* A plain eyebrow, not a pill. The chip was one more decorated
                container on a page that had one around almost everything. */}
            <p className="eyebrow">Client Success</p>
            <h2 className="h-section mt-4">
              What Clinic <span className="text-accent">Owners</span> Say
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-muted">
              Real feedback from healthcare professionals who trusted us with their vision.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {reviews.map((item) => (
              <article key={item.author} className="border-t border-line pt-8">
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
                  <span className="flex h-6 w-6 items-center justify-center text-accent">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {city.city}
                </Link>
              ))}
            </div>
            <div className="mt-14 flex gap-5 border-t border-line pt-8">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center text-accent">
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
          <div className="relative">
            <iframe
              title="Oberizon Construction service area map"
              src="https://www.google.com/maps?q=1493%20Foster%20St%20305%20White%20Rock%20BC&output=embed"
              className="h-[380px] w-full rounded-2xl bg-stone"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="bg-raised px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Frequently Asked</p>
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
