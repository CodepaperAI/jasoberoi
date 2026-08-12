import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  /**
   * Set false for pages that are built and linkable but should not be asked to
   * rank — currently the city pages with no delivered project and no measured
   * search demand. Links are still followed, so equity reaches the pages that
   * have earned their place.
   */
  index?: boolean;
};

export function absoluteUrl(path: string) {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * Page URLs only — never assets. trailingSlash is true, so the URL a page is
 * actually served at ends in "/". Next applies that normalisation to the
 * canonical tag for you, but not to sitemap entries, which are emitted
 * verbatim. Without this the sitemap advertises 86 URLs that all 308 to their
 * canonical, and Search Console files every one under "Page with redirect".
 */
export function canonicalPageUrl(path: string) {
  return absoluteUrl(path.endsWith("/") ? path : `${path}/`);
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/oberizon/optimized/hero-commercial.webp",
  keywords = [],
  index = true,
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: url,
    },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: `${siteConfig.name} construction project`,
        },
      ],
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
