import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import type { SitePage } from "@/lib/site";

type PageHeroProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
};

export function PageHero({ eyebrow, heading, subheading, image }: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[62svh] overflow-hidden pt-24">
      <Image
        src={image}
        alt={`${heading} hero image`}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/[0.62] to-black/15" />
      <div className="relative mx-auto flex min-h-[62svh] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="reveal-up text-sm font-bold uppercase text-red-300">{eyebrow}</p>
          <h1 className="display-font reveal-up reveal-delay-1 mt-3 text-5xl font-bold uppercase leading-none text-white race-text-shadow sm:text-6xl lg:text-8xl">
            {heading}
          </h1>
          <p className="reveal-up reveal-delay-2 mt-6 max-w-2xl text-xl font-semibold leading-7 text-white/[0.84] sm:text-2xl">
            {subheading}
          </p>
          <ButtonLink href="/contact" className="reveal-up reveal-delay-3 mt-8">
            Make The Move
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function CurtainCta() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="grid min-h-[360px] lg:grid-cols-2">
        <div className="relative min-h-[300px]">
          <Image
            src="/assets/images/optimized/team-photo2.jpg"
            alt="The Oberoi Group team"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-8"
          />
        </div>
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden">
          <Image
            src="/assets/images/optimized/red-curtain.jpg"
            alt="Red curtain background"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <ButtonLink href="/contact" className="relative z-10">
            Make The Move
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function AwardsMarquee({ awards }: { awards: Array<{ src: string; alt: string }> }) {
  const doubled = [...awards, ...awards];
  return (
    <section className="overflow-hidden border-y border-white/10 bg-black py-5" aria-label="Awards">
      <div className="award-track flex w-max items-center gap-10">
        {doubled.map((award, index) => (
          <div key={`${award.src}-${index}`} className="relative h-16 w-28 shrink-0">
            <Image src={award.src} alt={award.alt} fill sizes="112px" className="object-contain" />
          </div>
        ))}
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
      <section className="grain-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-red-300">{page.eyebrow}</p>
            <h2 className="display-font mt-3 text-4xl font-bold uppercase text-white sm:text-5xl">
              {page.introTitle}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.76]">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.proof.map((item) => (
                <span
                  key={item}
                  className="rounded border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold uppercase text-white/[0.78]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {page.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-md border border-white/[0.12] bg-black/[0.46] p-5 shadow-2xl shadow-black/20"
              >
                <h3 className="display-font text-2xl font-bold uppercase text-white">{feature.title}</h3>
                <p className="mt-2 text-base font-medium leading-6 text-white/70">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.cards ? (
        <section className="bg-black px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="display-font text-4xl font-bold uppercase text-white">{page.featureTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {page.cards.map((card) => (
                <article key={card.title} className="overflow-hidden rounded-md border border-white/[0.12] bg-white/[0.04]">
                  {card.image ? (
                    <div className="relative aspect-[4/3]">
                      <Image src={card.image} alt={card.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="display-font text-2xl font-bold uppercase">{card.title}</h3>
                    <p className="mt-2 text-base font-medium leading-6 text-white/70">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CurtainCta />
    </>
  );
}

export function InternalLinkRail({
  links,
}: {
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex min-h-16 items-center justify-between rounded-md border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-base font-bold uppercase text-white transition hover:border-red-500 hover:bg-red-600"
        >
          <span>{link.label}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
