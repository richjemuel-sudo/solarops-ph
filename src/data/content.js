// All copy and reference data lives here so the components stay presentational.

export const NAV_LINKS = [
  { label: "Why Solar?", href: "#why-solar" },
  { label: "How it works?", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

/* ---------------------------------------------------------------- Why solar */

export const WHY_SOLAR = [
  {
    id: "clean",
    icon: "leaf",
    title: "Clean, Renewable Power",
    body: "Lower your carbon footprint. Solar allows you to run your home using the most abundant, eco-friendly energy source available.",
    image: "/assets/why-clean-power.jpg",
    alt: "Solar panel in a field beside a light bulb holding a seedling",
  },
  {
    id: "bills",
    icon: "hardhat",
    title: "Drastically Reduce Bills",
    body: "A highly cost-effective upgrade that protects you from constantly rising electric rates. Recoup your initial investment in 4 to 5 years.",
    image: "/assets/why-reduce-bills.jpg",
    alt: "Installer in a hard hat mounting solar panels on a roof",
  },
  {
    id: "export",
    icon: "grid",
    title: "Sell Your Excess Power",
    body: "Don't let unused daytime energy go to waste. Export your surplus power back to the grid through Net-Metering.",
    image: "/assets/why-sell-power.jpg",
    alt: "High-voltage transmission tower against a bright sky",
  },
];

/* ------------------------------------------------------------- How it works */

export const STEPS = [
  {
    number: "01",
    title: "Enter your monthly bill",
    body: "Tell us your average monthly electricity cost and your provider. The tool converts that into the kilowatt (kWp) system size your home needs to wipe out the bill.",
  },
  {
    number: "02",
    title: "Pick your setup",
    body: "Three options, and we tell you which fits your goal:",
    bullets: [
      "Grid-tied — cheapest per watt, cuts your bill the most, but shuts off during brownouts.",
      "Hybrid — grid-tied plus battery backup. Costs more, keeps essentials running when the power drops.",
      "Off-grid — full independence, for sites with no reliable utility connection.",
    ],
  },
  {
    number: "03",
    title: "Get your solar blueprint",
    body: "See your estimated total investment, payback period, and the panel and inverter specs recommended for your roof.",
  },
];

/* ---------------------------------------------------------------------- FAQ */

export const FAQS = [
  {
    q: "How much will I actually save on my monthly bill?",
    a: "A properly sized grid-tied system can eliminate 70% to 100% of your daytime electricity cost. For most Philippine homes that returns the investment within 4 to 5 years, then keeps producing for another 20.",
  },
  {
    q: "What happens during a brownout? Will my solar panels still work?",
    a: "Standard grid-tied systems shut down during outages — that is a safety requirement, so no power is sent back to lines a lineman may be working on. If you want seamless backup during a brownout, you need a hybrid system with battery storage.",
  },
  {
    q: "Does solar work on cloudy or rainy days?",
    a: "Yes, but at reduced output — roughly 10% to 30% of a clear-sky day. Sizing already accounts for this by using an annual average of peak sun hours rather than a best-case day.",
  },
  {
    q: "Can I sell excess power back to Meralco or my local cooperative?",
    a: "Yes, through Net-Metering. Excess power is exported to the grid in exchange for peso credits on your next bill. Credits are valued at the utility's generation cost, not the full retail rate, so it is not a one-to-one swap.",
  },
  {
    q: "How much maintenance do solar panels require?",
    a: "Very little. Rinse the panels a few times a year to clear dust and bird droppings, and have the wiring and mounts inspected annually. Panels typically carry a 25-year performance warranty; inverters are replaced once at around year 10 to 15.",
  },
];

/* ------------------------------------------------------------------- Footer */

export const QUICK_LINKS = [
  { label: "Calculator", href: "#calculator" },
  { label: "Why Solar?", href: "#why-solar" },
  { label: "How it works?", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

// External references — vetted sources, opened in a new tab.
export const LEARN_LINKS = [
  {
    label: "Net Metering Explained",
    href: "https://doe.gov.ph/net-metering-home",
  },
  {
    label: "Grid-tied vs Hybrid vs Off-grid",
    href: "https://enphase.com/blog/homeowners/grid-tied-offgrid-hybrid-solar-systems",
  },
  {
    label: "How Solar Sizing Actually Works",
    href: "https://www.unboundsolar.com/blog/how-to-size-solar-system",
  },
  {
    label: "Understanding Your Electric Bill",
    href: "https://www.meralco.com.ph/residential/billing-payment/understanding-your-bill/breakdown-charges",
  },
];

/* ------------------------------------------------------- Calculator sources */

// Utility rates now live in ./providers.js — re-exported so existing imports
// from this module keep working.
export { PROVIDERS, RATE_SOURCE, findProvider, providersByRegion } from "./providers";

export const SYSTEM_TYPES = [
  {
    value: "grid-tied",
    label: "Grid-tied",
    blurb: "No backup during brownouts.",
    costPerKwp: 60000, // ₱ installed, per kWp
    offset: 0.85, // share of consumption the system is sized to cover
    fallbackAutonomyDays: 0, // used only when no appliances are picked
  },
  {
    value: "hybrid",
    label: "Hybrid",
    blurb: "Continuous power during brownouts.",
    costPerKwp: 95000,
    offset: 0.9,
    fallbackAutonomyDays: 0.4,
  },
  {
    value: "off-grid",
    label: "Off-Grid",
    blurb: "Full independence. Largest battery bank, highest cost.",
    costPerKwp: 125000,
    offset: 1.0,
    fallbackAutonomyDays: 1.2,
  },
];

// Sizing constants for the Philippines.
export const PEAK_SUN_HOURS = 4.5; // annual daily average, kWh/m²/day
export const DERATE = 0.8; // wiring, heat, inverter and soiling losses
export const PANEL_WATTS = 600;
export const SQM_PER_KWP = 6;
