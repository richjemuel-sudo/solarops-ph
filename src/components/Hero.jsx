import { Zap } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[560px] items-center overflow-hidden lg:min-h-[640px]"
    >
      {/* Background photo. Drop your Figma render at public/assets/hero-house.jpg */}
      <img
        src="/assets/hero-house.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Left-weighted scrim keeps the headline legible over the roofline. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/85 via-navy-deep/55 to-navy-deep/20"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            SolarOps PH
          </h1>

          <p className="mt-5 font-display text-lg uppercase leading-relaxed tracking-wide text-solar sm:text-xl lg:text-2xl">
            Built for Philippine homes &amp; businesses
          </p>

          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-white/85 sm:text-lg">
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
