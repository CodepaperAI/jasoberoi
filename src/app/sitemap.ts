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

  /*
    Pages that changed after that sweep, dated individually.

    Three of these were claiming 2026-08-10 while not existing until weeks
    later, which is the same credibility problem the constant above is written
    to avoid, pointed the other way: a lastmod that predates the page. A crawler
    that fetches a "month-old" URL it has never seen has been told something
    untrue on the first thing it read.

    Deliberately short. The image and alt-text pass on 2026-09-01 touched most
    of the site, and bumping a hundred URLs to one date is precisely the uniform
    signal the comment above warns about — a swapped photograph is not a content
    change worth re-crawling for. Only genuinely new pages, and pages whose text
    changed, are listed.
  */
  const changed: Record<string, string> = {
    // Added when the Services menu was split by vertical.
    "/services/custom-home-building": "2026-09-01",
    "/services/home-renovation": "2026-09-01",
    // Built against measured Search Console demand; new city hub.
    "/construction/langley": "2026-09-04",
    // Gained the "is a remodel different from a renovation" answer.
    "/services/dental-office-renovation": "2026-09-04",
  };

  const modified = (path: string) => {
    const iso = changed[path.replace(/\/$/, "")];
    return iso ? new Date(`${iso}T00:00:00-07:00`) : lastModified;
  };

  const pages: MetadataRoute.Sitemap = allStaticPaths.map((path) => ({
    url: canonicalPageUrl(path),
    lastModified: modified(path),
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
      lastModified: modified(hub.path),
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
