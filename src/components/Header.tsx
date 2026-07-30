import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { navigation } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/[0.72] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="The Oberoi Group home">
          <Image
            src="/assets/images/remax-white-logo.png"
            alt="RE/MAX Performance Realty"
            width={150}
            height={40}
            className="h-7 w-auto"
            priority
          />
          <span className="display-font text-xl font-bold uppercase text-white sm:text-2xl">
            Oberoi Group
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) =>
            item.items ? (
              <div key={item.label} className="group relative py-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-bold uppercase text-white transition hover:text-red-200"
                >
                  {item.label}
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                <div className="invisible absolute left-0 top-full w-56 translate-y-2 rounded-md border border-white/10 bg-black/95 p-2 opacity-0 shadow-2xl shadow-black/60 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded px-3 py-2 text-sm font-semibold uppercase text-white/[0.82] transition hover:bg-red-600 hover:text-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href ?? "/"}
                className="text-sm font-bold uppercase text-white transition hover:text-red-200"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/contact" tone="outline" className="min-h-9 px-4 py-2 text-xs">
            Make The Move
          </ButtonLink>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded border border-white/25 text-white">
            <span className="sr-only">Open navigation</span>
            <Menu aria-hidden="true" size={20} />
          </summary>
          <div className="absolute right-0 top-12 w-72 rounded-md border border-white/10 bg-black/[0.96] p-3 shadow-2xl">
            {navigation.map((item) =>
              item.items ? (
                <div key={item.label} className="border-b border-white/10 py-2 last:border-b-0">
                  <p className="px-2 pb-1 text-xs font-bold uppercase text-white/[0.55]">{item.label}</p>
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded px-2 py-2 text-base font-semibold uppercase text-white hover:bg-red-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href ?? "/"}
                  className="block rounded px-2 py-2 text-base font-semibold uppercase text-white hover:bg-red-600"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
