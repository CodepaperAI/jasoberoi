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
      ? "amber-button text-white"
      : tone === "black"
        ? "black-button text-white"
        : "border border-white/70 bg-transparent text-white";

  return (
    <Link
      href={href}
      className={[
        "ui-font inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-orange-400/70",
        toneClass,
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.4} />
    </Link>
  );
}
