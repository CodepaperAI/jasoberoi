import Link from "next/link";

export default function NotFound() {
  return (
    <section className="industrial-surface min-h-[70svh] px-5 pt-32">
      <div className="mx-auto max-w-4xl py-20 text-center">
        <p className="ui-font text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">404</p>
        <h1 className="display-font mt-3 text-5xl uppercase text-white sm:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl font-medium leading-8 text-white/[0.72]">
          This page is not part of the current construction plan. Head back to the main site or book a consultation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="ui-font amber-button rounded-sm px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-stone-950" href="/">
            Home
          </Link>
          <Link
            className="ui-font rounded-sm border border-white/30 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
