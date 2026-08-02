import { formatRuntime, formatWatts } from "../lib/estimate";

/**
 * Per-appliance runtime off a full battery bank. Only rendered once the user
 * has both calculated and picked priority appliances on a battery system.
 */
export default function BackupCoverage({ result }) {
  const battery = result?.battery;
  if (!battery?.rows?.length) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="font-display text-xl leading-snug text-navy sm:text-2xl lg:text-3xl">
            Your backup coverage
          </h2>
          <p className="mt-4 font-body text-base text-slate-body">
            During a brownout, this system runs:
          </p>
        </header>

        <div className="mt-8 overflow-hidden rounded-xl ring-1 ring-navy/10">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Estimated runtime per appliance on a full battery bank
            </caption>
            <thead>
              <tr className="bg-cream">
                <th
                  scope="col"
                  className="px-4 py-3.5 font-sans text-sm font-bold text-navy sm:px-6"
                >
                  Appliance
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right font-sans text-sm font-bold text-navy sm:px-4"
                >
                  Power draw
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-right font-sans text-sm font-bold text-navy sm:px-6"
                >
                  Runtime on battery
                </th>
              </tr>
            </thead>

            <tbody>
              {battery.rows.map((row) => (
                <tr key={row.id} className="border-t border-navy/5">
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-body text-sm font-normal text-navy sm:px-6"
                  >
                    {row.qty > 1 && `${row.qty}× `}
                    {row.name}
                  </th>
                  <td className="px-3 py-3 text-right font-body text-sm text-slate-body sm:px-4">
                    {formatWatts(row.runningW)}
                  </td>
                  <td className="px-4 py-3 text-right font-body text-sm text-slate-body sm:px-6">
                    {formatRuntime(row.hoursAlone)}
                  </td>
                </tr>
              ))}

              <tr className="border-t-2 border-navy/15 bg-cream/60">
                <th
                  scope="row"
                  className="px-4 py-3.5 text-left font-sans text-sm font-bold text-navy sm:px-6"
                >
                  All at once
                </th>
                <td className="px-3 py-3.5 text-right font-sans text-sm font-bold text-navy sm:px-4">
                  {formatWatts(result.loads.totalRunningW)}
                </td>
                <td className="px-4 py-3.5 text-right font-sans text-sm font-bold text-navy sm:px-6">
                  {formatRuntime(battery.allAtOnceHours)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl bg-cream px-5 py-4">
          <p className="font-sans text-sm font-bold text-navy">Note</p>
          <p className="mt-2 font-body text-sm leading-relaxed text-slate-body">
            These run times assume every selected appliance runs continuously at
            full power. In practice most modern appliances cycle on and off or
            throttle their draw, so real battery life is usually longer. The
            figures already account for inverter efficiency and a safe discharge
            limit that protects the battery.
          </p>
          {result.loads && (
            <p className="mt-3 font-body text-sm leading-relaxed text-slate-body">
              Your inverter needs to handle{" "}
              <span className="font-sans font-bold text-navy">
                {formatWatts(result.loads.peakSurgeW)}
              </span>{" "}
              of startup surge — that's the running load plus the largest motor
              kicking in.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
