import type { Metadata } from "next";
import { HomeExperience } from "@/components/HomeExperience";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, websiteJsonLd } from "@/lib/schema";
import { homePage } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: homePage.title,
  description: homePage.description,
  path: homePage.canonicalPath,
  keywords: homePage.keywords,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }])} />
      <HomeExperience />
    </>
  );
}
