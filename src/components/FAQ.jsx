import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "../data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="font-display text-2xl uppercase leading-snug text-navy sm:text-3xl lg:text-[2.25rem]">
            Everything you need to know about going solar
          </h2>
          <p className="mt-5 font-body text-base text-slate-body sm:text-lg">
            Your guide to solar energy in the Philippines.
          </p>
        </header>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-navy/5"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-sans text-[15px] font-bold text-navy sm:text-base">
                      {i + 1}. {faq.q}
                    </span>
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-solar/15"
                      aria-hidden="true"
                    >
                      {open ? (
                        <Minus className="h-4 w-4 text-solar" strokeWidth={3} />
                      ) : (
                        <Plus className="h-4 w-4 text-solar" strokeWidth={3} />
                      )}
                    </span>
                  </button>
                </h3>

                {open && (
                  <div
                    id={`faq-panel-${i}`}
                    className="animate-fade-up border-t border-navy/5 px-5 py-5 sm:px-6"
                  >
                    <p className="font-body text-[15px] leading-relaxed text-slate-body">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
