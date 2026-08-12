import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingSections";
import {
  blogIndexPath,
  getPost,
  postPath,
  postsForService,
  type BlogPost,
} from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";
import { constructionServices } from "@/lib/site";

/**
 * The frame every post renders inside.
 *
 * Each .mdx file is body copy and nothing else — the schema, breadcrumb,
 * byline, service link and CTA live here, so eleven posts cannot drift into
 * eleven slightly different layouts. Adding a twelfth post means adding one
 * registry entry and one .mdx file.
 *
 * `faqs` is passed rather than scraped from the rendered markdown: FAQPage
 * markup that disagrees with the visible text is worse than none, and reading
 * it from data is the only way to be sure the two match.
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
  const related = postsForService(post.service).filter((item) => item.slug !== slug);
  const parent = post.childOf ? getPost(post.childOf) : undefined;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-6 lg:pt-20">
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
          ← All articles
        </Link>
      </nav>

      <p className="eyebrow mt-8">
        <time dateTime={post.published}>{formatDate(post.published)}</time>
        <span aria-hidden="true"> · </span>
        {post.minutes} min read
      </p>

      {/* The child post says so in its own words, high on the page, so a reader
          who wanted the general answer can leave for it immediately. */}
      {parent && (
        <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-base leading-7 text-muted">
          This is a detailed look at one clinic size. For the general picture
          across every size, read{" "}
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
          <ul className="mt-4 flex flex-col gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={postPath(item.slug)}
                  className="text-orange-700 underline underline-offset-2"
                >
                  {item.title}
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
