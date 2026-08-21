import {
  aiFaqs,
  officeAddress,
  serviceAreas,
  siteConfig,
  type ConstructionPseoPage,
  type SitePage,
} from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { postPath, type BlogPost } from "@/lib/blog";
import type { CityHub } from "@/lib/cityHubs";

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
    // NAP from the one structured source, so the schema cannot disagree with
    // the footer or the contact page. See officeAddress in site.ts.
    address: {
      "@type": "PostalAddress",
      streetAddress: officeAddress.streetAddress,
      addressLocality: officeAddress.locality,
      addressRegion: officeAddress.region,
      postalCode: officeAddress.postalCode,
      addressCountry: officeAddress.country,
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

/**
 * BlogPosting rather than Article: these are dated posts on an identified blog,
 * and the narrower type is the one Google documents for that.
 *
 * publisher points at the existing organization node rather than restating the
 * company — the two would otherwise drift, and an inconsistent publisher is
 * worth less than none.
 */
export function blogPostingJsonLd(post: BlogPost) {
  const url = absoluteUrl(postPath(post.slug));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.published,
    inLanguage: "en-CA",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      "@id": `${absoluteUrl("/")}#organization`,
    },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    about: { "@id": `${absoluteUrl(`/services/${post.service}`)}#service` },
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

/**
 * A city hub as a local business page rather than a Service page.
 *
 * The city-service pages emit `Service`, which is right for them: each is about
 * one named service delivered in one place. A hub is about the *business in the
 * city* across every service, so the closer type is the organization scoped to
 * an area, with `makesOffer` carrying the ten services it links down to.
 *
 * It references the existing `#organization` node rather than restating the
 * company. Two descriptions of one business drift, and an inconsistent one is
 * worth less than none — the same reasoning blogPostingJsonLd's publisher uses.
 */
export function cityHubJsonLd(hub: CityHub) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(hub.path)}#webpage`,
    url: absoluteUrl(hub.path),
    name: hub.title,
    headline: hub.h1,
    description: hub.description,
    keywords: hub.keywords.join(", "),
    inLanguage: "en-CA",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    primaryImageOfPage: absoluteUrl(hub.heroImage),
    about: {
      "@type": "GeneralContractor",
      "@id": `${absoluteUrl(hub.path)}#business`,
      name: siteConfig.name,
      parentOrganization: { "@id": `${absoluteUrl("/")}#organization` },
      url: absoluteUrl(hub.path),
      telephone: siteConfig.phone,
      email: siteConfig.email,
      areaServed: {
        "@type": "City",
        name: hub.city.city,
        addressRegion: "BC",
        addressCountry: "CA",
      },
      makesOffer: hub.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.label,
          areaServed: {
            "@type": "City",
            name: hub.city.city,
            addressRegion: "BC",
            addressCountry: "CA",
          },
        },
        url: absoluteUrl(service.href),
      })),
    },
  };
}
