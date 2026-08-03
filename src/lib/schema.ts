import {
  aiFaqs,
  serviceAreas,
  siteConfig,
  type ConstructionPseoPage,
  type SitePage,
} from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export function organizationJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "GeneralContractor"],
    "@id": `${url}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Suite 305, 1493 Foster St",
      addressLocality: "White Rock",
      addressRegion: "BC",
      postalCode: "V4B 0C4",
      addressCountry: "CA",
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area.city,
      addressRegion: "BC",
      addressCountry: "CA",
    })),
    image: absoluteUrl("/oberizon/optimized/hero-commercial.webp"),
    logo: absoluteUrl("/oberizon/optimized/oberizon-logo.png"),
    priceRange: "$$$",
    foundingDate: String(siteConfig.foundedYear),
    founder: {
      "@type": "Person",
      name: siteConfig.founderName,
      jobTitle: siteConfig.founderRole,
    },
    knowsAbout: [
      "Healthcare construction",
      "Dental clinic construction",
      "Medical clinic construction",
      "Pharmacy construction",
      "Commercial construction",
      "Commercial renovation",
      "Office renovation",
      "Luxury residential construction",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "licence",
        name: siteConfig.licenceStatus,
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "insurance",
        name: siteConfig.insuranceStatus,
      },
    ],
    sameAs: [
      "https://www.instagram.com/oberizon_construction",
      "https://www.facebook.com/Oberizon",
      "https://www.tiktok.com/@oberoi_construction",
      "https://www.youtube.com/channel/UCXnubLHaLMq3oBTR8w0ylUg",
    ],
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
    headline: page.heading,
    description: page.description,
    keywords: page.keywords.join(", "),
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
  };
}

export function constructionServiceJsonLd(page: ConstructionPseoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(page.path)}#service`,
    name: page.h1,
    description: page.description,
    serviceType: page.service.name,
    provider: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
    areaServed: {
      "@type": "City",
      name: page.city.city,
      addressRegion: "BC",
      addressCountry: "CA",
    },
    keywords: page.keywords.join(", "),
    url: absoluteUrl(page.path),
  };
}

export function constructionWebPageJsonLd(page: ConstructionPseoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(page.path)}#webpage`,
    url: absoluteUrl(page.path),
    name: page.title,
    headline: page.h1,
    description: page.description,
    keywords: page.keywords.join(", "),
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl(page.path)}#service`,
    },
    primaryImageOfPage: absoluteUrl(page.service.image),
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

export function faqJsonLd(faqs: Array<{ question: string; answer: string }> = aiFaqs) {
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
