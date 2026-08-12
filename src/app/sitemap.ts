import type { MetadataRoute } from "next";
import { allStaticPaths } from "@/lib/site";
import { canonicalPageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The date the page content itself last changed — the SEO consultant's title
  // and description rewrite, which touched every page. Bump this when copy
  // changes, not on every deploy: a lastmod that moves without the content
  // moving is the signal Google learns to stop trusting.
  const lastModified = new Date("2026-08-10T00:00:00-04:00");

  return allStaticPaths.map((path) => ({
    url: canonicalPageUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/construction/") ? 0.74 : 0.84,
  }));
}
