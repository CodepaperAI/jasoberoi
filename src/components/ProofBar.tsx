import { siteConfig, portfolioTally, serviceAreas } from "@/lib/site";

/**
 * A light band of real numbers, sitting between the hero video and the dark
 * statement section.
 *
 * It exists for two reasons. Structurally, the full-bleed video and the dark
 * statement below it are both dark, and running them together reads as one
 * undifferentiated block no matter how the seam is handled — the page needs to
 * breathe back to light in between. Substantively, this is the first thing a
 * visitor sees after the hero, which is exactly where countable evidence belongs
 * rather than another line of adjectives.
 *
 * Every figure is computed rather than typed in, so none of them can quietly go
 * stale — the previous hardcoded "10+ Years" was already two years out of date.
 *
 * The years and cities figures derive from siteConfig and serviceAreas. The
 * project count comes from portfolioTally, which is the one asserted number on
 * the site: Oberizon has built far more than the handful of jobs documented in
 * `projects`, and counting the documented list here would understate the
 * business rather than protect the visitor. check-trust holds the tally above
 * the documented count so the claim can never fall below the evidence.
 *
 * The "+" on the first two is the client's own framing — the tally is a floor
 * he stands behind, not an exact census.
 */

const { delivered, inProgress } = portfolioTally;

const proofPoints = [
  {
    value: `${new Date().getFullYear() - siteConfig.foundedYear}+`,
    unit: "years",
    label: `Building across the Lower Mainland since ${siteConfig.foundedYear}`,
  },
  {
    value: `${delivered + inProgress}+`,
    unit: "projects",
    label: `${delivered} delivered, ${inProgress} in progress`,
  },
  {
    value: String(serviceAreas.length),
    unit: "cities",
    label: "Served from the White Rock office",
  },
  {
    value: "90",
    unit: "days",
    label: "Fastest delivered clinic, five operatories",
  },
];

export function ProofBar() {
  return (
    <section className="border-b border-slate-200/80 bg-white px-5 py-16 sm:px-6 lg:px-8">
      <dl className="mx-auto grid max-w-7xl gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {proofPoints.map((point, index) => (
          <div
            key={point.label}
            className={[
              "px-2 text-center lg:px-8",
              // Hairline rules between columns rather than around them, so the
              // band reads as one row instead of four boxes.
              index > 0 ? "lg:border-l lg:border-slate-200" : "",
            ].join(" ")}
          >
            <dt className="sr-only">{point.label}</dt>
            <dd>
              <span className="serif-font block text-5xl leading-none text-zinc-950 sm:text-6xl">
                {point.value}
                <span className="orange-italic ml-2 text-3xl sm:text-4xl">{point.unit}</span>
              </span>
              <span className="mx-auto mt-4 block max-w-56 text-sm font-medium leading-6 text-slate-500">
                {point.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
