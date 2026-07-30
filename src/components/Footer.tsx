import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { constructionServices, quickLinks, siteConfig, socialLinks } from "@/lib/site";

const socialMarks: Record<string, string> = {
  Instagram: "IG",
  TikTok: "TT",
  YouTube: "YT",
  Facebook: "FB",
};

export function Footer() {
  return (
    <footer className="industrial-surface border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.75fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            width={220}
            height={74}
            className="h-auto w-44"
          />
          <p className="mt-6 max-w-sm text-lg font-medium leading-7 text-white/[0.74]">
            White Rock based construction company specializing in healthcare construction,
            commercial interiors, and luxury residential projects across the Lower Mainland.
          </p>
        </div>

        <div>
          <h2 className="display-font text-xl uppercase text-white">Quick Links</h2>
          <ul className="mt-5 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base font-bold uppercase text-white/70 transition hover:text-amber-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="display-font text-xl uppercase text-white">Services</h2>
          <ul className="mt-5 space-y-2">
            {constructionServices.slice(0, 7).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/construction/white-rock/${service.slug}`}
                  className="text-base font-bold uppercase text-white/70 transition hover:text-amber-300"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="display-font text-xl uppercase text-white">Contact</h2>
          <ul className="mt-5 space-y-3 text-base font-semibold text-white/[0.78]">
            <li>
              <a className="flex items-center gap-3 transition hover:text-amber-300" href={siteConfig.phoneHref}>
                <Phone size={20} aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 transition hover:text-amber-300" href={`mailto:${siteConfig.email}`}>
                <Mail size={20} aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a className="flex items-start gap-3 transition hover:text-amber-300" href={siteConfig.mapsUrl}>
                <MapPin size={20} aria-hidden="true" className="mt-1 shrink-0" />
                <span>{siteConfig.address}</span>
              </a>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/[0.16] bg-white/[0.04] text-white transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950"
                aria-label={link.label}
              >
                <span aria-hidden="true" className="display-font text-base uppercase">
                  {socialMarks[link.label] ?? link.label.slice(0, 2)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm font-bold text-white/[0.58] sm:flex-row sm:text-left">
          <p>Copyright (c) 2014-2026 Oberizon Construction. All Rights Reserved.</p>
          <p>Healthcare | Commercial | Luxury Residential Construction</p>
        </div>
      </div>
    </footer>
  );
}
