import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RATE_SOURCE } from "../data/providers";
import {
  PEAK_SUN_HOURS,
  DERATE,
  PANEL_WATTS,
} from "../data/content";
import { formatRuntime, formatArraySize, pluralize } from "./estimate";

/* ---------------------------------------------------------------- palette */

const NAVY = [16, 38, 112];
const NAVY_DEEP = [11, 27, 61];
const SOLAR = [255, 204, 0];
const SLATE = [71, 85, 105];
const CREAM = [244, 243, 225];
const WHITE = [255, 255, 255];

const MARGIN = 16;

/* ------------------------------------------------------------------ logo */

export const LOGO_URL = "/assets/solarops-ph-logo.png";

/**
 * Fetches the brand logo and returns it as a data URL plus its natural aspect
 * ratio. Returns null if the file is missing or unreachable — the header then
 * falls back to a drawn mark rather than failing the whole download.
 */
async function loadLogo(doc) {
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    const blob = await res.blob();

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    const props = doc.getImageProperties(dataUrl);
    return { dataUrl, ratio: props.width / props.height };
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------- helpers */

/**
 * jsPDF's built-in fonts use WinAnsi encoding, which has no ₱ (U+20B1) — it
 * renders as a garbage glyph. "PHP" is unambiguous and always prints.
 * Embedding a Unicode font would add ~300 KB for one character.
 */
const php = (n, decimals = 0) =>
  `PHP ${Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

const today = () =>
  new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function sectionHeading(doc, title, y) {
  doc.setFillColor(...CREAM);
  doc.rect(MARGIN, y - 5, doc.internal.pageSize.getWidth() - MARGIN * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text(title.toUpperCase(), MARGIN + 3, y);
  return y + 8;
}

/** Shared table styling so every section reads as one document. */
const tableTheme = {
  theme: "grid",
  styles: {
    font: "helvetica",
    fontSize: 9,
    cellPadding: 2.6,
    textColor: SLATE,
    lineColor: [225, 228, 238],
    lineWidth: 0.1,
  },
  headStyles: {
    fillColor: NAVY,
    textColor: WHITE,
    fontStyle: "bold",
    fontSize: 9,
  },
  alternateRowStyles: { fillColor: [250, 250, 246] },
  margin: { left: MARGIN, right: MARGIN },
};

/* ----------------------------------------------------------------- cover */

function drawHeader(doc, result, logo) {
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(...NAVY_DEEP);
  doc.rect(0, 0, w, 42, "F");

  if (logo) {
    // The logo has navy in it, so it needs a light chip to sit on — same
    // treatment as the footer on the site. Width is capped so an unusually
    // wide mark can't run into the title block on the right.
    const MAX_LOGO_W = 62;
    let logoH = 16;
    let logoW = logoH * logo.ratio;
    if (logoW > MAX_LOGO_W) {
      logoW = MAX_LOGO_W;
      logoH = logoW / logo.ratio;
    }
    const chipH = logoH + 8;
    doc.setFillColor(...WHITE);
    doc.roundedRect(MARGIN, (42 - chipH) / 2, logoW + 8, chipH, 2, 2, "F");
    doc.addImage(
      logo.dataUrl,
      "PNG",
      MARGIN + 4,
      (42 - chipH) / 2 + 4,
      logoW,
      logoH
    );
  } else {
    // Fallback mark, so a missing asset never breaks the download.
    doc.setFillColor(...SOLAR);
    doc.circle(MARGIN + 9, 13, 3, "F");
    doc.setDrawColor(...SOLAR);
    doc.setLineWidth(1);
    doc.line(MARGIN, 24, MARGIN + 5, 19);
    doc.line(MARGIN + 5, 19, MARGIN + 10, 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...WHITE);
    doc.text("SolarOps PH", MARGIN + 16, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(200, 208, 230);
    doc.text("SOLAR ESTIMATOR", MARGIN + 16, 25);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...SOLAR);
  doc.text("Solar Blueprint", w - MARGIN, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 208, 230);
  doc.text(`Prepared ${today()}`, w - MARGIN, 24, { align: "right" });
  doc.text(
    `${result.system.label} - ${result.utility.acronym}`,
    w - MARGIN,
    29,
    { align: "right" }
  );
}

/** Three headline figures in a row, the same ones the results card leads with. */
function drawHighlights(doc, result, y) {
  const w = doc.internal.pageSize.getWidth();
  const boxW = (w - MARGIN * 2 - 8) / 3;

  const cells = [
    ["System size", formatArraySize(result.kwp)],
    [
      "Estimated investment",
      `${php(Math.round(result.costLow / 1000) * 1000)}\n- ${php(
        Math.round(result.costHigh / 1000) * 1000
      )}`,
    ],
    ["Payback period", `${result.paybackYears.toFixed(1)} years`],
  ];

  cells.forEach(([label, value], i) => {
    const x = MARGIN + i * (boxW + 4);
    doc.setFillColor(...CREAM);
    doc.roundedRect(x, y, boxW, 24, 2, 2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(label.toUpperCase(), x + 4, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(value.includes("\n") ? 9 : 13);
    doc.setTextColor(...NAVY);
    doc.text(value, x + 4, y + (value.includes("\n") ? 14 : 17));
  });

  return y + 32;
}

function drawFooters(doc) {
  const pages = doc.internal.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(225, 228, 238);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, h - 16, w - MARGIN, h - 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...SLATE);
    doc.text(
      "SolarOps PH - free solar sizing for Philippine homes. Estimates only; a site survey confirms the final design.",
      MARGIN,
      h - 11
    );
    doc.text(`Page ${i} of ${pages}`, w - MARGIN, h - 11, { align: "right" });
  }
}

/* -------------------------------------------------------------- document */

/**
 * Builds the blueprint document. Split out from the download so the layout can
 * be exercised in tests without touching the filesystem or the DOM.
 */
export async function buildBlueprint(result) {
  if (!result) throw new Error("Nothing to generate — run a calculation first.");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadLogo(doc);

  drawHeader(doc, result, logo);
  let y = drawHighlights(doc, result, 50);

  /* ------------------------------------------------ what you told us */

  y = sectionHeading(doc, "Your inputs", y);
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "Value"]],
    body: [
      ["Monthly electric bill", php(result.billAmount)],
      [
        "Electric provider",
        `${result.utility.acronym} - ${result.utility.name}`,
      ],
      [
        "Rate used",
        `PHP ${result.utility.rate.toFixed(2)}/kWh${
          result.utility.estimated
            ? " (national average - utility not individually tracked)"
            : ` (verified ${result.utility.verifiedAt})`
        }`,
      ],
      ["System type", result.system.label],
      [
        "Estimated consumption",
        `${Math.round(result.monthlyKwh)} kWh per month (${result.dailyKwh.toFixed(
          1
        )} kWh per day)`,
      ],
    ],
    columnStyles: { 0: { cellWidth: 55, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* --------------------------------------------------- panel array */

  y = sectionHeading(doc, "Solar array specification", y);
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "Specification"]],
    body: [
      ["Required array size", formatArraySize(result.kwp)],
      [
        "Panels",
        `${pluralize(result.panel.count, "panel")} at ${
          result.panel.watts
        } W each`,
      ],
      [
        "Installed capacity",
        `${formatArraySize(result.panel.installedKwp)} (${
          result.panel.count
        } x ${result.panel.watts} W)`,
      ],
      ["Cell technology", result.panel.technology],
      [
        "Array footprint",
        `about ${result.panel.arraySqm.toFixed(
          1
        )} sqm of panel; allow about ${Math.ceil(
          result.roofArea
        )} sqm of roof with walkways and setbacks`,
      ],
      [
        "Expected output",
        `about ${(result.kwp * PEAK_SUN_HOURS * DERATE).toFixed(
          1
        )} kWh per day at ${PEAK_SUN_HOURS} peak sun hours and ${DERATE} derate`,
      ],
      ["Panel warranty", `${result.panel.warrantyYears} year performance warranty`],
    ],
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* ------------------------------------------------------- inverter */

  if (y > 215) {
    doc.addPage();
    y = 24;
  }
  y = sectionHeading(doc, "Inverter specification", y);

  const inverterRows = [
    ["Rated capacity", `${result.inverter.ratedKw} kW`],
    ["Type", result.inverter.family],
    [
      "Minimum required",
      `${result.inverter.requiredKw} kW - set by ${result.inverter.driver}`,
    ],
    [
      "Sizing rule",
      "Twice the array capacity, so there is headroom for motor starting surge rather than steady-state capacity alone.",
    ],
    [
      "Maximum DC input",
      `up to about ${result.inverter.maxDcInputKwp} kWp of panels on this unit`,
    ],
  ];

  if (result.battery) {
    inverterRows.push([
      "Battery voltage",
      `must accept a ${result.battery.voltage} V (${result.battery.voltageLabel}) LiFePO4 bank`,
    ]);
  }
  if (result.loads) {
    inverterRows.push([
      "Continuous load",
      `${Math.round(result.loads.totalRunningW).toLocaleString("en-PH")} W of selected appliances`,
    ]);
    inverterRows.push([
      "Surge requirement",
      `${Math.round(result.loads.peakSurgeW).toLocaleString(
        "en-PH"
      )} W - running load plus the largest motor starting`,
    ]);
  }
  inverterRows.push(["Note", result.inverter.note]);
  if (result.inverter.undersized) {
    inverterRows.push([
      "Warning",
      "This requirement exceeds a single residential inverter. Stacked units or a three-phase design are needed.",
    ]);
  }

  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "Specification"]],
    body: inverterRows,
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* -------------------------------------------------------- battery */

  if (y > 215) {
    doc.addPage();
    y = 24;
  }
  y = sectionHeading(doc, "Battery specification", y);

  const batteryRows = result.battery
    ? [
        ["Configuration", result.battery.spec],
        ["Nominal capacity", `${result.battery.nominalKwh.toFixed(2)} kWh`],
        [
          "Bank layout",
          result.battery.strings === 1
            ? `single ${result.battery.unitAh} Ah battery`
            : `${result.battery.strings} x ${result.battery.unitAh} Ah in parallel (${result.battery.ampHours} Ah total)`,
        ],
        ["Nominal voltage", `${result.battery.voltage} V (${result.battery.voltageLabel} class)`],
        ["Chemistry", "LiFePO4 (lithium iron phosphate)"],
        [
          "Usable energy",
          `${(result.battery.usableWh / 1000).toFixed(
            2
          )} kWh at 90% depth of discharge, after inverter losses`,
        ],
        [
          "Design backup window",
          `${result.battery.targetHours} hours at the diversified household load`,
        ],
        [
          "Energy required",
          `${result.battery.requiredKwh.toFixed(
            2
          )} kWh - rounded up to the nearest standard capacity`,
        ],
      ]
    : [
        [
          "Battery bank",
          "None. Grid-tied systems disconnect during an outage, by design, so there is nothing to keep running.",
        ],
        [
          "If you want backup",
          "Switch to a hybrid system. That adds a battery port, a transfer switch and the bank itself.",
        ],
      ];

  if (result.battery?.undersized) {
    batteryRows.push([
      "Warning",
      "This load exceeds a standard residential bank. A custom multi-bank design with its own switchgear is required.",
    ]);
  }

  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "Specification"]],
    body: batteryRows,
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* -------------------------------------------- balance of system */

  if (y > 215) {
    doc.addPage();
    y = 24;
  }
  y = sectionHeading(doc, "Balance of system and installation", y);
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "What it covers"]],
    body: [
      [
        "Mounting and racking",
        "Rails, roof hooks or ballast, clamps and earthing for the array.",
      ],
      [
        "DC side",
        "PV cable, MC4 connectors, DC breakers or fuses, surge protection and a DC disconnect.",
      ],
      [
        "AC side",
        "AC breakers, changeover or transfer switch, metering point wiring and the bond to your existing panel.",
      ],
      [
        "Protection and earthing",
        "Grounding electrode, equipment bonding and surge protection on both DC and AC sides.",
      ],
      [
        "Labor and installation",
        "Site survey, structural check, mounting, wiring, commissioning and handover testing.",
      ],
      [
        "Permits and documentation",
        result.offGrid
          ? "Local electrical permit and inspection. No utility application, since the system is not connected to the grid."
          : "Local electrical permit, inspection, and the net-metering application with your distribution utility.",
      ],
    ],
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* ---------------------------------------------------------- money */

  y = sectionHeading(doc, "Cost and return", y);
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Item", "Amount"]],
    body: [
      [
        "Estimated installed cost",
        `${php(result.costLow)} - ${php(result.costHigh)}`,
      ],
      ["Current monthly bill", php(result.billAmount)],
      ["Estimated monthly savings", php(result.monthlySavings)],
      ["Projected new monthly bill", php(result.newBill)],
      ["Estimated annual savings", php(result.monthlySavings * 12)],
      ["Payback period", `${result.paybackYears.toFixed(1)} years`],
      [
        "Savings after payback",
        `about ${php(
          result.monthlySavings * 12 * (25 - result.paybackYears)
        )} over the remaining panel warranty`,
      ],
    ],
    columnStyles: { 0: { cellWidth: 65, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 10;

  /* ----------------------------------------------- cost breakdown */

  if (y > 200) {
    doc.addPage();
    y = 24;
  }
  y = sectionHeading(doc, "Where the money goes", y);
  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Line item", "Share", "Estimated range"]],
    body: [
      ...result.costItems.map((item) => [
        item.label,
        `${Math.round(item.share * 100)}%`,
        `${php(item.low)} - ${php(item.high)}`,
      ]),
      [
        "Total installed cost",
        "100%",
        `${php(result.costLow)} - ${php(result.costHigh)}`,
      ],
    ],
    columnStyles: {
      0: { cellWidth: 75 },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right" },
    },
    didParseCell: (data) => {
      const last = data.table.body.length - 1;
      if (data.section === "body" && data.row.index === last) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = NAVY;
        data.cell.styles.fillColor = CREAM;
      }
    },
  });
  y = doc.lastAutoTable.finalY + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(
    doc.splitTextToSize(
      "Shares are typical for a Philippine residential installation of this type. Actual quotations vary with brand tier, roof access and how far the array sits from the service panel. Use this to sanity-check a supplier's quotation, not to replace one.",
      doc.internal.pageSize.getWidth() - MARGIN * 2
    ),
    MARGIN,
    y + 2
  );
  y += 16;

  /* ------------------------------------------------ backup coverage */

  if (result.battery?.rows?.length) {
    if (y > 210) {
      doc.addPage();
      y = 24;
    }
    y = sectionHeading(doc, "Backup coverage during a brownout", y);

    autoTable(doc, {
      ...tableTheme,
      startY: y,
      head: [["Appliance", "Qty", "Power draw", "Runtime on battery"]],
      body: [
        ...result.battery.rows.map((r) => [
          r.name,
          `${r.qty}`,
          `${Math.round(r.runningW).toLocaleString("en-PH")} W`,
          formatRuntime(r.hoursAlone),
        ]),
        [
          "All at once",
          "",
          `${Math.round(result.loads.totalRunningW).toLocaleString("en-PH")} W`,
          formatRuntime(result.battery.allAtOnceHours),
        ],
      ],
      columnStyles: {
        1: { halign: "center", cellWidth: 16 },
        2: { halign: "right", cellWidth: 32 },
        3: { halign: "right", cellWidth: 38 },
      },
      didParseCell: (data) => {
        const last = data.table.body.length - 1;
        if (data.section === "body" && data.row.index === last) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = NAVY;
          data.cell.styles.fillColor = CREAM;
        }
      },
    });
    y = doc.lastAutoTable.finalY + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text(
      doc.splitTextToSize(
        "Run times assume each appliance runs continuously at full power. Most modern appliances cycle on and off or throttle their draw, so real battery life is usually longer. Figures already account for inverter efficiency and a safe discharge limit.",
        doc.internal.pageSize.getWidth() - MARGIN * 2
      ),
      MARGIN,
      y + 2
    );
    y += 16;
  }

  /* ----------------------------------------------------- assumptions */

  if (y > 200) {
    doc.addPage();
    y = 24;
  }
  y = sectionHeading(doc, "How these numbers were produced", y);

  autoTable(doc, {
    ...tableTheme,
    startY: y,
    head: [["Assumption", "Value used"]],
    body: [
      ["Peak sun hours", `${PEAK_SUN_HOURS} hours per day (PH annual average)`],
      [
        "System derate",
        `${DERATE} - wiring, heat, inverter and soiling losses`,
      ],
      [
        "Target offset",
        `${Math.round(
          result.system.offset * 100
        )}% of consumption for a ${result.system.label.toLowerCase()} system`,
      ],
      [
        "Net metering credit",
        "Exported energy is credited at generation cost, not the retail rate, so savings are discounted to 90% of the offset value.",
      ],
      [
        "Cost spread",
        "Plus or minus 12% for equipment tier and roof access difficulty.",
      ],
      [
        "Battery sizing",
        "Combined nameplate load x 0.45 diversity factor, held for the design backup window, at 90% depth of discharge and 90% inverter efficiency.",
      ],
      ["Rate source", RATE_SOURCE.label],
    ],
    columnStyles: { 0: { cellWidth: 45, fontStyle: "bold", textColor: NAVY } },
  });
  y = doc.lastAutoTable.finalY + 8;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(
    doc.splitTextToSize(
      "This blueprint is a planning estimate produced from the figures you entered. It is not a quotation and not an engineering design. Electricity rates change monthly, and final system cost depends on your roof, wiring and chosen equipment. Have a licensed electrical practitioner survey the site before committing to a purchase. SolarOps PH is an independent project and is not affiliated with any solar installer or distribution utility.",
      doc.internal.pageSize.getWidth() - MARGIN * 2
    ),
    MARGIN,
    y
  );

  drawFooters(doc);

  return doc;
}

/** Filename like SolarOps-PH-Blueprint-hybrid-2026-08-02.pdf */
export function blueprintFilename(result) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `SolarOps-PH-Blueprint-${result.system.value}-${stamp}.pdf`;
}

/**
 * Builds the PDF and triggers the download. Everything runs in the browser —
 * no server, so the user's bill never leaves their machine.
 */
export async function generateBlueprint(result) {
  const doc = await buildBlueprint(result);
  doc.save(blueprintFilename(result));
}