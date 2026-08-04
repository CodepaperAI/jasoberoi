import Link from "next/link";
import {
  Activity,
  Building2,
  ClipboardCheck,
  HardHat,
  Home,
  Pill,
  Workflow,
} from "lucide-react";
import { constructionServices } from "@/lib/site";

/**
 * The expertise hub: six services radiating from a single centre.
 *
 * Healthcare sits on the left in orange because it is the specialism, commercial
 * on the right in blue because it is the volume. The centre is what actually
 * connects them — one managed process — rather than a label.
 *
 * Copy comes from `constructionServices` rather than being written twice, and
 * every card links to its service page, so the section doubles as internal
 * linking instead of being decoration.
 */

type Spoke = {
  slug: string;
  label: string;
  icon: typeof Activity;
};

const LEFT: Spoke[] = [
  { slug: "dental-clinic-construction", label: "Dental Clinic Construction", icon: Activity },
  { slug: "dental-office-renovation", label: "Dental Office Renovation", icon: ClipboardCheck },
  { slug: "pharmacy-construction", label: "Pharmacy Construction", icon: Pill },
];

const RIGHT: Spoke[] = [
  { slug: "commercial-construction", label: "Commercial Construction", icon: HardHat },
  { slug: "commercial-renovation", label: "Commercial Renovation", icon: Building2 },
  { slug: "luxury-residential-construction", label: "Luxury Residential", icon: Home },
];

function summaryFor(slug: string) {
  return constructionServices.find((service) => service.slug === slug)?.summary ?? "";
}

/**
 * A dashed connector running from a card to the hub.
 *
 * `preserveAspectRatio="none"` lets the curve stretch to whatever gap the
 * viewport leaves, and `vector-effect="non-scaling-stroke"` keeps the stroke
 * weight and dash rhythm constant while it does — without it, the dashes smear
 * as the gap widens.
 */
function Connector({ side, bend }: { side: "left" | "right"; bend: -1 | 0 | 1 }) {
  const isLeft = side === "left";
  // Leaves the card at its own vertical centre; the hub end dips toward the
  // centre for the top row and lifts for the bottom row, so all six appear to
  // converge on the circle. Larger y is lower on screen, hence the negated bend.
  const from = { x: isLeft ? 0 : 100, y: 50 };
  const to = { x: isLeft ? 100 : 0, y: 50 - bend * 34 };
  const stroke = isLeft ? "var(--oberizon-orange)" : "#2f5fd6";

  return (
    // Fixed width rather than flex-1: the cards absorb the slack instead, so
    // every connector is the same length and the six dots land on a circle
    // around the hub rather than at six different distances.
    <div className="pointer-events-none relative hidden h-24 w-28 shrink-0 lg:block" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={`M ${from.x} ${from.y} C ${isLeft ? 55 : 45} ${from.y}, ${isLeft ? 45 : 55} ${to.y}, ${to.x} ${to.y}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.4"
          strokeDasharray="4 5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.75"
        />
      </svg>
      {/*
        The dot lives outside the SVG. `preserveAspectRatio="none"` stretches the
        viewBox horizontally, which turns a <circle> into an ellipse — fine for a
        gentle curve, wrong for a dot.
      */}
      <span
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
        style={{
          left: `${to.x}%`,
          top: `${to.y}%`,
          borderColor: stroke,
        }}
      />
    </div>
  );
}

function SpokeCard({ spoke, side }: { spoke: Spoke; side: "left" | "right" }) {
  const isLeft = side === "left";
  const Icon = spoke.icon;

  return (
    <Link
      href={`/construction/white-rock/${spoke.slug}`}
      className={[
        "group relative flex min-w-0 flex-1 items-start gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg hover:ring-slate-300",
        isLeft ? "flex-row" : "flex-row-reverse text-right",
      ].join(" ")}
    >
      {/* The accent sits on the outer edge, so the pair frames the hub. */}
      <span
        aria-hidden="true"
        className={[
          "absolute inset-y-3 w-1 rounded-full",
          isLeft ? "left-0 bg-orange-500" : "right-0 bg-blue-600",
        ].join(" ")}
      />
      <span
        aria-hidden="true"
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
          isLeft
            ? "bg-orange-50 text-orange-600 ring-orange-100"
            : "bg-blue-50 text-blue-600 ring-blue-100",
        ].join(" ")}
      >
        <Icon size={21} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-extrabold uppercase tracking-[0.06em] text-zinc-950">
          {spoke.label}
        </span>
        <span className="mt-1.5 block text-sm leading-6 text-slate-600">
          {summaryFor(spoke.slug)}
        </span>
      </span>
    </Link>
  );
}

export function ExpertiseHub() {
  return (
    <section className="corner-dots relative overflow-hidden bg-[#f8faff] px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
          Our Expertise
        </p>
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
          Six services, <span className="orange-italic">one managed process.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
          Healthcare is the specialism. Commercial is the volume. Both run through the same team,
          from first review to handover.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-4">
        {/* Healthcare — the specialism. */}
        <div className="flex flex-col gap-6">
          {LEFT.map((spoke, index) => (
            <div key={spoke.slug} className="flex items-center">
              <SpokeCard spoke={spoke} side="left" />
              <Connector side="left" bend={(index - 1) as -1 | 0 | 1} />
            </div>
          ))}
        </div>

        <div className="order-first flex justify-center lg:order-none">
          <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-center text-white shadow-[0_0_0_14px_rgba(255,79,10,0.12),0_24px_60px_-18px_rgba(255,79,10,0.55)] sm:h-72 sm:w-72">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20"
            >
              <Workflow size={26} />
            </span>
            <p className="mt-4 px-6 text-2xl font-bold leading-tight">One Managed Process</p>
            <p className="mt-2 px-8 text-sm leading-6 text-white/85">
              Planning, permits, trades, inspections, handover — one team.
            </p>
          </div>
        </div>

        {/* Commercial and residential — the volume. */}
        <div className="flex flex-col gap-6">
          {RIGHT.map((spoke, index) => (
            <div key={spoke.slug} className="flex items-center">
              <Connector side="right" bend={(index - 1) as -1 | 0 | 1} />
              <SpokeCard spoke={spoke} side="right" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
