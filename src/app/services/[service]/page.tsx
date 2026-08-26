import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Banknote, Calculator, CheckCircle2, Clock, MapPin } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import {
  CallLink,
  LandingHero,
  ProjectProof,
  WhyTheseServices,
} from "@/components/LandingSections";
import { postPath, postsForService } from "@/lib/blog";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";
import { getAllServiceHubs, getServiceHub } from "@/lib/hubs";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { projects } from "@/lib/site";

/**
 * A service hub — the page for the subject rather than for one city.
 *
 * Before these existed, every money service lived only as fourteen city
 * variants. Seven indexable pages competed for "dental office renovation" and
 * none of them consolidated it, while every internal link ran sideways from one
 * Abbotsford page to another.
 *
 * The section order is a funnel: confirm the subject, answer the cost question
 * immediately, show what is included, show it built, then hand off to whichever
 * of the fourteen cities the visitor actually wants. Section 5 is the load-
 * bearing one — it is the hub-to-spoke link set that did not exist anywhere.
 */

type HubProps = { params: Promise<{ service: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllServiceHubs().map((hub) => ({ service: hub.service.slug }));
}

export async function generateMetadata({ params }: HubProps): Promise<Metadata> {
  const { service } = await params;
  const hub = getServiceHub(service);
  if (!hub) return {};

  return buildMetadata({
    title: hub.title,
    description: hub.description,
    path: hub.path,
    image: hub.service.image,
    keywords: hub.keywords,
  });
}

export default async function ServiceHubPage({ params }: HubProps) {
  const { service } = await params;
  const hub = getServiceHub(service);
  if (!hub) notFound();

  /**
   * Matching vertical first, then whatever else is real, up to three.
   *
   * A strict vertical filter left the Commercial and Residential hubs showing a
   * single card in a three-column grid, because only one located project exists
   * in each. Every card names its own discipline, so a dental clinic appearing
   * under "the work" on a commercial hub claims nothing false — and one card
   * marooned in an empty row looked like the section had failed to load.
   */
  const located = projects.filter((project) => project.citySlug !== "");
  const relevant = [
    ...located.filter((project) => project.vertical === hub.service.vertical),
    ...located.filter((project) => project.vertical !== hub.service.vertical),
  ].slice(0, 3);

  const guides = postsForService(hub.service.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: hub.service.name, href: hub.path },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${absoluteUrl(hub.path)}#service`,
          name: hub.service.name,
          description: hub.description,
          serviceType: hub.service.name,
          provider: { "@id": `${absoluteUrl("/")}#organization` },
          // The same fourteen cities section 5 links to, so the markup and
          // the visible hub-to-spoke rail cannot tell different stories.
          areaServed: hub.cities.map((city) => ({
            "@type": "City",
            name: city.label,
            addressRegion: "BC",
            addressCountry: "CA",
          })),
          url: absoluteUrl(hub.path),
        }}
      />
      <JsonLd data={faqJsonLd(hub.faqs)} />

      {/* 1 — The subject, confirmed. No city in the H1: that is the point. */}
      <LandingHero
        eyebrow="Oberizon Construction"
        heading={hub.service.name}
        intro={hub.lead}
        image={hub.service.image}
      />

      {/* 2 — The cost question, answered first. */}
      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="eyebrow">
              The short answer
            </p>
            <h2 className="h-section mt-4">
              What does it <span className="orange-italic">cost?</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">{hub.shortAnswer}</p>
          </div>

          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <div className="bg-ink px-7 py-8 text-white">
              <p className="ui-font flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
                <Banknote size={16} aria-hidden="true" />
                2026 range
              </p>
              <p className="serif-font mt-4 text-4xl leading-none sm:text-5xl">
                {hub.typicalRange}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/60">{hub.priceLine}</p>
            </div>
            {/*
              A real button, not a text link. This is the handoff to the only
              interactive tool on the site, and as a small underline-less link it
              read as a footnote to the price above it.
            */}
            <div className="bg-white p-7">
              <p className="text-sm leading-6 text-slate-500">
                That is the published range. Set your own square footage and finish level for a
                number against your actual space — no form to see the result.
              </p>
              <Link
                href={`/cost?service=${hub.service.slug}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
              >
                <Calculator size={17} aria-hidden="true" />
                Estimate your build
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — What's included. */}
      <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">
              What&apos;s included
            </p>
            <h2 className="h-section mt-4">
              Scope of the work.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">{hub.service.summary}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {hub.service.scope.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={19} aria-hidden="true" />
                <span className="text-base leading-7 text-slate-700">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — Built, not claimed. */}
      <ProjectProof items={relevant} heading="Builds we have delivered." />

      {/*
        5 — The load-bearing section. Every city, linked. This is the hub-to-spoke
        edge that did not exist before, and it is what turns fourteen competing
        pages into one topic with fourteen local expressions.
      */}
      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">
            Where we build it
          </p>
          <h2 className="h-section mt-4">
            {hub.service.name} <span className="orange-italic">across the Lower Mainland.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Managed from the White Rock office. Pick your city for local detail, pricing and the
            projects nearest you.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hub.cities.map((city) => (
              <Link
                key={city.href}
                href={city.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-paper px-5 py-4 transition hover:border-orange-300 hover:shadow-sm"
              >
                <span className="flex items-center gap-2.5 text-sm font-bold text-zinc-900 group-hover:text-accent">
                  <MapPin size={16} className="text-orange-500" aria-hidden="true" />
                  {city.label}
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-slate-300 group-hover:text-orange-500"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5b — The guides for this build type.

          src/lib/blog.ts has always said its registry exists partly to feed
          "the service-page related reading rails". There were no such rails:
          nothing outside /blog, /thank-you and the sitemap linked a post, so
          thirty-two articles sat one click from the index and zero clicks from
          the pages that rank. postsForService() was written for this and had no
          caller. */}
      {guides.length > 0 && (
        <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
              <div>
                <p className="eyebrow">Guides</p>
                <h2 className="h-section mt-4">
                  What we have <span className="orange-italic">written about this.</span>
                </h2>
              </div>
              <p className="text-lg font-medium leading-8 text-muted">
                Cost, timeline and permit detail for {hub.service.primaryKeyword}, with the
                numbers left in.
              </p>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={postPath(post.slug)}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
                  >
                    <p className="eyebrow">{post.topic}</p>
                    <h3 className="h-card mt-3 text-ink group-hover:text-accent">
                      {post.cardTitle}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted">{post.description}</p>
                    <p className="ui-font mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold text-muted">
                      <Clock size={13} aria-hidden="true" />
                      {post.minutes} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/blog"
              className="ui-font mt-10 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent transition-all hover:gap-3"
            >
              All construction guides
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* 6 — Sibling hubs. */}
      <WhyTheseServices links={hub.siblings} cityName="the Lower Mainland" />

      {/* 7 — FAQs, collapsed. */}
      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">
            Questions
          </p>
          <h2 className="h-section mt-4">
            Frequently asked.
          </h2>
          <FaqAccordion items={hub.faqs} className="mt-10" />
        </div>
      </section>

      {/* 8 — The ask, as a form rather than a button.

          These ten pages are the campaign's landing pages —
          /services/dental-clinic-construction/ is where the Google Ads traffic
          arrives — and every call to action on them used to be a link to
          /contact, which is a page with no form on it. So a paid visitor ready
          to enquire had a page load and a second click still ahead of them
          before reaching a single field. The form is on the page now, and the
          project type is preselected because the visitor already told us which
          one by being here. */}
      <section className="relative overflow-hidden bg-ink px-5 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,79,10,0.16),transparent_34rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Book a Consultation</p>
            <h2 className="h-section mt-4 text-white">
              Planning {hub.service.primaryKeyword}?{" "}
              <span className="orange-italic">Tell us the space.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
              Tell us the space and the timeline. We will come back with what has to be planned
              before construction starts — anywhere from White Rock to Chilliwack.
            </p>
            <div className="mt-8">
              <CallLink onDark />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
            <ConsultationForm
              formSource={`service-${hub.service.slug}`}
              tone="dark"
              defaultProjectType={hub.service.name}
            />
          </div>
        </div>
      </section>
    </>
  );
}
