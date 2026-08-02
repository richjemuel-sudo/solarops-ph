import { ArrowRight } from "lucide-react";
import { STEPS } from "../data/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-snug text-navy sm:text-4xl">
            How It Works?
          </h2>
          <p className="mt-4 font-body text-base text-slate-body sm:text-lg">
            From your electric bill to a real system size — in about a minute.
          </p>
        </header>

        {/* The numbering is load-bearing here: these steps happen in order. */}
        <ol className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="rounded-2xl bg-white p-7 shadow-card transition-shadow duration-200 hover:shadow-lift lg:p-8"
            >
              <div className="flex items-center gap-2 font-sans text-sm font-extrabold uppercase tracking-widest text-navy">
                Step {step.number}
                <ArrowRight className="h-4 w-4 text-solar" aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-sans text-lg font-bold text-navy">
                {step.title}
              </h3>

              <p className="mt-3 font-body text-[15px] leading-relaxed text-slate-body">
                {step.body}
              </p>

              {step.bullets && (
                <ul className="mt-4 space-y-3">
                  {step.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 font-body text-[15px] leading-relaxed text-slate-body"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-solar"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
