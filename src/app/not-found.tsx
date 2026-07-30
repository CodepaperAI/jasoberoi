import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grain-surface min-h-[70svh] px-5 pt-32">
      <div className="mx-auto max-w-4xl py-20 text-center">
        <p className="text-sm font-bold uppercase text-red-300">404</p>
        <h1 className="display-font mt-3 text-5xl font-bold uppercase text-white sm:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl font-medium leading-8 text-white/[0.72]">
          This page is off the track. Head back to the main site or contact the team.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="red-button rounded-md px-5 py-3 text-sm font-bold uppercase text-white" href="/">
            Home
          </Link>
          <Link
            className="rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase text-white"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
