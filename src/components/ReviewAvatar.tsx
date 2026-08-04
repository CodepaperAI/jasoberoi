import type { Review } from "@/lib/site";

/**
 * The initial of a reviewer, in an orange tile.
 *
 * Deliberately a monogram rather than a photograph. Oberizon has no headshots of
 * these clients, and putting stock faces against real named testimonials would
 * invent people — the exact class of claim scripts/check-trust.mjs exists to
 * stop. If real photographs ever arrive, this is the component to give an
 * `image` prop; until then a monogram is the honest version.
 *
 * "Dr." is stripped first, so Dr. Kanwar reads K rather than D.
 */
export function ReviewAvatar({
  author,
  size = "md",
}: {
  author: Review["author"];
  size?: "sm" | "md";
}) {
  const initial = author.replace(/^(Dr|Mr|Mrs|Ms)\.?\s*/i, "").trim().charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center rounded-2xl bg-orange-600 font-bold text-white",
        size === "sm" ? "h-11 w-11 text-base" : "h-14 w-14 text-lg",
      ].join(" ")}
    >
      {initial}
    </span>
  );
}
