import { BookConsultationButton } from "@/components/BookConsultationButton";

/**
 * The header's book CTA.
 *
 * This used to branch on the pathname: a link to /contact everywhere, and the
 * dock-opening button only on /contact itself, where linking would have been a
 * self-link. That branch is gone because the answer is now the same everywhere
 * — every "Book a Consultation" on the site opens the form in place.
 *
 * The reason is the paid funnel. The Google Ads campaign lands on
 * /services/dental-clinic-construction/, and every CTA on that page used to
 * navigate to /contact, where the visitor found no form on the page and had to
 * press a second button to reach one. Two clicks and a page load between the ad
 * and the first field. /contact is still reachable from the nav and the footer.
 *
 * No longer a client component: it renders one, which is enough.
 */
export function HeaderBookButton({ className = "" }: { className?: string }) {
  return <BookConsultationButton className={className} />;
}
