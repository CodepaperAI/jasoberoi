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
      ? "red-button text-white"
      : tone === "black"
        ? "black-button text-white"
        : "border border-white/50 bg-black/25 text-white";

  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold uppercase transition duration-300 hover:-translate-y-0.5 hover:border-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/70",
        toneClass,
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.4} />
    </Link>
  );
}
