import { siteConfig, type PseoPage, type SitePage } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export function organizationJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${url}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "306 - 1493 Foster Street",
      addressLocality: "White Rock",
      addressRegion: "BC",
      addressCountry: "CA",
    },
    areaServed: [
      "White Rock",
      "South Surrey",
      "Surrey",
      "Vancouver",
      "Burnaby",
      "Richmond",
      "Delta",
      "Langley",
      "Abbotsford",
    ],
    image: absoluteUrl("/assets/images/optimized/hero-desktop.jpg"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
  };
}

export function pageJsonLd(page: SitePage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(page.canonicalPath)}#webpage`,
    url: absoluteUrl(page.canonicalPath),
    name: page.title,
    description: page.description,
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
  };
}

export function pseoPageJsonLd(page: PseoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(page.path)}#service`,
    name: page.h1,
    description: page.description,
    provider: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
    areaServed: {
      "@type": "City",
      name: page.city.city,
      addressRegion: "BC",
      addressCountry: "CA",
    },
    serviceType: page.service.name,
    keywords: page.keywordCluster.join(", "),
    url: absoluteUrl(page.path),
  };
}

export function pseoWebPageJsonLd(page: PseoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(page.path)}#webpage`,
    url: absoluteUrl(page.path),
    name: page.title,
    headline: page.h1,
    description: page.description,
    keywords: page.keywordCluster.join(", "),
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl(page.path)}#service`,
    },
    primaryImageOfPage: absoluteUrl("/assets/images/optimized/hero-desktop.jpg"),
  };
}

export function breadcrumbJsonLd(items: Array<{ label: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
