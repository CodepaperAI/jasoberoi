import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Globe2,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { AppointmentModal } from "@/components/AppointmentModal";
import { aiFaqs, processSteps, reviews, serviceAreas, siteConfig } from "@/lib/site";

/**
 * Named after the services people actually search for, not generic consulting
 * labels. Commercial construction and commercial renovation lead because they
 * are the two largest measured opportunities and previously appeared nowhere on
 * the homepage.
 */
const visionItems = [
  {
    title: "Commercial Construction",
    text: "Ground-up commercial builds and tenant improvements across the Lower Mainland.",
    tone: "orange",
  },
  {
    title: "Commercial Renovation",
    text: "Interior renovations for offices, retail, and professional spaces already in use.",
    tone: "blue",
  },
  {
    title: "Dental Office Renovation",
    text: "Operatory reconfiguration, suction and air runs, and imaging shielding in live clinics.",
    tone: "orange",
  },
  {
    title: "Medical & Healthcare Construction",
    text: "Clinics and practices built around clinical workflow, IPAC barriers, and patient flow.",
    tone: "blue",
  },
  {
    title: "Pharmacy Construction",
    text: "Dispensary sightlines, security glazing, and USP 795/797 compounding-room compliance.",
    tone: "orange",
  },
  {
    title: "Luxury Residential",
    text: "Custom homes run with the same planning discipline as our clinical work.",
    tone: "blue",
  },
];

const verticals = [
  {
    label: "Vertical 01",
    title: "Healthcare Construction",
    text: "Dental, medical, pharmacy, physio, and med spas - built around workflow, services, permits, and daily operation.",
    href: "/construction/white-rock/healthcare-construction",
    image: "/oberizon/optimized/dental-clinic.jpg",
  },
  {
    label: "Vertical 02",
    title: "Commercial Interiors",
    text: "Office, retail, and tenant improvements built around how the business actually needs to operate.",
    href: "/construction/white-rock/commercial-construction",
    image: "/oberizon/optimized/project-dental-1.jpg",
  },
  {
    label: "Vertical 03",
    title: "Luxury Residential",
    text: "Custom homes and high-end residential projects managed with planning, detail, and finish control.",
    href: "/construction/white-rock/luxury-residential-construction",
    image: "/oberizon/optimized/hero-commercial.webp",
  },
];

const difference = [
  {
    title: "Planning Before Construction",
    text: "We review the space, layout, services, permits, budget, and timeline before work starts.",
  },
  {
    title: "One Accountable Team",
    text: "Permits, trades, construction, inspections, and handover managed through one process.",
  },
  {
    title: "Built Around Operations",
    text: "How the space will actually work for patients, staff, customers, and daily use.",
  },
  {
    title: "Clear Scope & Budget",
    text: "Clear scope, clear budget, clear timeline, and fewer surprises.",
  },
  {
    title: "Senior Oversight",
    text: "Oberizon stays involved in planning, sequencing, and execution.",
  },
];

const differenceImages = [
  "/oberizon/optimized/project-commercial-2.jpg",
  "/oberizon/optimized/project-healthcare-3.jpg",
  "/oberizon/optimized/project-healthcare-4.jpg",
  "/oberizon/optimized/project-healthcare-5.jpg",
];

