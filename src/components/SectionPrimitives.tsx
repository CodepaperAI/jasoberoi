import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BookConsultationButton } from "@/components/BookConsultationButton";
import { constructionServices, processSteps, type SitePage } from "@/lib/site";

type PageHeroProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
};

export function PageHero({ eyebrow, heading, subheading, image }: PageHeroProps) {
  return (
    /*
      Full-bleed: the project photograph is the background, not a card beside
      the words.

      This was a two-column split — headline left, image right in a rounded
      frame — which meant the largest type on the page was confined to half the
      width and the photograph read as an illustration next to it. The image now
      fills the section and the headline sits on it.

      76svh, not the full viewport. This runs on About, Projects, Contact, Cost
      and Services, where a full-height hero would push the actual page content
      off the first screen on every one of them. An interior hero announces the
      page; it does not need to be the page. svh rather than vh because on mobile
      vh counts browser chrome that is not there.
    */
    <section className="relative flex min-h-[76svh] items-center overflow-hidden bg-ink px-5 pb-20 pt-36 sm:px-6 lg:px-8">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/*
        Two scrims. The gradient darkens hardest through the middle where the
        words sit; the flat layer under it is a floor, because several of these
        heroes are bright white clinic interiors that would otherwise wash the
        headline out.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/85" />
      <div className="absolute inset-0 bg-ink/20" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h-hero-split mt-5 text-white">{heading}</h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-white/75">
            {subheading}
          </p>
          <BookConsultationButton className="mt-8" />
        </div>
      </div>
    </section>
  );
}

export function ServiceMarquee() {
  const doubled = [...constructionServices, ...constructionServices];
  return (
    <section className="overflow-hidden border-y border-orange-100 bg-white py-5" aria-label="Services">
      <div className="service-track flex w-max items-center gap-5">
        {doubled.map((service, index) => (
          <span
            key={`${service.slug}-${index}`}
            className="ui-font rounded-full border border-orange-100 bg-orange-50 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-700"
          >
            {service.name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ReviewCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="ui-font inline-flex rounded-full bg-orange-600/15 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-orange-500">
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
        <BookConsultationButton className="mt-8" />
      </div>
    </section>
  );
}

export function ContentPage({ page }: { page: SitePage }) {
  // On the contact page the book buttons open the form; anywhere else they

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        heading={page.heading}
        subheading={page.subheading}
        image={page.heroImage}
      />

      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">
              {page.eyebrow}
            </p>
            <h2 className="h-section mt-4">
              {page.introTitle}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-muted">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.proof.map((item) => (
                <span
                  key={item}
                  className="ui-font rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {page.features.map((feature) => (
              <article
                key={feature.title}
                className="card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <h3 className="text-2xl font-bold text-zinc-950">{feature.title}</h3>
                <p className="mt-2 text-base font-medium leading-7 text-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.cards ? (
        <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="h-section">{page.featureTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page.cards.map((card) => (
                <article key={card.title} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                  {card.image ? (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-700 hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-zinc-950">{card.title}</h3>
                    <p className="mt-2 text-base font-medium leading-7 text-muted">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ProcessStrip />
      <ReviewCta />
    </>
  );
}

export function ProcessStrip() {
  return (
    <section className="bg-paper px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {processSteps.map((step) => (
          <article key={step.number} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50" />
            <p className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-lg font-bold text-white">
              {step.number}
            </p>
            <h3 className="mt-6 text-2xl font-semibold text-zinc-950">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ScopeList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="mt-1 shrink-0 text-accent" size={24} aria-hidden="true" />
          <p className="text-lg font-semibold leading-7 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function InternalLinkRail({
  links,
}: {
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="ui-font flex min-h-16 items-center justify-between rounded-2xl border border-slate-200 bg-paper px-5 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-900 transition hover:border-orange-300 hover:text-accent"
        >
          <span>{link.label}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
