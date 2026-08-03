import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  peso,
  pesoShort,
  formatRuntime,
  formatArraySize,
  pluralize,
} from "../lib/estimate";

const EMPTY = "—";

function Tile({ label, value, note, empty, wide = false }) {
  return (
    <div
      className={`rounded-xl bg-glass p-5 ring-1 ring-white/10 backdrop-blur-glass ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <p className="font-body text-xs text-white/70">{label}</p>
      <p
        className={`mt-2 font-sans font-extrabold leading-snug ${
          wide ? "text-center text-base sm:text-lg" : "text-lg"
        } ${empty ? "text-white/35" : "text-solar"}`}
      >
        {value}
      </p>
      {note && !empty && (
        <p
          className={`mt-2 font-body text-[11px] leading-relaxed text-white/60 ${
            wide ? "text-center" : ""
          }`}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export default function ResultsCard({ result }) {
  const empty = !result;
  const battery = result?.battery;
  const [building, setBuilding] = useState(false);
  const [pdfError, setPdfError] = useState("");

  // jsPDF is ~350 KB — load it only when someone actually wants the PDF,
  // so it never lands in the initial bundle.
  async function handleDownload() {
    setPdfError("");
    setBuilding(true);
    try {
      const { generateBlueprint } = await import("../lib/blueprint");
      await generateBlueprint(result);
    } catch (err) {
      console.error("Blueprint generation failed:", err);
      setPdfError("Couldn't build the PDF. Please try again.");
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-navy-deep p-6 shadow-lift sm:p-8">
      <header>
        <h3 className="font-display text-xl leading-snug text-white sm:text-2xl">
          Estimated Results
        </h3>
        <p className="mt-2 font-body text-sm text-mint">
          Customized based on your monthly bill &amp; appliance needs.
        </p>
      </header>

      {/* Bill comparison — the headline number */}
      <div className="mt-7 text-center">
        <h4 className="font-display text-base text-white sm:text-lg">
          Bill Comparison
        </h4>

        {empty ? (
          <p className="mt-3 font-body text-sm text-white/40">
            Enter your monthly bill to see your savings — {EMPTY}
          </p>
        ) : (
          <>
            <p className="mt-3 font-sans text-sm font-bold text-mint">
              You save {peso(result.monthlySavings)} every month
            </p>
            <p className="mt-1 font-sans text-sm font-semibold text-mint">
              <span className="text-white/50 line-through decoration-white/40">
                {peso(result.billAmount)}
              </span>{" "}
              now → {result.offGrid ? "no utility bill" : peso(result.newBill)}
            </p>
            {result.offGrid && (
              <p className="mt-1 font-body text-[11px] text-white/60">
                Off-grid means disconnecting from {result.utility.acronym}{" "}
                entirely — there's no bill left to pay.
              </p>
            )}
            <p className="mt-2 font-body text-[11px] text-white/50">
              Based on {result.utility.acronym}
              {result.utility.estimated
                ? " (national average)"
                : ` at ₱${result.utility.rate.toFixed(2)}/kWh`}
              , verified {result.utility.verifiedAt}.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Tile
          label="Recommended system size"
          empty={empty}
          value={
            empty
              ? EMPTY
              : `${formatArraySize(result.kwp)} ${result.system.label} system`
          }
          note={
            result &&
            `${pluralize(result.panel.count, "panel")} × ${
              result.panel.watts
            } W · ${result.inverter.ratedKw} kW ${
              result.offGrid ? "off-grid" : result.system.value
            } inverter · roughly ${Math.ceil(result.roofArea)} sqm of roof.`
          }
        />

        <Tile
          label="Estimated monthly savings"
          empty={empty}
          value={empty ? EMPTY : `${peso(result.monthlySavings)} / month`}
          note={
            result &&
            (result.offGrid
              ? "Your entire bill, since you're no longer buying power."
              : `Covers about ${Math.round(
                  result.system.offset * 100
                )}% of your usage. Grows as rates rise.`)
          }
        />

        <Tile
          label="Installation cost"
          empty={empty}
          value={
            empty
              ? EMPTY
              : `${pesoShort(result.costLow)} – ${pesoShort(result.costHigh)}`
          }
          note={
            result &&
            (battery
              ? "Includes panels, hybrid inverter, battery, mounting, wiring and labor."
              : "Includes panels, inverter, mounting, wiring and labor.")
          }
        />

        <Tile
          label="Payback period"
          empty={empty}
          value={empty ? EMPTY : `${result.paybackYears.toFixed(1)} years`}
          note={
            result &&
            "After that, the system runs another 15+ years at near-zero cost."
          }
        />

        <Tile
          wide
          label="Battery bank"
          empty={empty}
          value={
            empty
              ? EMPTY
              : battery
              ? `~${formatRuntime(battery.typicalHours)} running your selected appliances`
              : "Not included with grid-tied"
          }
          note={
            result &&
            (battery
              ? `${battery.nominalKwh.toFixed(2)} kWh · ${battery.spec}. ${
                  battery.undersized
                    ? "This load exceeds a standard residential bank — it needs a custom multi-bank design."
                    : battery.allAtOnceHours
                    ? `Drops to about ${formatRuntime(
                        battery.allAtOnceHours
                      )} if everything runs at once.`
                    : "Add your priority appliances for a runtime breakdown."
                }`
              : "Grid-tied systems shut off during a brownout, by design. Switch to hybrid for backup.")
          }
        />
      </div>

      <div className="mt-auto pt-7">
        <button
          type="button"
          onClick={handleDownload}
          disabled={empty || building}
          aria-busy={building}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-solar px-6 py-4 font-sans text-base font-bold text-navy-deep transition-all duration-200 hover:bg-solar/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
        >
          {building ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Building your PDF...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" aria-hidden="true" />
              Get full solar blueprint
            </>
          )}
        </button>

        <p aria-live="polite" className="mt-3 text-center font-body text-xs">
          {pdfError ? (
            <span className="text-red-300">{pdfError}</span>
          ) : (
            <span className="text-white/50">
              Downloads as a PDF. Estimates only — a site survey confirms the
              final design.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
