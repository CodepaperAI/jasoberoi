import type { MetadataRoute } from "next";
import { allStaticPaths } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-29T00:00:00-04:00");

  return allStaticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/real-estate/") ? 0.72 : 0.82,
  }));
}
