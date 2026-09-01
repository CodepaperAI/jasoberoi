import Image from "next/image";
import { altFor } from "@/lib/photos";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Banknote, CalendarClock, Clock, FileCheck2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingSections";
import { PageHero } from "@/components/SectionPrimitives";
import {
  blogPosts,
  blogTopics,
  featuredPost,
  postPath,
  postsByDate,
  postsForService,
  postsForTopic,
  postImage,
  topicBlurbs,
  type BlogPost,
  type BlogTopic,
} from "@/lib/blog";
import { blogIndexJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { constructionServices, serviceAreas, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Construction Guides for BC Clinic & Commercial Owners | Oberizon",
  description:
    "Cost breakdowns, build timelines and permit guides for dental, medical and commercial construction in BC — written from delivered projects.",
  path: "/blog",
  keywords: [
    "dental clinic construction cost BC",
    "medical clinic construction permits BC",
    "tenant improvement allowance",
    "commercial renovation vs new construction",
  ],
});

/**
 * The three questions the hero promises an answer to, made into doors.
 *
 * The headline on this page has always read "What it costs, how long it takes,
 * and what the city will ask for" and the page under it was a single
 * undifferentiated list, so it promised three answers and offered one way in.
 * These are those three sentences, pointing at the clusters that hold them.
 */
