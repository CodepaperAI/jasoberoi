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
    <section className="relative isolate min-h-[66svh] overflow-hidden pt-24">
      <Image
        src={image}
        alt={`${heading} project image`}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/78 to-stone-950/20" />
      <div className="relative mx-auto flex min-h-[66svh] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="reveal-up text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
            {eyebrow}
          </p>
          <h1 className="display-font steel-shadow reveal-up reveal-delay-1 mt-4 break-words text-[2.55rem] uppercase leading-[0.95] text-white sm:text-6xl lg:text-8xl">
            {heading}
          </h1>
          <p className="reveal-up reveal-delay-2 mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/[0.82] sm:text-2xl">
            {subheading}
          </p>
          <ButtonLink href="/contact" className="reveal-up reveal-delay-3 mt-8">
            Book a Project Review
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function ServiceMarquee() {
  const doubled = [...constructionServices, ...constructionServices];
  return (
    <section className="overflow-hidden border-y border-white/10 bg-stone-950 py-5" aria-label="Services">
      <div className="service-track flex w-max items-center gap-5">
        {doubled.map((service, index) => (
          <span
            key={`${service.slug}-${index}`}
            className="rounded-sm border border-amber-300/20 bg-white/[0.04] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-white/76"
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
    <section className="relative isolate overflow-hidden bg-stone-950">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px]">
          <Image
            src="/oberizon/optimized/project-office.jpg"
            alt="Oberizon commercial interior project"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/30" />
        </div>
        <div className="industrial-surface flex min-h-[360px] items-center px-5 py-16 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              Start the conversation
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-6xl">
              Review the project before the site gets busy.
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/74">
              Before you commit to a space, drawings, budget, or construction timeline, let
              Oberizon review the project and map what needs to be controlled first.
            </p>
            <ButtonLink href="/contact" className="mt-8">
              Request Consultation
            </ButtonLink>
          </div>
        </div>
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

      <section className="industrial-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-amber-300">
              {page.eyebrow}
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-5xl">
              {page.introTitle}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.74]">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.proof.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-extrabold uppercase tracking-[0.12em] text-white/[0.76]"
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
                className="rounded-sm border border-white/[0.12] bg-stone-950/[0.54] p-5 shadow-2xl shadow-black/20"
              >
                <h3 className="display-font text-2xl uppercase text-white">{feature.title}</h3>
                <p className="mt-2 text-base font-medium leading-6 text-white/68">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.cards ? (
        <section className="bg-stone-950 px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="display-font text-4xl uppercase text-white">{page.featureTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page.cards.map((card) => (
                <article key={card.title} className="overflow-hidden rounded-sm border border-white/[0.12] bg-white/[0.04]">
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
                  <div className="p-5">
                    <h3 className="display-font text-2xl uppercase text-white">{card.title}</h3>
                    <p className="mt-2 text-base font-medium leading-6 text-white/68">{card.text}</p>
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
    <section className="blueprint-band px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {processSteps.map((step) => (
          <article key={step.number} className="rounded-sm bg-stone-950/88 p-5 text-white shadow-xl shadow-black/20">
            <p className="display-font text-4xl text-amber-300">{step.number}</p>
            <h3 className="display-font mt-3 text-2xl uppercase">{step.title}</h3>
            <p className="mt-2 text-base font-medium leading-6 text-white/68">{step.text}</p>
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
        <div key={item} className="flex gap-4 rounded-sm border border-white/[0.12] bg-stone-950/[0.56] p-5">
          <CheckCircle2 className="mt-1 shrink-0 text-amber-300" size={24} aria-hidden="true" />
          <p className="text-lg font-semibold leading-7 text-white/[0.76]">{item}</p>
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
          className="flex min-h-16 items-center justify-between rounded-sm border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-base font-extrabold uppercase text-white transition hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950"
        >
          <span>{link.label}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
