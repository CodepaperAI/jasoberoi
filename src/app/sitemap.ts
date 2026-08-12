import type { MetadataRoute } from "next";
import { allStaticPaths } from "@/lib/site";
import { canonicalPageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-30T00:00:00-04:00");

  return allStaticPaths.map((path) => ({
    url: canonicalPageUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/construction/") ? 0.74 : 0.84,
  }));
}
