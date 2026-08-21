"use client";

import { usePathname } from "next/navigation";
import { BookConsultationButton } from "@/components/BookConsultationButton";
import { ButtonLink } from "@/components/ButtonLink";

/**
 * The header's book CTA, aware of where it is.
 *
 * The header renders once in the layout, so a plain link to /contact is right
 * on every page except /contact itself — there it was the last remaining
 * self-link after the page's own CTAs were fixed. On /contact this opens the
 * dock's consultation form instead, exactly like the page buttons do.
 *
 * A client component because the decision needs the pathname; the header
 * itself stays server-rendered.
 */
export function HeaderBookButton({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const onContact = pathname === "/contact" || pathname === "/contact/";

  return onContact ? (
    <BookConsultationButton className={className} />
  ) : (
    <ButtonLink href="/contact" className={className}>
      Book a Consultation
    </ButtonLink>
  );
}
