/**
 * Sun-over-roofline mark, drawn inline so it inherits currentColor and never
 * flashes on load. Swap for <img src="/assets/logo.svg" /> if you export the
 * Figma mark — the sizing classes below already match.
 */
export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 32"
        className={compact ? "h-7 w-9" : "h-8 w-10"}
        role="img"
        aria-label="SolarOps PH"
        fill="none"
      >
        {/* sun */}
        <circle cx="29" cy="9" r="5" className="fill-solar" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="29"
            y1="9"
            x2="29"
            y2="1.5"
            className="stroke-solar"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${deg} 29 9)`}
          />
        ))}
        {/* roofline */}
        <path
          d="M2 22 L13 11 L21 19 L29 12 L38 22"
          className="stroke-navy"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2 22 L2 29 M38 22 L38 29" className="stroke-navy" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-sans text-lg font-extrabold tracking-tight text-solar drop-shadow-[0_1px_0_rgba(16,38,112,0.35)]">
          SolarOps<span className="text-navy"> PH</span>
        </span>
        {!compact && (
          <span className="mt-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-navy/70">
            Solar Estimator
          </span>
        )}
      </span>
    </span>
  );
}
