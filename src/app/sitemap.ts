import type { MetadataRoute } from "next";
import { allStaticPaths } from "@/lib/site";
import { canonicalPageUrl } from "@/lib/seo";
import { blogIndexPath, blogPosts, postPath } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The date the page content itself last changed — the SEO consultant's title
  // and description rewrite, which touched every page. Bump this when copy
  // changes, not on every deploy: a lastmod that moves without the content
  // moving is the signal Google learns to stop trusting.
  const lastModified = new Date("2026-08-10T00:00:00-04:00");

  const pages: MetadataRoute.Sitemap = allStaticPaths.map((path) => ({
    url: canonicalPageUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/construction/") ? 0.74 : 0.84,
  }));

  // Posts carry their own date rather than the site-wide constant. A blog is
  // the one part of the site where lastmod is genuinely per-URL, and reporting
  // eleven posts as all modified on the same day is the kind of uniform signal
  // Google learns to ignore.
  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: canonicalPageUrl(postPath(post.slug)),
    lastModified: new Date(`${post.published}T00:00:00-07:00`),
    changeFrequency: "yearly",
    priority: 0.64,
  }));

  const index: MetadataRoute.Sitemap = [
    {
      url: canonicalPageUrl(blogIndexPath),
      lastModified: new Date(
        `${blogPosts.map((p) => p.published).sort().at(-1)}T00:00:00-07:00`,
      ),
      changeFrequency: "weekly",
      priority: 0.74,
    },
  ];

  return [...pages, ...index, ...posts];
}
