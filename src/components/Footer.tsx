import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  constructionServices,
  credentials,
  resourceLinks,
  serviceAreas,
  siteConfig,
  socialLinks,
} from "@/lib/site";

const socialMarks: Record<string, string> = {
  Instagram: "IG",
  TikTok: "TT",
  YouTube: "YT",
  Facebook: "FB",
};

export function Footer() {
  return (
    <footer className="ui-font bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.9fr_0.9fr_0.9fr_0.85fr] lg:px-8">
        <div>
          <Image
            src="/oberizon/oberizon-logo.svg"
            alt="Oberizon Construction"
            width={192}
            height={88}
            className="h-auto w-44"
          />
          <p className="mt-6 max-w-xs text-sm font-medium leading-7 text-white/58">
            Oberizon Construction is a White Rock-based construction company specializing in
            healthcare construction, commercial interiors, and luxury residential projects across
            the Lower Mainland.
          </p>
          {/*
            Label above value rather than beside it. The previous two-column grid
            fixed the label track at 80px, but "ESTABLISHED" sets ~95px at this
            letter-spacing, so it collided with its own value while the shorter
            labels left their values wrapping raggedly. Stacking removes the
            constraint entirely — no label length can break this layout.
          */}
          <dl className="mt-8 grid max-w-xs gap-5">
            {credentials.map((item) => (
              <div key={item.label}>
                <dt className="ui-font text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-400">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium leading-6 text-white/70">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="ui-font text-xs font-extrabold uppercase tracking-[0.28em] text-white">Services</h2>
          {/*
            Every service, not a slice. The previous slice(4, 10) silently hid
            Commercial Construction and Commercial Renovation — at 1,000 and 880
            searches a month, the two largest keyword opportunities measured in
            the entire research set.

            Points at the service hubs rather than /construction/white-rock/*,
            which sent every footer click to one city regardless of the visitor.
          */}
          <ul className="mt-6 space-y-3">
            {constructionServices.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm font-semibold text-white/55 transition hover:text-orange-500"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="ui-font text-xs font-extrabold uppercase tracking-[0.28em] text-white">Service Areas</h2>
          {/*
            Rendered from serviceAreas so the footer and the Service Areas page
            can never disagree — previously a hardcoded 10 against a list of 14.
            Each city links to its highest-volume service page, which is the
            internal-linking backbone the strategy asks for.
          */}
          <ul className="mt-6 space-y-3">
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/construction/${area.slug}/commercial-construction`}
                  className="text-sm font-semibold text-white/55 transition hover:text-orange-500"
                >
                  {area.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="ui-font text-xs font-extrabold uppercase tracking-[0.28em] text-white">Contact</h2>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-white/55">
            <li>
              <a className="flex items-center gap-3 transition hover:text-orange-500" href={siteConfig.phoneHref}>
                <Phone size={16} aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <WhatsAppLink
                analytics="footer-whatsapp"
                label={siteConfig.whatsapp}
                className="flex items-center gap-3 transition hover:text-[#25D366]"
              />
            </li>
            <li>
              <a className="flex items-center gap-3 transition hover:text-orange-500" href={`mailto:${siteConfig.email}`}>
                <Mail size={16} aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                className="flex items-start gap-3 transition hover:text-orange-500"
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={16} aria-hidden="true" className="mt-1 shrink-0" />
                <span>{siteConfig.address}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="ui-font text-xs font-extrabold uppercase tracking-[0.28em] text-white">Connect</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-600 hover:text-white"
                aria-label={link.label}
              >
                <span aria-hidden="true" className="ui-font text-xs font-extrabold uppercase">
                  {socialMarks[link.label] ?? link.label.slice(0, 2)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/*
        Resources get their own band rather than a slot in the Services list.
        As an eleventh list item the label wrapped to two lines, the icon
        detached from it, and a differently-styled entry at the bottom of ten
        services read as a mistake. A full-width band is both calmer and more
        prominent, which suits the one page a visitor might arrive wanting to use.
      */}
      {resourceLinks.length > 0 ? (
        <div className="border-t border-white/10 px-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-sm text-white/60">
              <Calculator size={18} className="shrink-0 text-orange-500" aria-hidden="true" />
              Working out a budget? Set your own square footage and finish level.
            </p>
            <div className="flex flex-wrap gap-3">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 px-5 py-2.5 text-sm font-bold text-orange-400 transition hover:border-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Extra bottom padding on mobile: the floating contact dock is parked in
          this corner and was sitting on the copyright line. The dock is
          icon-only under sm, so the clearance it needs is smaller there than
          the full pill would require. */}
      <div className="border-t border-white/10 px-5 pb-24 pt-6 sm:py-6">
        <div className="mx-auto max-w-7xl text-center text-xs font-semibold text-white/40 sm:text-left">
          <p>
            Copyright © {siteConfig.foundedYear}–{new Date().getFullYear()} Oberizon Construction.{" "}
            <Link href="/privacy-policy" className="transition hover:text-orange-500">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