const projects = [
  {
    title: "The Shine Dental, White Rock",
    label: "Healthcare",
    text: "Dental clinic construction with operatory, sterilization, and workflow coordination.",
    image: "/oberizon/optimized/project-shine-dental-live.jpg",
  },
  {
    title: "Skinholic Aesthetics",
    label: "Med Spa",
    text: "Medical spa interior built around client experience, treatment flow, and finish detail.",
    image: "/oberizon/optimized/project-med-spa.jpg",
  },
  {
    title: "Dental Clinic, 104 33069 Marshall Road Abbotsford",
    label: "Healthcare",
    text: "Dental clinic build-out with clinical service coordination and clean handover.",
    image: "/oberizon/optimized/project-abby-dental-live.jpg",
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
      <AppointmentModal />
      <section className="relative overflow-hidden bg-white pb-20 pt-28">
        <div className="absolute inset-x-0 top-20 h-[590px] bg-[#eef8fc]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl pt-20 text-center">
            {/*
              Dental leads because that is where the portfolio and the competitive
              gap are strongest; commercial is named in the same breath because it
              carries 4.2x the search volume. The previous headline ordered three
              categories with no hierarchy and no specialism.
            */}
            {/*
              The explicit spaces matter: the spans are display:block, so the
              line breaks are visual, but without them the H1's text content
              extracts as "British Columbia'sDental & CommercialConstruction".
            */}
            <h1 className="serif-font text-[2.65rem] leading-[1.08] tracking-tight text-black sm:text-6xl lg:text-[5.25rem]">
              British Columbia&apos;s{" "}
              <span className="block orange-italic">Dental &amp; Commercial</span>{" "}
              Construction Specialist.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Dental clinics, medical offices and pharmacies are where we differentiate. Commercial
              construction and renovation are a full service line we build every day — not an
              afterthought.
            </p>
            <ButtonLink href="/contact" className="mt-10 px-10 py-4 text-lg">
              Book a Consultation
            </ButtonLink>
          </div>

          <div className="relative mx-auto mt-20 aspect-[16/9] max-w-[1180px] overflow-hidden rounded-t-[5rem] bg-zinc-900 shadow-2xl shadow-slate-900/20">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/oberizon/optimized/project-dental-1.jpg"
            >
              <source src={siteConfig.heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/38" />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-zinc-100 pt-10 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
          <p className="normal-case tracking-normal">
            Healthcare and commercial construction across the Lower Mainland since{" "}
            {siteConfig.foundedYear}.
          </p>
          <div className="hidden gap-8 text-zinc-700 sm:flex">
            <Link href="/contact" className="transition hover:text-orange-600">
              Book a Consultation
            </Link>
            <Link href="/projects" className="transition hover:text-orange-600">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-zinc-950 px-5 py-28 text-white sm:px-6 lg:px-8">
        <Image
          src="/oberizon/optimized/dental-clinic.jpg"
          alt="Dental clinic construction by Oberizon"
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />
        <div className="mx-auto max-w-5xl text-center">
          {/*
            Was 24 words fronting six abstract nouns before saying what Oberizon
            builds, with none of the priority keywords in it. Now 9 words, and the
            supporting line names the actual highest-volume services.
          */}
          <h2 className="serif-font text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Commercial, Dental &amp; Medical Construction —{" "}
            <span className="orange-italic">Built Right, On Time.</span>
          </h2>
          <div className="mx-auto mt-8 h-1 w-20 bg-orange-600" />
          <p className="mx-auto mt-8 max-w-3xl text-lg font-medium leading-8 text-white/88">
            From commercial renovations and tenant improvements to dental clinics, medical offices
            and pharmacies — we manage permits, trades and timelines so your space opens on
            schedule.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-orange-600 px-7 py-4 text-base font-bold uppercase text-white shadow-xl shadow-orange-950/20 transition hover:bg-orange-500"
            >
              Book a Consultation
            </Link>
          </div>
          <p className="mt-10 border-t border-white/35 pt-6 text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
            Serving {serviceAreas.map((area) => area.city).join(" . ")}
          </p>
        </div>
      </section>

      <section className="corner-dots relative overflow-hidden bg-[#f8faff] px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
              Our Expertise
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              Enabling Your
              <span className="block orange-italic">Healthcare Vision</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
              End-to-end expertise. Exceptional outcomes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visionItems.map((item) => (
              <article
                key={item.title}
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200/70"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={[
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      item.tone === "orange"
                        ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
                        : "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
                    ].join(" ")}
                  >
                    <ClipboardCheck size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold uppercase tracking-wide text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="serif-font text-5xl leading-tight text-zinc-950 sm:text-6xl">
              What We <span className="text-orange-600">Build</span>
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
                className="group relative min-h-[420px] overflow-hidden rounded-lg bg-zinc-900 shadow-xl shadow-slate-900/10"
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

      <section className="corner-dots relative overflow-hidden bg-gradient-to-b from-[#f8faff] via-white to-[#f8faff] px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
              The Difference
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
              Why Owners Choose Oberizon.
            </h2>
            <p className="mt-4 text-xl leading-8 text-slate-600">
              Because the build has to be managed before the site gets busy.
            </p>
            <div className="mt-10 grid gap-6">
              {difference.map((item, index) => (
                <article
                  key={item.title}
                  className="live-card-shadow relative rounded-3xl bg-white p-6 ring-1 ring-slate-200"
                >
                  <span className="absolute left-16 top-4 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex gap-6">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                      <ClipboardCheck size={24} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-950">{item.title}</h3>
                      <p className="mt-2 text-lg leading-8 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border border-slate-200 bg-white p-4">
            {differenceImages.map((image, index) => (
              <div key={image} className="relative aspect-square overflow-hidden bg-slate-100">
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
      </section>

      <section className="bg-gradient-to-b from-white via-orange-50/40 to-white px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-orange-600">
            Our Process
          </p>
          <h2 className="serif-font mt-5 text-4xl leading-tight text-zinc-950 sm:text-6xl">
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
                <p className="mt-4 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#0b0c0e] text-white">
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
              <h2 className="serif-font mt-8 text-5xl leading-tight text-white sm:text-6xl">
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

      <section className="bg-slate-50 px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">
              Recent Work
            </p>
            <h2 className="mt-4 text-5xl font-semibold text-zinc-950">
              Selected <span className="orange-italic">Projects.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Healthcare, Commercial, And Residential Projects Across The Lower Mainland.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={[
                  "group relative overflow-hidden bg-zinc-900 shadow-xl shadow-slate-900/10",
                  index === 0 ? "md:col-span-2 md:row-span-2 min-h-[520px]" : "min-h-[250px]",
                ].join(" ")}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/18 to-transparent" />
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
              className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white px-10 py-5 text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-900 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
            >
              View All Projects <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
              <Sparkles size={14} aria-hidden="true" /> Client Success
            </span>
            <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
              What Clinic <span className="text-orange-600">Owners</span> Say
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-slate-600">
              Real feedback from healthcare professionals who trusted us with their vision.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {reviews.map((item) => (
              <article key={item.author} className="live-card-shadow rounded-[2rem] bg-white p-9">
                <div className="flex gap-1 text-orange-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-8 text-base font-medium italic leading-8 text-slate-700">
                  {item.quote}
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-lg font-bold text-white">
                    {item.author.replace(/^Dr\.\s*/, "").charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold text-zinc-950">{item.author}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                      {[item.role, item.city].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="service-areas" className="overflow-hidden bg-white px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
              Service Areas
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
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
                  className="flex items-center gap-4 text-base font-bold text-zinc-950 transition hover:text-orange-600"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {city.city}
                </Link>
              ))}
            </div>
            <div className="mt-14 flex gap-5 rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-100">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 ring-1 ring-slate-200">
                <Globe2 size={26} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-600">
                  HQ White Rock
                </p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Centrally located to manage projects from West Vancouver to Chilliwack with
                  senior oversight.
                </p>
              </div>
            </div>
          </div>
          <div className="relative rounded-[2rem] border border-orange-100 p-4 shadow-2xl shadow-slate-900/12">
            <iframe
              title="Oberizon Construction service area map"
              src="https://www.google.com/maps?q=1493%20Foster%20St%20305%20White%20Rock%20BC&output=embed"
              className="h-[560px] w-full rounded-[1.6rem] bg-slate-100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-600">
              Frequently Asked
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              What Owners <span className="orange-italic">Ask Us.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Answers to the most common questions about healthcare, dental, medical, and pharmacy
              construction in British Columbia.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {aiFaqs.map((faq) => (
              <article
                key={faq.question}
                className="live-card-shadow rounded-3xl bg-white p-7 ring-1 ring-slate-200"
              >
                <h3 className="text-xl font-bold leading-snug text-zinc-950">{faq.question}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0f1115] px-5 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-orange-600/15 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-orange-500">
            Book a Consultation
          </span>
          <h2 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Planning a clinic, commercial space, or luxury home?{" "}
            <span className="orange-italic">Book a consultation.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70">
            Before you commit to a space, drawings, budget, or construction timeline, let Oberizon
            review the project and help you understand what needs to be planned before construction
            starts.
          </p>
          <form className="mt-12 grid gap-5 text-left sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold text-white">
              Full Name
              <input className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="Enter your full name" />
            </label>
            <label className="grid gap-2 text-xs font-bold text-white">
              Email *
              <input className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="your@email.com" />
            </label>
            <label className="grid gap-2 text-xs font-bold text-white">
              Phone *
              <input className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="+1 (555) 000-0000" />
            </label>
            <label className="grid gap-2 text-xs font-bold text-white">
              Project Location
              <input className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="White Rock" />
            </label>
            <label className="grid gap-2 text-xs font-bold text-white sm:col-span-2">
              Type of Project
              <select className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none focus:border-orange-500">
                <option>Select an option</option>
                <option>Dental Clinic Construction</option>
                <option>Medical Clinic Construction</option>
                <option>Commercial Interior</option>
                <option>Luxury Residential</option>
              </select>
            </label>
            <label className="grid gap-2 text-xs font-bold text-white sm:col-span-2">
              Tell us more about your project
              <textarea className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="City, target open date, budget range, and scope. Anything else we should know - say it here." />
            </label>
            <div className="text-center sm:col-span-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-600 px-16 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-500"
              >
                <Send size={15} aria-hidden="true" />
                Book a Consultation
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
