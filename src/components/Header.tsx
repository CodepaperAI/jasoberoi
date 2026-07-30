import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { navigation } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-stone-950/82 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Oberizon Construction home">
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            width={220}
            height={74}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) =>
            item.items ? (
              <div key={item.label} className="group relative py-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-extrabold uppercase tracking-[0.16em] text-white/85 transition hover:text-amber-300"
                >
                  {item.label}
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                <div className="invisible absolute left-0 top-full w-72 translate-y-2 rounded-sm border border-amber-400/20 bg-stone-950/98 p-2 opacity-0 shadow-2xl shadow-black/60 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-sm px-3 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/75 transition hover:bg-amber-500 hover:text-stone-950"
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
                className="text-sm font-extrabold uppercase tracking-[0.16em] text-white/85 transition hover:text-amber-300"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/contact" className="min-h-10 px-4 py-2 text-xs">
            Schedule Consultation
          </ButtonLink>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-sm border border-white/25 text-white">
            <span className="sr-only">Open navigation</span>
            <Menu aria-hidden="true" size={21} />
          </summary>
          <div className="absolute right-0 top-14 w-80 rounded-sm border border-white/10 bg-stone-950/[0.98] p-3 shadow-2xl">
            {navigation.map((item) =>
              item.items ? (
                <div key={item.label} className="border-b border-white/10 py-2 last:border-b-0">
                  <p className="px-2 pb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
                    {item.label}
                  </p>
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-sm px-2 py-2 text-base font-bold uppercase text-white hover:bg-amber-500 hover:text-stone-950"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href ?? "/"}
                  className="block rounded-sm px-2 py-2 text-base font-bold uppercase text-white hover:bg-amber-500 hover:text-stone-950"
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
