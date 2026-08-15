import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/SectionPrimitives";
import { ProjectProof } from "@/components/LandingSections";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getMainPage, mainPages, projects } from "@/lib/site";

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
    keywords: page.keywords,
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
      {/* The portfolio page rendered text cards and exactly one photograph,
          while the projects array carried twenty. ProjectProof already renders
          project.images[0] with the grid handling, so this is reuse rather than
          a new component — and a contractor's portfolio finally shows the work.
          Placed after ContentPage so nothing above it moves: the h1, title and
          canonical are untouched. */}
      {slug === "projects" && (
        <ProjectProof
          items={projects}
          heading="The work, as delivered."
        />
      )}
    </>
  );
}
