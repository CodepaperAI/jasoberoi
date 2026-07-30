import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { InternalLinkRail } from "@/components/SectionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, pseoPageJsonLd, pseoWebPageJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPseoPages, getPseoPage } from "@/lib/site";

type PseoProps = {
  params: Promise<{ city: string; service: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPseoPages().map((page) => ({
    city: page.city.slug,
    service: page.service.slug,
  }));
}

export async function generateMetadata({ params }: PseoProps): Promise<Metadata> {
  const { city, service } = await params;
  const page = getPseoPage(city, service);

  if (!page) {
    return {};
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywordCluster,
  });
}

export default async function PseoRoute({ params }: PseoProps) {
  const { city, service } = await params;
  const page = getPseoPage(city, service);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Real Estate", href: "/real-estate" },
          { label: page.city.city, href: page.path },
        ])}
      />
      <JsonLd data={pseoPageJsonLd(page)} />
      <JsonLd data={pseoWebPageJsonLd(page)} />
      <JsonLd data={faqJsonLd(page.faqs)} />

      <section className="relative isolate overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/assets/images/optimized/hero-desktop.jpg')] bg-cover bg-center opacity-[0.36]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/[0.88] to-black/[0.58]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase text-red-300">{page.city.city} Real Estate</p>
          <h1 className="display-font mt-3 max-w-5xl text-5xl font-bold uppercase leading-none text-white sm:text-7xl">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/80">
            {page.intro}
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Talk To The Team
          </ButtonLink>
        </div>
      </section>

      <section className="grain-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <h2 className="display-font text-4xl font-bold uppercase text-white">
              Local strategy for {page.city.city}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.76]">{page.localProof}</p>
          </div>
          <div className="grid gap-4">
            {page.serviceBullets.map((bullet) => (
              <div key={bullet} className="flex gap-4 rounded-md border border-white/[0.12] bg-black/[0.42] p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-red-400" size={24} aria-hidden="true" />
                <p className="text-lg font-semibold leading-7 text-white/[0.78]">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase text-red-300">Search Coverage</p>
            <h2 className="display-font mt-3 text-4xl font-bold uppercase text-white">
              {page.service.name} coverage in {page.city.city}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.76]">
              {page.marketContext}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {page.city.neighborhoods.map((area) => (
                <span
                  key={area}
                  className="rounded border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase text-white/[0.72]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {page.serviceFocus.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-white/[0.12] bg-white/[0.04] p-5"
              >
                <h3 className="display-font text-2xl font-bold uppercase text-white">{item.title}</h3>
                <p className="mt-2 text-base font-medium leading-6 text-white/[0.72]">{item.text}</p>
              </article>
            ))}

            <div className="rounded-md border border-red-500/30 bg-red-600/10 p-5">
              <p className="text-sm font-bold uppercase text-red-200">Common Client Searches</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.keywordCluster.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded bg-black/50 px-3 py-2 text-xs font-bold uppercase text-white/[0.74]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="display-font text-4xl font-bold uppercase text-white">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-md border border-white/[0.12] bg-white/[0.04] p-5">
                <h3 className="display-font text-2xl font-bold uppercase text-white">{faq.question}</h3>
                <p className="mt-3 text-base font-medium leading-6 text-white/[0.72]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080808] px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="display-font text-3xl font-bold uppercase text-white">Next Lanes</h2>
          <div className="mt-6">
            <InternalLinkRail links={page.internalLinks} />
          </div>
        </div>
      </section>
    </>
  );
}
