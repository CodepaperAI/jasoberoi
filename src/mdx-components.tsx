import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Blog posts render through the site's own type system, not MDX defaults.
 *
 * These deliberately do NOT use .h-hero and .h-section. Those are the
 * landing-page display sizes — clamp(2rem, 3.6vw, 3.25rem) for a section
 * heading — and they are built for full-bleed bands with a lot of air around
 * them. Dropped into a 3xl reading column they rendered a 69px h1 above a 46px
 * h2 above 18px body copy, which read as a stack of billboards with captions
 * between them rather than as an article.
 *
 * What carries over from the brand is the pairing, not the scale: Georgia at
 * weight 400 for headings, sans for body. Sizes here are set for reading.
 *
 * Body copy uses ink-soft rather than muted. Muted (#6b6358) is correct for a
 * supporting line under a heading; across two thousand words of running text it
 * is tiring, and these posts are meant to be read to the end.
 *
 * Required by @next/mdx under the App Router: without this file the plugin does
 * not work at all.
 */
const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="serif-font mt-2 text-[2.125rem] font-normal leading-[1.12] tracking-[-0.01em] text-ink text-balance sm:text-[2.75rem]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="serif-font mt-14 text-[1.5rem] font-normal leading-[1.2] tracking-[-0.01em] text-ink text-balance sm:text-[1.875rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="ui-font mt-9 text-lg font-bold leading-snug text-ink sm:text-xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-lg">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 flex list-disc flex-col gap-2.5 pl-6 text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2.5 pl-6 text-[1.0625rem] leading-[1.75] text-ink-soft sm:text-lg">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  // Cost and timeline tables are the reason these posts can be quoted by an AI
  // answer, so they get real treatment — and their own horizontal scroll, since
  // a four-column cost table does not fit a phone without pushing the body.
  table: ({ children }) => (
    <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full border-collapse text-left text-[0.9375rem]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-50">{children}</thead>,
  th: ({ children }) => (
    <th className="ui-font border-b border-zinc-200 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-zinc-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-zinc-100 px-4 py-3 align-top leading-relaxed text-ink-soft tabular-nums">
      {children}
    </td>
  ),
  // The key-takeaway block. It is the answer an AI assistant lifts, so it reads
  // as the most quotable thing on the page rather than as a decorative aside.
  blockquote: ({ children }) => (
    <blockquote className="mt-8 rounded-xl border-l-4 border-accent bg-stone px-5 py-4 text-[1.0625rem] leading-[1.7] text-ink sm:text-lg">
      {children}
    </blockquote>
  ),
  // Internal hrefs go through next/link so a reader moving from a post to a
  // service page gets the same client transition as the rest of the site.
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-accent-dark underline decoration-orange-300 underline-offset-2 hover:decoration-orange-500"
      >
        {children}
      </Link>
    ) : (
      <a
        href={href}
        rel="noopener noreferrer"
        className="font-medium text-accent-dark underline decoration-orange-300 underline-offset-2 hover:decoration-orange-500"
      >
        {children}
      </a>
    ),
  hr: () => <hr className="mt-12 border-line" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
