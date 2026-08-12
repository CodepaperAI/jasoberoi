import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Blog posts render through the site's own type system, not MDX defaults.
 *
 * Without this every post would ship as unstyled browser markup — Times New
 * Roman headings against the Georgia/sans pairing the rest of the site uses.
 * The classes below are the ones already carried by the landing sections, so a
 * post reads as part of the site rather than as a document dropped into it.
 *
 * Required by @next/mdx under the App Router: without this file the plugin does
 * not work at all.
 */
const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="h-hero mt-2 max-w-3xl text-balance">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="h-section mt-14 max-w-3xl text-balance">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 text-xl font-bold text-zinc-950">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-lg leading-8 text-muted">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 flex list-disc flex-col gap-2 pl-6 text-lg leading-8 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2 pl-6 text-lg leading-8 text-muted">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-zinc-950">{children}</strong>
  ),
  // Cost and timeline tables are the reason these posts can be cited by an AI
  // answer, so they get real treatment — and their own horizontal scroll, since
  // a three-column cost table does not fit a phone without pushing the body.
  table: ({ children }) => (
    <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full border-collapse text-left text-base">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 font-bold text-zinc-950">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-zinc-100 px-4 py-3 align-top text-muted tabular-nums">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-8 rounded-xl border-l-4 border-orange-500 bg-zinc-50 px-5 py-4 text-lg leading-8 text-zinc-950">
      {children}
    </blockquote>
  ),
  // Internal hrefs go through next/link so a reader moving from a post to a
  // service page gets the same client transition as the rest of the site.
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-orange-700 underline underline-offset-2">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        rel="noopener noreferrer"
        className="text-orange-700 underline underline-offset-2"
      >
        {children}
      </a>
    ),
  hr: () => <hr className="mt-12 border-zinc-200" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
