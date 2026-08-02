import { Leaf, HardHat, Radio } from "lucide-react";
import { WHY_SOLAR } from "../data/content";

const ICONS = { leaf: Leaf, hardhat: HardHat, grid: Radio };

export default function WhySolar() {
  return (
    <section id="why-solar" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl leading-snug text-navy sm:text-3xl lg:text-[2.5rem]">
            Stop renting your electricity.
            <br className="hidden sm:block" /> Start owning it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-slate-body sm:text-lg">
            Generating your own power is the smartest upgrade you can make for
            your home and your wallet.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {WHY_SOLAR.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <article
                key={card.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy/5 transition-shadow duration-200 hover:shadow-lift"
              >
                <div className="relative h-48 overflow-hidden bg-cream sm:h-52">
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/95 shadow-card">
                    <Icon className="h-5 w-5 text-navy" aria-hidden="true" />
                  </span>
                </div>

                <div className="p-6 lg:p-7">
                  <h3 className="font-sans text-lg font-bold text-navy">
                    <span aria-hidden="true">{card.emoji}</span> {card.title}
                  </h3>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-slate-body">
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
