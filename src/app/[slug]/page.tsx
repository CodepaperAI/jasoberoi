import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/SectionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getMainPage, mainPages } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return mainPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getMainPage(slug);

  if (!page) {
    return {};
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.canonicalPath,
    image: page.heroImage,
  });
}

export default async function MainPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getMainPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: page.eyebrow, href: page.canonicalPath },
        ])}
      />
      <JsonLd data={pageJsonLd(page)} />
      <ContentPage page={page} />
    </>
  );
}
