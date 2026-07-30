import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { constructionServices, processSteps, type SitePage } from "@/lib/site";

type PageHeroProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
};

export function PageHero({ eyebrow, heading, subheading, image }: PageHeroProps) {
  return (
    <section className="soft-grid relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
            {eyebrow}
          </p>
          <h1 className="serif-font mt-5 break-words text-5xl leading-tight tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-medium leading-8 text-slate-600">
            {subheading}
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Book a Project Review
          </ButtonLink>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-slate-900/12">
          <Image
            src={image}
            alt={`${heading} project image`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/22" />
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
            className="rounded-full border border-orange-100 bg-orange-50 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-700"
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
    <section className="relative overflow-hidden bg-[#0f1115] px-5 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <span className="inline-flex rounded-full bg-orange-600/15 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-orange-500">
          Start the conversation
        </span>
        <h2 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Planning a clinic, commercial space, or luxury home?{" "}
          <span className="orange-italic">Start with the review.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70">
          Before you commit to a space, drawings, budget, or construction timeline, let Oberizon
          review the project and help you understand what needs to be planned before construction
          starts.
        </p>
        <ButtonLink href="/contact" className="mt-8">
          Request Consultation
        </ButtonLink>
      </div>
    </section>
  );
}

export function ContentPage({ page }: { page: SitePage }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        heading={page.heading}
        subheading={page.subheading}
        image={page.heroImage}
      />

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
              {page.eyebrow}
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              {page.introTitle}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-slate-600">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.proof.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-orange-700"
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
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <h3 className="text-2xl font-bold text-zinc-950">{feature.title}</h3>
                <p className="mt-2 text-base font-medium leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.cards ? (
        <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="serif-font text-4xl text-zinc-950">{page.featureTitle}</h2>
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
                    <p className="mt-2 text-base font-medium leading-7 text-slate-600">{card.text}</p>
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
    <section className="bg-gradient-to-b from-white via-orange-50/40 to-white px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {processSteps.map((step) => (
          <article key={step.number} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50" />
            <p className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-lg font-bold text-white">
              {step.number}
            </p>
            <h3 className="mt-6 text-2xl font-semibold text-zinc-950">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
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
          <CheckCircle2 className="mt-1 shrink-0 text-orange-600" size={24} aria-hidden="true" />
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
          className="flex min-h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-900 transition hover:border-orange-300 hover:text-orange-600"
        >
          <span>{link.label}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
