import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Review } from "@/lib/site";

/**
 * A reviewer's avatar.
 *
 * Three states, in order of preference:
 *
 *   1. `review.image` — a real headshot, once the client supplies one.
 *   2. A person glyph, which is what renders today.
 *   3. Never a stock face. These are three real named people, and attaching a
 *      stranger's photograph to a named testimonial invents a person — the exact
 *      class of claim scripts/check-trust.mjs exists to prevent. A generic
 *      silhouette impersonates nobody; a stock portrait impersonates someone.
 *
 * The initial is kept as a small badge on the corner, so the avatar still ties
 * to the name beside it rather than reading as a blank unknown user.
 */
export function ReviewAvatar({
  author,
  image,
  size = "md",
}: {
  author: Review["author"];
  image?: Review["image"];
  size?: "sm" | "md";
}) {
  const initial = author.replace(/^(Dr|Mr|Mrs|Ms)\.?\s*/i, "").trim().charAt(0).toUpperCase();
  const box = size === "sm" ? "h-12 w-12" : "h-14 w-14";

  if (image) {
    return (
      <span className={["relative shrink-0 overflow-hidden rounded-full", box].join(" ")}>
        <Image src={image} alt={author} fill sizes="56px" className="object-cover" />
      </span>
    );
  }

  return (
    <span className={["relative shrink-0", box].join(" ")}>
      <span
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center rounded-full bg-raised text-accent"
      >
        <UserRound size={size === "sm" ? 22 : 26} strokeWidth={1.9} />
      </span>
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-extrabold text-white ring-2 ring-white"
      >
        {initial}
      </span>
    </span>
  );
}
