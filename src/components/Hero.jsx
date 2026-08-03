import { Zap } from "lucide-react";

/**
 * Hero with a looping sky cycle — dawn, day, dusk, night — layered over the
 * photo. Everything is CSS; see the "Hero sky cycle" block in index.css.
 *
 * Layering is done with DOM order, deliberately, not z-index. `mix-blend-mode`
 * blends an element against its nearest stacking context, so wrapping these
 * layers in a positioned z-indexed div would make them blend against that
 * wrapper (transparent) instead of against the photo — the tint would simply
 * do nothing. Each layer is therefore a direct sibling of the image, and only
 * the text block gets a z-index.
 *
 * `isolate` on the section keeps the blending contained to the hero.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="sky-cycle relative isolate flex min-h-[560px] items-center overflow-hidden lg:min-h-[640px]"
      style={{ "--sky-duration": "60s" }}
    >
      {/* Background photo. Drop your Figma render at public/assets/hero-house.jpg */}
      <img
        src="/assets/hero-house.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Sky cycle — decorative, hidden from assistive tech. */}
      <div className="sky-phase sky-dawn pointer-events-none" aria-hidden="true" />
      <div className="sky-phase sky-day pointer-events-none" aria-hidden="true" />
      <div className="sky-phase sky-dusk pointer-events-none" aria-hidden="true" />
      <div className="sky-phase sky-night pointer-events-none" aria-hidden="true" />
      <div className="sky-darken pointer-events-none" aria-hidden="true" />
      <div className="sky-sun pointer-events-none" aria-hidden="true" />
      <div className="sky-stars pointer-events-none" aria-hidden="true" />

      {/* Left-weighted scrim keeps the headline legible at every point in the
          cycle, including bright midday. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-navy-deep/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="font-display text-4xl leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            SolarOps PH
          </h1>

          <p className="mt-5 font-display text-lg uppercase leading-relaxed tracking-wide text-solar drop-shadow sm:text-xl lg:text-2xl">
            Built for Philippine homes &amp; businesses
          </p>

          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-white/90 drop-shadow sm:text-lg">
            Electricity rates keep climbing. Find out how much solar could save
            you — in about a minute.
          </p>

          <a
            href="#calculator"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-solar px-8 py-4 font-sans text-base font-bold text-navy-deep shadow-lift transition-transform duration-200 hover:-translate-y-0.5 hover:bg-solar/90"
          >
            <Zap className="h-5 w-5 fill-navy-deep" aria-hidden="true" />
            Try the free calculator
          </a>
        </div>
      </div>
    </section>
  );
}
