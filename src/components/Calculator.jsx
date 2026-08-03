import { useState } from "react";
import { ChevronDown, PlugZap, BatteryFull, Home } from "lucide-react";
import { SYSTEM_TYPES, RATE_SOURCE } from "../data/content";
import { providersByRegion, findProvider } from "../data/providers";
import { estimate } from "../lib/estimate";
import ResultsCard from "./ResultsCard";
import ApplianceSelector from "./ApplianceSelector";
import BackupCoverage from "./BackupCoverage";

const SYSTEM_ICONS = {
  "grid-tied": PlugZap,
  hybrid: BatteryFull,
  "off-grid": Home,
};

export default function Calculator() {
  const [bill, setBill] = useState("");
  const [provider, setProvider] = useState("meralco");
  const [systemType, setSystemType] = useState("hybrid");
  const [appliances, setAppliances] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const regions = providersByRegion();
  const selectedUtility = findProvider(provider);

  function handleCalculate() {
    const next = estimate({ bill, provider, systemType, appliances });
    if (!next) {
      setError("Enter your monthly bill to run the estimate.");
      setResult(null);
      return;
    }
    setError("");
    setResult(next);
  }

  // Changing an input clears stale numbers rather than leaving old results
  // sitting beside new inputs.
  function onChange(setter) {
    return (value) => {
      setter(value);
      if (result) setResult(null);
    };
  }

  const setBillValue = onChange(setBill);
  const setProviderValue = onChange(setProvider);
  const setSystemValue = onChange(setSystemType);
  const setAppliancesValue = onChange(setAppliances);

  return (
    <>
      <section id="calculator" className="bg-mist py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-2xl">
            <h2 className="font-display text-2xl leading-snug text-navy sm:text-3xl lg:text-4xl">
              Solar Calculator
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-slate-body sm:text-lg">
              Answer a few questions. Get a system size, a cost range, and a
              payback period.
            </p>
            <p className="mt-1 font-sans text-sm font-semibold text-navy/60">
              Free, no sign-up.
            </p>
          </header>

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* ----------------------------------------------------- form */}
            <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
              <p className="rounded-lg bg-cream py-2.5 text-center font-sans text-base font-bold text-navy">
                Calculator
              </p>

              <div className="mt-7 space-y-7">
                {/* Bill */}
                <div>
                  <label
                    htmlFor="bill"
                    className="block font-sans text-sm font-bold text-navy"
                  >
                    How much is your monthly electric bill?
                  </label>
                  <div className="relative mt-2.5">
                    <span
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-base font-semibold text-navy/50"
                      aria-hidden="true"
                    >
                      ₱
                    </span>
                    <input
                      id="bill"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="100"
                      value={bill}
                      onChange={(e) => setBillValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                      placeholder="e.g. 1,500"
                      aria-describedby={error ? "bill-error" : undefined}
                      aria-invalid={Boolean(error)}
                      className="w-full rounded-xl border border-navy/15 bg-white py-3.5 pl-9 pr-4 font-body text-base text-navy placeholder:text-slate-body/50 focus:border-solar focus:outline-none focus:ring-2 focus:ring-solar/40"
                    />
                  </div>
                  {error && (
                    <p
                      id="bill-error"
                      role="alert"
                      className="mt-2 font-body text-sm text-red-600"
                    >
                      {error}
                    </p>
                  )}
                </div>

                {/* Provider */}
                <div>
                  <label
                    htmlFor="provider"
                    className="block font-sans text-sm font-bold text-navy"
                  >
                    Who's your electric provider?
                  </label>
                  <div className="relative mt-2.5">
                    <select
                      id="provider"
                      value={provider}
                      onChange={(e) => setProviderValue(e.target.value)}
                      aria-describedby="provider-rate"
                      className="w-full appearance-none rounded-xl border border-navy/15 bg-white py-3.5 pl-4 pr-11 font-body text-base text-navy focus:border-solar focus:outline-none focus:ring-2 focus:ring-solar/40"
                    >
                      {regions.map((group) => (
                        <optgroup key={group.region} label={group.region}>
                          {group.items.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.acronym} — ₱{p.rate.toFixed(2)}/kWh
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50"
                      aria-hidden="true"
                    />
                  </div>
                  <p
                    id="provider-rate"
                    className="mt-2 font-body text-xs leading-relaxed text-slate-body"
                  >
                    {selectedUtility.name} ·{" "}
                    {selectedUtility.estimated ? (
                      <>
                        national average of ₱
                        {selectedUtility.rate.toFixed(2)}/kWh. Rates vary a lot
                        by utility — pick yours if it's listed.
                      </>
                    ) : (
                      <>
                        ₱{selectedUtility.rate.toFixed(2)}/kWh, verified{" "}
                        {selectedUtility.verifiedAt}. Rates change monthly.
                      </>
                    )}
                  </p>
                </div>

                {/* System type */}
                <fieldset>
                  <legend className="font-sans text-sm font-bold text-navy">
                    System types
                  </legend>
                  <p className="mt-1 font-body text-sm text-slate-body">
                    How do you want to power your home?
                  </p>

                  <div
                    role="radiogroup"
                    aria-label="System types"
                    className="mt-3.5 grid gap-3 sm:grid-cols-3"
                  >
                    {SYSTEM_TYPES.map((type) => {
                      const Icon = SYSTEM_ICONS[type.value];
                      const selected = systemType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setSystemValue(type.value)}
                          className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            selected
                              ? "border-solar bg-solar/10 shadow-card"
                              : "border-navy/10 bg-white hover:border-navy/25"
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span className="font-sans text-sm font-bold text-navy">
                              {type.label}
                            </span>
                            <Icon
                              className={`h-4 w-4 ${
                                selected ? "text-navy" : "text-navy/40"
                              }`}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="mt-1.5 block font-body text-xs leading-relaxed text-slate-body">
                            {type.blurb}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Priority appliances */}
                {systemType === "grid-tied" ? (
                  <p className="rounded-xl bg-cream px-4 py-3.5 font-body text-sm leading-relaxed text-slate-body">
                    Grid-tied systems have no battery, so there's nothing to
                    keep running during a brownout. Switch to hybrid or off-grid
                    to pick your priority appliances.
                  </p>
                ) : (
                  <ApplianceSelector
                    value={appliances}
                    onChange={setAppliancesValue}
                  />
                )}

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full rounded-xl bg-navy-deep px-6 py-4 font-sans text-base font-bold text-white transition-colors duration-200 hover:bg-navy"
                >
                  Calculate
                </button>

                <p className="text-center font-body text-xs text-slate-body">
                  Rates from{" "}
                  <a
                    href={RATE_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded underline decoration-navy/30 underline-offset-2 hover:text-navy"
                  >
                    {RATE_SOURCE.label}
                  </a>
                  . {RATE_SOURCE.utilitiesTracked} of{" "}
                  {RATE_SOURCE.utilitiesNationwide} utilities have a published
                  rate.
                </p>
              </div>
            </div>

            {/* -------------------------------------------------- results */}
            <ResultsCard result={result} />
          </div>
        </div>
      </section>

      <BackupCoverage result={result} />
    </>
  );
}
