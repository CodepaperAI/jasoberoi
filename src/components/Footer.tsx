import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { constructionServices, credentials, siteConfig, socialLinks } from "@/lib/site";

const socialMarks: Record<string, string> = {
  Instagram: "IG",
  TikTok: "TT",
  YouTube: "YT",
  Facebook: "FB",
};

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.9fr_0.9fr_0.9fr_0.85fr] lg:px-8">
        <div>
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            width={220}
            height={74}
            className="h-auto w-44"
          />
          <p className="mt-6 max-w-xs text-sm font-medium leading-7 text-white/58">
            Oberizon Construction is a White Rock based construction company specializing in
            healthcare construction, commercial interiors, and luxury residential projects across
            the Lower Mainland.
          </p>
          <dl className="mt-6 grid max-w-xs gap-3 text-xs text-white/60">
            {credentials.map((item) => (
              <div key={item.label} className="grid grid-cols-[80px_1fr] items-baseline gap-3">
                <dt className="font-extrabold uppercase tracking-[0.18em] text-orange-400">
                  {item.label}
                </dt>
                <dd className="text-white/70">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.28em] text-white">Services</h2>
          <ul className="mt-6 space-y-3">
            {constructionServices.slice(4, 10).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/construction/white-rock/${service.slug}`}
                  className="text-sm font-semibold text-white/55 transition hover:text-orange-500"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.28em] text-white">Service Areas</h2>
          <ul className="mt-6 space-y-3">
            {["White Rock . Surrey", "Vancouver . Burnaby", "Richmond . Langley", "Abbotsford . Chilliwack", "North . West Vancouver"].map((area) => (
              <li key={area}>
                <Link
                  href="/construction"
                  className="text-sm font-semibold text-white/55 transition hover:text-orange-500"
                >
                  {area}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.28em] text-white">Contact</h2>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-white/55">
            <li>
              <a className="flex items-center gap-3 transition hover:text-orange-500" href={siteConfig.phoneHref}>
                <Phone size={16} aria-hidden="true" />
                {siteConfig.phone}
              </a>
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
          <h2 className="text-xs font-extrabold uppercase tracking-[0.28em] text-orange-500">Connect</h2>
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
                <span aria-hidden="true" className="text-xs font-extrabold uppercase">
                  {socialMarks[link.label] ?? link.label.slice(0, 2)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs font-semibold text-white/40 sm:flex-row sm:text-left">
          <p>
            Copyright (c) 2014-2025 Oberizon Construction.{" "}
            <Link href="/privacy-policy" className="transition hover:text-orange-500">
              Privacy
            </Link>
          </p>
          <p>
            Designed by <span className="text-orange-500">HexBytes</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
