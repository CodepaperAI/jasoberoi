import type { MetadataRoute } from "next";
import { allStaticPaths } from "@/lib/site";
import { getAllCityHubs } from "@/lib/cityHubs";
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

  /*
    City hubs, added here rather than in allStaticPaths.

    src/lib/cityHubs.ts imports serviceAreas, projects and reviews from
    src/lib/site.ts, so having site.ts import the hubs back would close an import
    cycle — and site.ts is the module scripts/check-trust.mjs loads first. The
    sitemap is the only consumer of allStaticPaths that needs these URLs, so the
    list is assembled at the point of use instead.

    0.8 sits them above the city-service leaves at 0.74 and below the main pages
    at 0.84, which is the shape of the hierarchy: a hub gathers ten pages and is
    gathered by /construction.
  */
  const cityHubs: MetadataRoute.Sitemap = getAllCityHubs()
    .filter((hub) => hub.indexable)
    .map((hub) => ({
      url: canonicalPageUrl(hub.path),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
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

  return [...pages, ...cityHubs, ...index, ...posts];
}
