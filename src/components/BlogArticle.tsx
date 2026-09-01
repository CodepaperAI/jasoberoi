import Image from "next/image";
import { altFor } from "@/lib/photos";
import Link from "next/link";
import { Clock } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingSections";
import {
  blogIndexPath,
  getPost,
  postPath,
  postsForService,
  postsForTopic,
  postImage,
} from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";
import { constructionServices } from "@/lib/site";

/**
 * The frame every post renders inside.
 *
 * Each .mdx file is body copy and nothing else — the schema, breadcrumb,
 * byline, contents list, service link, FAQs and CTA live here, so thirty-two
 * posts cannot drift into thirty-two slightly different layouts. Adding a
 * thirty-third means adding one registry entry and one .mdx file.
 *
 * `faqs` is passed rather than scraped from the rendered markdown: FAQPage
 * markup that disagrees with the visible text is worse than none, and reading
 * it from data is the only way to be sure the two match. They are also now
 * *rendered* from that same array rather than restated in the body, which is
 * what actually guarantees it — every post used to write its FAQs twice, once
 * for the schema and once for the reader, with nothing holding the two together.
 */
export function BlogArticle({
  slug,
  faqs = [],
  children,
}: {
  slug: string;
  faqs?: Array<{ question: string; answer: string }>;
  children: React.ReactNode;
}) {
  const post = getPost(slug);

  // A post with no registry entry would render but never be linked or
  // submitted. Failing loudly at build beats shipping an orphan.
  if (!post) {
    throw new Error(
      `No blog registry entry for "${slug}". Add it to blogPosts in src/lib/blog.ts.`,
    );
  }

  const service = constructionServices.find((item) => item.slug === post.service);
  const parent = post.childOf ? getPost(post.childOf) : undefined;
  const hero = postImage(post);

  /*
    Related reading used to be same-service only, which worked while the blog
    was dental-heavy and silently produced an empty rail everywhere else: three
    services carry a single post each, so those articles ended with a heading
    and nothing under it. Same service first — it is the closest relationship —
    then same topic to fill, because a reader who just finished one cost guide
    is demonstrably in the market for another.
  */
  const sameService = postsForService(post.service).filter((item) => item.slug !== slug);
  const sameTopic = postsForTopic(post.topic).filter(
    (item) => item.slug !== slug && !sameService.some((other) => other.slug === item.slug),
  );
  const related = [...sameService, ...sameTopic].slice(0, 4);

  return (
    /*
      pt clears the fixed header, which is h-20 rising to h-24 at sm. The old
      pt-12 put the breadcrumb underneath it on every post — the site's other
      pages never showed the bug because they all open on PageHero, which
      carries pt-36 of its own.
    */
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: blogIndexPath },
          { label: post.cardTitle, href: postPath(post.slug) },
        ])}
      />
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={blogIndexPath} className="hover:text-zinc-950">
          ← All guides
        </Link>
      </nav>

      {/* Photograph, then meta, then headline. It sits above the h1 because the
          h1 lives inside the .mdx body and cannot be rendered around — and the
          order is the ordinary editorial one, so nothing is lost by it.

          Alt was empty on the reasoning that a pool-dealt photograph could not
          be described honestly — which was right while the Healthcare pool
          could deal a luxury house to a pharmacy cost guide. The pool is now
          subject-checked, so the alt describes the actual room. */}
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-ink">
        <Image
          src={hero}
          alt={altFor(hero)}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          priority
          className="object-cover"
        />
      </div>

      <p className="eyebrow mt-8">
        {post.topic}
        <span aria-hidden="true"> · </span>
        <time dateTime={post.published}>{formatDate(post.published)}</time>
        <span aria-hidden="true"> · </span>
        {post.minutes} min read
      </p>

      {/* The child post says so in its own words, high on the page, so a reader
          who wanted the general answer can leave for it immediately. */}
      {parent && (
        <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-base leading-7 text-muted">
          This article goes deep on one specific case. For the general picture,
          read{" "}
          <Link
            href={postPath(parent.slug)}
            className="text-orange-700 underline underline-offset-2"
          >
            {parent.title}
          </Link>
          .
        </p>
      )}

      {children}

      {faqs.length > 0 && (
        <section className="mt-16">
          <h2 className="serif-font text-[1.5rem] font-normal leading-[1.2] tracking-[-0.01em] text-ink sm:text-[1.875rem]">
            Frequently asked questions
          </h2>
          <FaqAccordion items={faqs} className="mt-6" />
        </section>
      )}

      {service && (
        <section className="mt-16 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-bold text-zinc-950">
            The service this article is about
          </h2>
          <p className="mt-3 text-lg leading-8 text-muted">
            {service.summary}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className="mt-4 inline-block text-orange-700 underline underline-offset-2"
          >
            {service.name} →
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-zinc-950">Related reading</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={postPath(item.slug)}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
                >
                  <p className="eyebrow">{item.topic}</p>
                  <p className="mt-2 text-base font-bold leading-snug text-ink group-hover:text-accent">
                    {item.cardTitle}
                  </p>
                  <p className="ui-font mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold text-muted">
                    <Clock size={13} aria-hidden="true" />
                    {item.minutes} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-16">
        <LandingCta
          heading="Planning a build like this?"
          body="Before you commit to a space, drawings, a budget, or a construction timeline, book a consultation and we will tell you what has to be planned before construction starts."
        />
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00-07:00`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
