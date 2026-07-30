import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  tone?: "red" | "black" | "outline";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  tone = "red",
  className = "",
}: ButtonLinkProps) {
  const toneClass =
    tone === "red"
      ? "amber-button text-stone-950"
      : tone === "black"
        ? "black-button text-white"
        : "border border-amber-300/50 bg-stone-950/25 text-white";

  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300/70",
        toneClass,
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.4} />
    </Link>
  );
}
