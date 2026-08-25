import { ListOrdered } from "lucide-react";
import { getPost, slugifyHeading } from "@/lib/blog";

/**
 * The contents list for a post, placed by the post itself.
 *
 * It is a separate component rather than something BlogArticle renders because
 * of where it has to go. BlogArticle receives the whole body as `children`, and
 * the h1 is the first thing inside it — so anything the frame renders lands
 * either above the title or below the conclusion, and a contents list belongs
 * in neither place. Four posts also carry an h1 that deliberately differs from
 * their <title> tag, so lifting the heading out of the .mdx to solve this would
 * have flattened a deliberate SEO distinction.
 *
 * So each post drops this in after its key-takeaway block, which is the point a
 * reader has decided to stay. check-trust enforces that every post with a
 * `sections` list actually renders one, with a matching slug.
 *
 * Headings come from the registry rather than from the markdown because a
 * static export has no access to the MDX AST at render time. slugifyHeading()
 * is shared with the h2 override in mdx-components.tsx, so the anchor this
 * links to and the id that exists are computed by the same function.
 */
export function PostContents({ slug }: { slug: string }) {
  const sections = getPost(slug)?.sections;

  // Under three headings a contents list is noise — it repeats what a reader
  // can already see by scrolling one screen.
  if (!sections || sections.length < 3) return null;

  return (
    <nav
      aria-label="On this page"
      className="mt-10 rounded-2xl border border-line bg-raised px-6 py-6"
    >
      <p className="eyebrow flex items-center gap-2">
        <ListOrdered size={14} aria-hidden="true" />
        On this page
      </p>
      <ol className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {sections.map((heading, index) => (
          <li key={heading} className="flex gap-3 text-[0.9375rem] leading-6">
            <span className="ui-font shrink-0 pt-1 text-xs font-extrabold tabular-nums text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${slugifyHeading(heading)}`}
              className="text-ink-soft underline decoration-transparent underline-offset-2 transition hover:text-accent hover:decoration-orange-400"
            >
              {heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
