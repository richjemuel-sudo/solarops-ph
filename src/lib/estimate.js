import {
  SYSTEM_TYPES,
  PEAK_SUN_HOURS,
  DERATE,
  PANEL_WATTS,
  SQM_PER_KWP,
  PANEL_SPEC,
  INVERTER_SIZES_KW,
  INVERTER_TYPES,
  COST_BREAKDOWN,
} from "../data/content";
import { findProvider } from "../data/providers";
import { findAppliance } from "../data/appliances";

/* ------------------------------------------------------------- formatting */

export const peso = (n, decimals = 0) =>
  `₱${Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

/** Shortens ₱185,400 to ₱185k for the tight metric tiles. */
export const pesoShort = (n) =>
  n >= 1000 ? `₱${Math.round(n / 1000).toLocaleString("en-PH")}k` : peso(n);

/** Runtimes past 40 hours stop being meaningful — cap the label instead. */
export const formatRuntime = (hours) => {
  if (!isFinite(hours) || hours <= 0) return "—";
  if (hours >= 40) return "40+ hrs";
  if (hours >= 10) return `${Math.round(hours)} hrs`;
  return `${hours.toFixed(1)} hrs`;
};

export const formatWatts = (w) =>
  `${Math.round(w).toLocaleString("en-PH")} W`;

/**
 * Array size reads as watts-peak below 1 kWp — "600 Wp", not "0.6 kWp".
 * Nobody in the field says nought-point-six kilowatt-peak.
 */
export const formatArraySize = (kwp) =>
  kwp < 1
    ? `${Math.round(kwp * 1000).toLocaleString("en-PH")} Wp`
    : `${kwp.toFixed(2)} kWp`;

export const pluralize = (n, one, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

/* -------------------------------------------------------------- constants */

// Usable share of a LiFePO4 bank: 90% depth of discharge × 90% inverter
// efficiency. Everything below that is reserve you should not plan to spend.
const DEPTH_OF_DISCHARGE = 0.9;
const INVERTER_EFFICIENCY = 0.9;
const USABLE_FRACTION = DEPTH_OF_DISCHARGE * INVERTER_EFFICIENCY;

// The inverter is sized at twice the array so there is real headroom for motor
// starting surge, not just steady-state capacity.
const INVERTER_ARRAY_HEADROOM = 2;

// Households never run every appliance simultaneously. This is the share of
// combined nameplate load a battery is actually sized to carry.
const DIVERSITY_FACTOR = 0.45;

// Hours of backup each system type is designed to hold.
const BACKUP_TARGET_HOURS = { hybrid: 8, "off-grid": 20 };

// Bank nominal voltage is chosen from inverter capacity, the way it is in the
// field — you don't run 10 kW off a 12 V bank, the DC current would be absurd.
// Values are LiFePO4 nominal (3.2 V/cell × 4, 8, 16), not the "12/24/48 V"
// lead-acid shorthand people still use for them.
const BANK_TIERS = [
  { maxInverterKw: 2.0, voltage: 12.8, label: "12 V" },
  { maxInverterKw: 4.2, voltage: 25.6, label: "24 V" },
  { maxInverterKw: Infinity, voltage: 51.2, label: "48 V" },
];

// Capacities LiFePO4 batteries are actually sold in. Anything larger is built
// by paralleling these, not by ordering a single oversized cell.
const BATTERY_CAPACITIES_AH = [
  50, 100, 120, 150, 200, 230, 250, 280, 300, 314, 324,
];

// Only the larger cells are worth paralleling; stringing eight 50 Ah units is
// more busbar than battery.
const PARALLEL_CAPACITIES_AH = [200, 230, 250, 280, 300, 314, 324];
const MAX_PARALLEL_STRINGS = 4;

/**
 * Picks a real, buyable inverter.
 *
 * The requirement is the largest of three things: twice the array (surge
 * headroom, per field practice), the running load plus 25%, and the running
 * load plus the largest motor's starting surge. Then round UP to a capacity
 * that's actually sold — you can't order a 3.1 kW unit.
 */
export function selectInverter(kwp, loads, systemType) {
  const fromArray = kwp * INVERTER_ARRAY_HEADROOM;
  const fromLoad = loads ? (loads.totalRunningW * 1.25) / 1000 : 0;
  const fromSurge = loads ? loads.peakSurgeW / 1000 : 0;
  const required = Math.max(fromArray, fromLoad, fromSurge);

  const rated =
    INVERTER_SIZES_KW.find((kw) => kw >= required) ??
    INVERTER_SIZES_KW[INVERTER_SIZES_KW.length - 1];

  const type = INVERTER_TYPES[systemType] ?? INVERTER_TYPES["grid-tied"];

  // Which constraint actually set the size — useful in the spec sheet.
  let driver = "array size";
  if (fromSurge >= fromArray && fromSurge >= fromLoad) driver = "motor starting surge";
  else if (fromLoad > fromArray) driver = "connected running load";

  return {
    ratedKw: rated,
    requiredKw: Math.round(required * 100) / 100,
    driver,
    family: type.family,
    note: type.note,
    // A string inverter wants the array within its MPPT window; 1.3x the
    // array is the usual DC input ceiling.
    maxDcInputKwp: Math.round(rated * 1.3 * 100) / 100,
    undersized: required > INVERTER_SIZES_KW[INVERTER_SIZES_KW.length - 1],
  };
}

/**
 * Picks a real, buyable bank: nominal voltage from inverter size, then the
 * smallest standard capacity that meets the requirement — paralleling
 * identical units only once a single battery can't cover it.
 *
 * Steps the voltage up if even a maxed-out parallel bank at the tier voltage
 * wouldn't reach the required energy, which is what an installer would do
 * rather than run enormous DC current at low voltage.
 */
export function selectBank(requiredKwh, inverterKw) {
  const startIndex = BANK_TIERS.findIndex((t) => inverterKw <= t.maxInverterKw);

  for (let i = Math.max(0, startIndex); i < BANK_TIERS.length; i += 1) {
    const tier = BANK_TIERS[i];
    const requiredAh = (requiredKwh * 1000) / tier.voltage;

    // One battery, if a standard size covers it.
    const single = BATTERY_CAPACITIES_AH.find((ah) => ah >= requiredAh);
    if (single) {
      return buildBank(tier, single, 1);
    }

    // Otherwise parallel identical units, fewest strings first.
    for (let strings = 2; strings <= MAX_PARALLEL_STRINGS; strings += 1) {
      const each = PARALLEL_CAPACITIES_AH.find(
        (ah) => ah * strings >= requiredAh
      );
      if (each) return buildBank(tier, each, strings);
    }
    // Nothing at this voltage fits — try the next tier up.
  }

  // Past four paralleled 324 Ah units you're out of residential territory —
  // that's a commercial design with multiple banks and its own switchgear.
  // Return the largest sane bank and say so rather than quietly under-sizing.
  const top = BANK_TIERS[BANK_TIERS.length - 1];
  return { ...buildBank(top, 324, MAX_PARALLEL_STRINGS), undersized: true };
}

function buildBank(tier, unitAh, strings) {
  const totalAh = unitAh * strings;
  return {
    voltage: tier.voltage,
    voltageLabel: tier.label,
    unitAh,
    strings,
    ampHours: totalAh,
    nominalKwh: (tier.voltage * totalAh) / 1000,
    // "51.2 V 200 Ah" or "51.2 V 2 × 300 Ah in parallel"
    spec:
      strings === 1
        ? `${tier.voltage} V ${unitAh} Ah LiFePO4`
        : `${tier.voltage} V ${strings} × ${unitAh} Ah LiFePO4 in parallel`,
  };
}

/* ------------------------------------------------------------ load totals */

/**
 * Turns the user's picked appliances into running watts, surge watts, and
 * daily energy. Returns null when nothing is selected.
 */
export function summarizeLoads(selections = []) {
  const rows = selections
    .map(({ id, qty }) => {
      const a = findAppliance(id);
      if (!a || qty < 1) return null;
      const runningW = a.watts * qty;
      return {
        id: a.id,
        name: a.name,
        qty,
        unitWatts: a.watts,
        runningW,
        surgeW: runningW * a.surge,
        dailyWh: runningW * a.hours * a.duty,
      };
    })
    .filter(Boolean);

  if (rows.length === 0) return null;

  const totalRunningW = rows.reduce((s, r) => s + r.runningW, 0);
  // Only the single largest motor surges at a time, on top of everything else.
  const largestSurgeHeadroom = Math.max(
    ...rows.map((r) => r.surgeW - r.runningW)
  );

  return {
    rows,
    totalRunningW,
    peakSurgeW: totalRunningW + largestSurgeHeadroom,
    dailyWh: rows.reduce((s, r) => s + r.dailyWh, 0),
  };
}

/* --------------------------------------------------------------- estimate */

/**
 * Turns a monthly bill (plus optional appliance priorities) into a system
 * estimate. Returns null when there is nothing to compute yet, so the UI can
 * fall back to its em-dash placeholders.
 *
 * Sizing follows the standard field method:
 *   daily kWh  = (bill ÷ rate) ÷ 30
 *   array kWp  = (daily kWh × target offset) ÷ (peak sun hours × derate)
 */
export function estimate({ bill, provider, systemType, appliances = [] }) {
  const amount = Number(bill);
  if (!amount || amount <= 0) return null;

  const utility = findProvider(provider);
  const system =
    SYSTEM_TYPES.find((s) => s.value === systemType) ?? SYSTEM_TYPES[0];

  const monthlyKwh = amount / utility.rate;
  const dailyKwh = monthlyKwh / 30;

  const kwp = (dailyKwh * system.offset) / (PEAK_SUN_HOURS * DERATE);
  const panels = Math.ceil((kwp * 1000) / PANEL_WATTS);
  const roofArea = kwp * SQM_PER_KWP;

  // Installed cost carries a ±12% spread for equipment tier and roof access.
  const costMid = kwp * system.costPerKwp;
  const costLow = costMid * 0.88;
  const costHigh = costMid * 1.12;

  // Off-grid means disconnecting from the utility entirely — there is no bill
  // left to pay, so the whole amount is saved. Grid-tied and hybrid stay
  // connected, and their exported energy earns generation-cost credits rather
  // than the retail rate, so savings are discounted to ~90% of the offset.
  const offGrid = system.value === "off-grid";
  const monthlySavings = offGrid
    ? amount
    : Math.min(amount * system.offset * 0.9, amount);
  const newBill = offGrid ? 0 : amount - monthlySavings;
  const paybackYears = costMid / (monthlySavings * 12);

  /* ------------------------------------------------------------- loads */

  const loads = summarizeLoads(appliances);

  /* --------------------------------------------------------- inverter */

  // Computed before the battery, because inverter capacity sets bank voltage.
  const inverter = selectInverter(kwp, loads, system.value);
  const inverterKw = inverter.ratedKw;

  /* ---------------------------------------------------------- battery */

  const targetHours = BACKUP_TARGET_HOURS[system.value] ?? 0;
  let battery = null;

  if (targetHours > 0) {
    // With a priority list, size to carry those loads. Without one, fall back
    // to a fraction of whole-house daily consumption.
    const designDrawW = loads
      ? loads.totalRunningW * DIVERSITY_FACTOR
      : (dailyKwh * 1000 * system.fallbackAutonomyDays) / targetHours;

    const priorityKwh = (designDrawW * targetHours) / 1000 / USABLE_FRACTION;

    // Off-grid has no utility to fall back on, so the bank must carry the
    // whole house through the night regardless of which loads were picked.
    const wholeHouseKwh =
      (dailyKwh * system.fallbackAutonomyDays) / DEPTH_OF_DISCHARGE;

    const requiredKwh =
      system.value === "off-grid"
        ? Math.max(priorityKwh, wholeHouseKwh)
        : priorityKwh;

    const bank = selectBank(requiredKwh, inverterKw);
    const usableWh = bank.nominalKwh * 1000 * USABLE_FRACTION;

    battery = {
      ...bank,
      requiredKwh,
      usableWh,
      targetHours,
      // Realistic coverage: the diversified draw, not everything at once.
      typicalHours: loads
        ? usableWh / (loads.totalRunningW * DIVERSITY_FACTOR)
        : targetHours,
      allAtOnceHours: loads ? usableWh / loads.totalRunningW : null,
      // Per-appliance runtime if that load ran alone off a full bank.
      rows: loads
        ? loads.rows.map((r) => ({
            ...r,
            hoursAlone: usableWh / r.runningW,
          }))
        : null,
    };
  }

  /* --------------------------------------------------- cost breakdown */

  // Split the installed cost into line items, so the blueprint shows where
  // the money actually goes instead of one opaque number.
  const costItems = (COST_BREAKDOWN[system.value] ?? []).map((item) => ({
    ...item,
    low: costLow * item.share,
    high: costHigh * item.share,
    mid: costMid * item.share,
  }));

  return {
    billAmount: amount,
    utility,
    system,
    monthlyKwh,
    dailyKwh,
    kwp,
    panels,
    roofArea,
    inverterKw,
    inverter,
    panel: {
      ...PANEL_SPEC,
      count: panels,
      installedKwp: (panels * PANEL_WATTS) / 1000,
      arraySqm: panels * PANEL_SPEC.areaSqm,
    },
    offGrid,
    costLow,
    costHigh,
    costMid,
    monthlySavings,
    newBill,
    paybackYears,
    loads,
    battery,
    costItems,
    // Cross-check: what the picked appliances alone would cost per month.
    applianceMonthlyKwh: loads ? (loads.dailyWh * 30) / 1000 : null,
    applianceMonthlyCost: loads
      ? ((loads.dailyWh * 30) / 1000) * utility.rate
      : null,
  };
}
