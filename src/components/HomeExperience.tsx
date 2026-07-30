import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  HardHat,
  Hospital,
  House,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { ProcessStrip, ReviewCta, ServiceMarquee } from "@/components/SectionPrimitives";
import {
  aiFaqs,
  serviceAreas,
  siteConfig,
  stats,
  trustItems,
} from "@/lib/site";

const verticals = [
  {
    icon: Hospital,
    label: "Vertical 01",
    title: "Healthcare Construction",
    text: "Dental, medical, pharmacy, physio, and med spas built around workflow, services, permits, and daily operation.",
    href: "/construction/white-rock/healthcare-construction",
    image: "/oberizon/optimized/project-healthcare-3.jpg",
  },
  {
    icon: Building2,
    label: "Vertical 02",
    title: "Commercial Interiors",
    text: "Office, retail, and tenant improvements built around how the business actually needs to operate.",
    href: "/construction/white-rock/commercial-construction",
    image: "/oberizon/optimized/project-office.jpg",
  },
  {
    icon: House,
    label: "Vertical 03",
    title: "Luxury Residential",
    text: "Custom homes and high-end residential projects managed with planning, detail, and finish control.",
    href: "/construction/white-rock/luxury-residential-construction",
    image: "/oberizon/optimized/project-residential.jpg",
  },
];

