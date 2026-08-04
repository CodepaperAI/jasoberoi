import { Plus } from "lucide-react";

/**
 * FAQs as collapsible items.
 *
 * Built on native <details>/<summary> rather than React state, which buys three
 * things a JS accordion would have to re-earn: the answers stay in the DOM while
 * collapsed, so they are still crawled and still match the FAQPage schema
 * emitted by faqJsonLd(); keyboard and screen-reader behaviour is correct for
 * free; and it works before hydration. The same pattern is already used for the
 * mobile navigation in Header.tsx.
 *
 * Everything starts closed. That is the point — the visible page gets shorter,
 * which was the original complaint, without a single word being deleted.
 */
export function FaqAccordion({
  items,
  className = "",
}: {
  items: Array<{ question: string; answer: string }>;
  className?: string;
}) {
  return (
    <div className={["divide-y divide-slate-200 border-y border-slate-200", className].join(" ")}>
      {items.map((faq) => (
        <details key={faq.question} className="faq-item group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left transition hover:text-orange-600">
            <h3 className="text-lg font-bold leading-snug text-zinc-950 group-hover:text-orange-600 sm:text-xl">
              {faq.question}
            </h3>
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-100 transition duration-300 group-open:rotate-45 group-open:bg-orange-600 group-open:text-white"
            >
              <Plus size={17} strokeWidth={2.5} />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-14 text-base font-medium leading-7 text-slate-600">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