const startHere: Array<{ topic: BlogTopic; icon: typeof Banknote; question: string }> = [
  { topic: "Cost", icon: Banknote, question: "What will it cost?" },
  { topic: "Timelines", icon: CalendarClock, question: "How long will it take?" },
  {
    topic: "Permits & Compliance",
    icon: FileCheck2,
    question: "What will the city ask for?",
  },
];

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00-07:00`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * One card. The eyebrow carries the topic rather than the service, because the
 * cards are already grouped by service-adjacent subject and repeating it inside
 * every cluster wasted the one line a reader actually scans.
 *
 * cardTitle rather than title: every post has carried a short index label since
 * the registry was written and the index rendered the full SEO headline
 * instead, which is why two-line titles were the normal case.
 */
function PostCard({ post, showTopic = false }: { post: BlogPost; showTopic?: boolean }) {
  return (
    <Link
      href={postPath(post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        <Image
          src={postImage(post)}
          alt={altFor(postImage(post))}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        {showTopic && (
          <span className="ui-font absolute left-4 top-4 rounded-full border border-orange-100 bg-white/95 px-3 py-1.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-orange-700">
            {post.topic}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="h-card text-ink group-hover:text-accent">{post.cardTitle}</h3>
        <p className="mt-3 text-base leading-7 text-muted">{post.description}</p>
        <p className="ui-font mt-auto flex items-center gap-3 pt-5 text-xs font-semibold text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={13} aria-hidden="true" />
            {post.minutes} min
          </span>
          <span aria-hidden="true" className="text-line">|</span>
          <time dateTime={post.published}>{formatDate(post.published)}</time>
        </p>
      </div>
    </Link>
  );
}

/** Heading left, supporting line opposite — the section header the rest of the site uses. */
function ClusterHeader({ topic, count }: { topic: BlogTopic; count: number }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
      <div>
        <p className="eyebrow">
          {count} {count === 1 ? "guide" : "guides"}
        </p>
        <h2 className="h-section mt-4 text-ink">{topic}</h2>
      </div>
      <p className="text-lg font-medium leading-8 text-muted">{topicBlurbs[topic]}</p>
    </div>
  );
}

export default function BlogIndex() {
  const posts = postsByDate();
  const lead = featuredPost();
  const stats = [
    { value: String(posts.length), unit: "guides", label: "Written from delivered projects" },
    {
      value: String(constructionServices.length),
      unit: "build types",
      label: "Every one with its cost band published",
    },
    { value: String(serviceAreas.length), unit: "cities", label: "Across the Lower Mainland" },
    {
      value: String(new Date().getFullYear() - siteConfig.foundedYear),
      unit: "years",
      label: `Building since ${siteConfig.foundedYear}`,
    },
  ];

  return (
    <>
      <JsonLd data={blogIndexJsonLd(posts)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Guides"
        heading="What it costs, how long it takes, and what the city will ask for."
        subheading={`${blogPosts.length} guides on building clinics and commercial space in British Columbia — written from the jobs we have delivered, with the numbers left in.`}
        image="/oberizon/optimized/project-healthcare-3.jpg"
      />

      {/* The numbers this library is built on, in the treatment ProofBar uses
          everywhere else — hairlines between columns rather than four boxes. */}
      <section className="border-b border-line bg-paper px-5 py-14 sm:px-6 lg:px-8">
        <dl className="mx-auto grid max-w-7xl gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={[
                "px-2 text-center lg:px-8",
                index > 0 ? "lg:border-l lg:border-line" : "",
              ].join(" ")}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="serif-font block text-5xl leading-none text-ink sm:text-6xl">
                  {stat.value}
                  <span className="orange-italic ml-2 text-2xl sm:text-3xl">{stat.unit}</span>
                </span>
                <span className="mt-3 block text-sm font-medium leading-6 text-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Start here */}
      <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="h-section mt-4 text-ink">
                Three questions, and <span className="orange-italic">where each is answered.</span>
              </h2>
            </div>
            <p className="text-lg font-medium leading-8 text-muted">
              Most people arrive with one of these. Follow the one that is yours, or read the
              full library below.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
            {startHere.map(({ topic, icon: Icon, question }) => {
              const count = postsForTopic(topic).length;
              return (
                <Link
                  key={topic}
                  href={`#${topicId(topic)}`}
                  className="group flex flex-col bg-paper p-8 transition hover:bg-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent ring-1 ring-orange-100">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="h-card mt-6 text-ink group-hover:text-accent">{question}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{topicBlurbs[topic]}</p>
                  <span className="ui-font mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-accent transition-all group-hover:gap-3">
                    {count} guides
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The lead. Full-bleed photograph with the words on it, which is the
          site's signature move and the reason this page previously had no
          hierarchy at all — thirty-two cards of identical weight. */}
      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Start with this one</p>
          <Link
            href={postPath(lead.slug)}
            className="group relative mt-6 flex min-h-[420px] items-end overflow-hidden rounded-3xl bg-ink md:min-h-[480px]"
          >
            <Image
              src={postImage(lead)}
              alt={altFor(postImage(lead))}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/55 to-ink/15" />
            <div className="relative max-w-3xl p-8 text-white sm:p-12">
              <p className="ui-font text-xs font-extrabold uppercase tracking-[0.22em] text-white/85">
                {lead.topic}
                <span aria-hidden="true"> · </span>
                {lead.minutes} min read
              </p>
              <h2 className="h-card-lg mt-4 !text-white">{lead.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
                {lead.description}
              </p>
              <span className="ui-font mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition-all group-hover:gap-3">
                Read the guide
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* One band per question type, alternating surface so a reader can see
          where one subject ends and the next begins while scrolling past. */}
      {blogTopics.map((topic, index) => {
        const group = postsForTopic(topic);
        if (!group.length) return null;

        return (
          <section
            key={topic}
            id={topicId(topic)}
            className={[
              "scroll-mt-24 px-5 py-20 sm:px-6 lg:px-8",
              index % 2 === 0 ? "bg-raised" : "bg-paper",
            ].join(" ")}
          >
            <div className="mx-auto max-w-7xl">
              <ClusterHeader topic={topic} count={group.length} />
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* The other axis. Topic answers "what am I asking"; this answers "what am
          I building", and it is also the only place on the site where a service
          and its guides are listed together. */}
      <section className="bg-ink px-5 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">By build type</p>
              <h2 className="h-section mt-4 text-white">
                Or start from <span className="orange-italic">what you are building.</span>
              </h2>
            </div>
            <p className="text-lg font-medium leading-8 text-white/70">
              Every service we run, with the guides that go with it and the page that gives its
              cost band.
            </p>
          </div>

          {/* Columns rather than a grid. Ten services carrying between one and
              eight guides each will not fill grid rows evenly — the tracks size
              to the tallest item, so Dental Clinic Construction left a hole
              under it the height of the Healthcare list beside it. Flowing them
              as columns packs the whitespace out; break-inside keeps a service
              and its guides together. */}
          <ul className="mt-12 [column-gap:2.5rem] sm:columns-2 lg:columns-3">
            {constructionServices.map((service) => {
              const servicePosts = postsForService(service.slug);
              return (
                <li key={service.slug} className="mb-8 break-inside-avoid border-t border-white/15 pt-5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="ui-font text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:text-accent"
                  >
                    {service.name}
                  </Link>
                  {servicePosts.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {servicePosts.map((post) => (
                        <li key={post.slug}>
                          <Link
                            href={postPath(post.slug)}
                            className="text-[0.9375rem] leading-6 text-white/60 underline decoration-transparent underline-offset-2 transition hover:text-white hover:decoration-white/40"
                          >
                            {post.cardTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <LandingCta
        heading="Still deciding what your build will cost?"
        body="These guides give the ranges we publish. A consultation gives you the number for your space, your municipality and the state of the building you are looking at."
      />
    </>
  );
}

/** Anchor ids for the topic bands, so "Start here" can point at them. */
function topicId(topic: BlogTopic) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