const difference = [
  {
    title: "Planning Before Construction",
    text: "We review the space, layout, services, permits, budget, and timeline before work starts.",
  },
  {
    title: "One Accountable Team",
    text: "Permits, trades, construction, inspections, and handover are managed through one process.",
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

const projects = [
  {
    title: "The Shine Dental, White Rock",
    label: "Healthcare",
    text: "Dental clinic construction with operatory, sterilization, and workflow coordination.",
    image: "/oberizon/optimized/dental-clinic.jpg",
  },
  {
    title: "Skinholic Aesthetics",
    label: "Med Spa",
    text: "Medical spa interior built around client experience, treatment flow, and finish detail.",
    image: "/oberizon/optimized/project-med-spa.jpg",
  },
  {
    title: "Dental Clinic, Abbotsford",
    label: "Healthcare",
    text: "Dental clinic build-out with clinical service coordination and clean handover.",
    image: "/oberizon/optimized/project-clinic-9.jpg",
  },
  {
    title: "Private Office, White Rock",
    label: "Commercial",
    text: "Commercial office interior built for professional use and daily operation.",
    image: "/oberizon/optimized/project-office.jpg",
  },
];

export function HomeExperience() {
  return (
    <>
      <section className="relative isolate min-h-[100svh] overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/oberizon/optimized/hero-commercial.webp"
            alt="Oberizon commercial construction project"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <video
            className="absolute inset-0 hidden h-full w-full object-cover opacity-70 md:block"
            autoPlay
            muted
            loop
            playsInline
            poster="/oberizon/optimized/hero-commercial.webp"
          >
            <source src={siteConfig.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/78 to-stone-950/18" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(243,162,27,0.18)_0_1px,transparent_1px_100%)] bg-[length:76px_76px]" />
        </div>

        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <p className="reveal-up text-sm font-extrabold uppercase tracking-[0.28em] text-amber-300">
              Serving White Rock | Surrey | Vancouver | Langley | Abbotsford | Lower Mainland
            </p>
            <h1 className="display-font steel-shadow reveal-up reveal-delay-1 mt-5 max-w-5xl break-words text-[2.45rem] uppercase leading-[0.92] text-white sm:text-7xl sm:leading-[0.9] lg:text-[7.2rem]">
              Healthcare, Commercial & Luxury Construction in BC.
            </h1>
            <p className="reveal-up reveal-delay-2 mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/80 sm:text-2xl">
              Oberizon builds complex spaces where planning, permits, services, trades, timelines,
              and finish quality have to be controlled from day one.
            </p>
            <div className="reveal-up reveal-delay-3 mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/contact">Book an Appointment</ButtonLink>
              <ButtonLink href="/projects" tone="outline">
                View Our Work
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {stats.map((stat) => (
            <article key={stat.label} className="border-l-2 border-amber-400 pl-5">
              <p className="display-font text-4xl uppercase text-white sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.14em] text-white/58">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <ServiceMarquee />

      <section className="industrial-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              Trust Bar
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              End-to-end expertise. Exceptional outcomes.
            </h2>
            <p className="mt-6 text-xl font-medium leading-8 text-white/72">
              From dental clinics and pharmacies to physiotherapy clinics, commercial interiors,
              and luxury homes, Oberizon manages the build with structure, clarity, and accountability.
            </p>
            <ButtonLink href="/contact" className="mt-8">
              Book a Project Review
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => (
              <article key={item} className="rounded-sm border border-white/[0.12] bg-stone-950/60 p-5">
                <ShieldCheck className="text-amber-300" size={26} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-extrabold uppercase leading-6 text-white">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              What We Build
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              Healthcare, commercial, and luxury residential projects.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {verticals.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group overflow-hidden rounded-sm border border-white/[0.12] bg-white/[0.04]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/18 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-300">
                        {item.label}
                      </p>
                      <Icon className="text-amber-300" size={26} aria-hidden="true" />
                    </div>
                    <h3 className="display-font mt-4 text-3xl uppercase text-white">{item.title}</h3>
                    <p className="mt-3 text-base font-medium leading-6 text-white/68">{item.text}</p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.14em] text-amber-300">
                      Explore <ArrowRight size={17} aria-hidden="true" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="industrial-surface px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              The Difference
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              Why owners choose Oberizon.
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/72">
              Because the build has to be managed before the site gets busy.
            </p>
          </div>
          <div className="grid gap-4">
            {difference.map((item, index) => (
              <article
                key={item.title}
                className="grid gap-4 rounded-sm border border-white/[0.12] bg-stone-950/60 p-5 sm:grid-cols-[5rem_1fr]"
              >
                <p className="display-font text-4xl text-amber-300">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <h3 className="display-font text-2xl uppercase text-white">{item.title}</h3>
                  <p className="mt-2 text-base font-medium leading-6 text-white/68">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProcessStrip />

      <section className="bg-stone-950 px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-sm border border-white/[0.12]">
            <Image
              src="/oberizon/optimized/dental-clinic.jpg"
              alt="Dental clinic construction case study"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              90-day featured project
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              Built in 90 days.
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/72">
              From property to fully functioning dental clinic. The layout was clear, operatories
              were mapped, plumbing and electrical were coordinated, millwork was measured,
              equipment locations were planned, and trades knew the sequence.
            </p>
            <ButtonLink href="/projects" className="mt-8 w-fit">
              View Selected Projects
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="industrial-surface px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
                Recent Work
              </p>
              <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
                Selected projects.
              </h2>
            </div>
            <ButtonLink href="/projects" tone="outline">
              View All Projects
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <article key={project.title} className="overflow-hidden rounded-sm border border-white/[0.12] bg-stone-950/62">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">
                    {project.label}
                  </p>
                  <h3 className="display-font mt-3 text-2xl uppercase text-white">{project.title}</h3>
                  <p className="mt-2 text-base font-medium leading-6 text-white/68">{project.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
            Service Areas
          </p>
          <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
            Construction services across the Lower Mainland.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceAreas.map((city) => (
              <Link
                key={city.slug}
                href={`/construction/${city.slug}/commercial-construction`}
                className="rounded-sm border border-white/[0.12] bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950"
              >
                <MapPin size={22} aria-hidden="true" />
                <h3 className="display-font mt-4 text-2xl uppercase">{city.city}</h3>
                <p className="mt-2 text-sm font-semibold leading-5 opacity-75">{city.regionNote}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="industrial-surface px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              AI Search Questions
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              Answers owners search before they build.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {aiFaqs.map((faq) => (
              <article key={faq.question} className="rounded-sm border border-white/[0.12] bg-stone-950/60 p-5">
                <ClipboardCheck className="text-amber-300" size={24} aria-hidden="true" />
                <h3 className="display-font mt-4 text-2xl uppercase text-white">{faq.question}</h3>
                <p className="mt-3 text-base font-medium leading-6 text-white/68">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blueprint-band px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <HardHat className="shrink-0 text-stone-950" size={40} aria-hidden="true" />
            <p className="display-font text-3xl uppercase leading-none text-stone-950 sm:text-5xl">
              Planning a clinic, commercial space, or luxury home?
            </p>
          </div>
          <ButtonLink href="/contact" tone="black" className="shrink-0">
            Start With The Review
          </ButtonLink>
        </div>
      </section>

      <ReviewCta />
    </>
  );
}
