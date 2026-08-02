/**
 * Appliance catalog for the priority-load picker.
 *
 * `minW` / `maxW` are the nameplate range; `watts` is the midpoint used for
 * sizing. `hours` is a typical daily runtime for a Philippine household.
 * `duty` is the fraction of that runtime the compressor actually draws power —
 * only relevant for cycling loads (fridges, freezers, inverter aircon), and
 * it matters a lot: a fridge is "on" 24 hours but drawing for maybe 10.
 *
 * `surge` is the starting multiplier, used to check the inverter can actually
 * start the load rather than just carry it.
 */

export const APPLIANCE_CATEGORIES = [
  { id: "essential", label: "Essential / daily", emoji: "🏠" },
  { id: "high-draw", label: "Cooling, heating & kitchen", emoji: "❄️" },
  { id: "workshop", label: "Workshop & pumps", emoji: "🔧" },
];

export const APPLIANCES = [
  // 🏠 Essential / daily
  { id: "led-bulb", name: "LED light bulb", category: "essential", minW: 7, maxW: 15, watts: 11, hours: 6, duty: 1, surge: 1 },
  { id: "stand-fan", name: "Electric fan (stand/desk)", category: "essential", minW: 50, maxW: 80, watts: 65, hours: 8, duty: 1, surge: 1.5 },
  { id: "ceiling-fan", name: "Ceiling fan", category: "essential", minW: 60, maxW: 80, watts: 70, hours: 8, duty: 1, surge: 1.5 },
  { id: "tv", name: 'TV (LED 32"–42")', category: "essential", minW: 30, maxW: 70, watts: 50, hours: 5, duty: 1, surge: 1 },
  { id: "router", name: "Wi-Fi router", category: "essential", minW: 5, maxW: 15, watts: 10, hours: 24, duty: 1, surge: 1 },
  { id: "laptop", name: "Laptop computer", category: "essential", minW: 40, maxW: 75, watts: 58, hours: 6, duty: 1, surge: 1 },
  { id: "desktop", name: "Desktop computer", category: "essential", minW: 100, maxW: 200, watts: 150, hours: 5, duty: 1, surge: 1.2 },
  { id: "fridge-inverter", name: "Refrigerator (inverter, 8–10 cu ft)", category: "essential", minW: 100, maxW: 150, watts: 125, hours: 24, duty: 0.35, surge: 1.5 },
  { id: "fridge-standard", name: "Refrigerator (non-inverter)", category: "essential", minW: 150, maxW: 300, watts: 225, hours: 24, duty: 0.45, surge: 3 },
  { id: "chest-freezer", name: "Chest freezer", category: "essential", minW: 150, maxW: 250, watts: 200, hours: 24, duty: 0.45, surge: 3 },

  // ❄️ Cooling, heating & kitchen
  { id: "aircon-inv-10", name: "Inverter aircon (1.0 HP)", category: "high-draw", minW: 700, maxW: 800, watts: 750, hours: 8, duty: 0.6, surge: 1.5 },
  { id: "aircon-inv-15", name: "Inverter aircon (1.5 HP)", category: "high-draw", minW: 1000, maxW: 1200, watts: 1100, hours: 8, duty: 0.6, surge: 1.5 },
  { id: "aircon-window-10", name: "Window AC (non-inverter, 1.0 HP)", category: "high-draw", minW: 900, maxW: 1100, watts: 1000, hours: 8, duty: 0.7, surge: 3 },
  { id: "rice-cooker", name: "Rice cooker", category: "high-draw", minW: 300, maxW: 700, watts: 500, hours: 1, duty: 1, surge: 1 },
  { id: "microwave", name: "Microwave oven", category: "high-draw", minW: 800, maxW: 1200, watts: 1000, hours: 0.3, duty: 1, surge: 1.2 },
  { id: "water-dispenser", name: "Water dispenser (hot/cold)", category: "high-draw", minW: 100, maxW: 500, watts: 300, hours: 24, duty: 0.25, surge: 1 },
  { id: "washing-machine", name: "Washing machine (automatic)", category: "high-draw", minW: 300, maxW: 500, watts: 400, hours: 1, duty: 1, surge: 3 },
  { id: "water-heater", name: "Electric water heater (shower)", category: "high-draw", minW: 3500, maxW: 4500, watts: 4000, hours: 0.5, duty: 1, surge: 1 },
  { id: "iron", name: "Electric iron / steamer", category: "high-draw", minW: 1000, maxW: 1500, watts: 1250, hours: 0.5, duty: 1, surge: 1 },

  // 🔧 Workshop & pumps
  { id: "welder-inverter", name: "Inverter welding machine", category: "workshop", minW: 2000, maxW: 4000, watts: 3000, hours: 1, duty: 0.4, surge: 1.5 },
  { id: "welder-traditional", name: "Traditional welding machine", category: "workshop", minW: 4000, maxW: 8000, watts: 6000, hours: 1, duty: 0.4, surge: 2.5 },
  { id: "drill", name: "Electric drill (corded)", category: "workshop", minW: 500, maxW: 800, watts: 650, hours: 0.5, duty: 0.5, surge: 2 },
  { id: "angle-grinder", name: "Angle grinder", category: "workshop", minW: 700, maxW: 1200, watts: 950, hours: 0.5, duty: 0.6, surge: 2.5 },
  { id: "circular-saw", name: "Circular saw", category: "workshop", minW: 1200, maxW: 1500, watts: 1350, hours: 0.5, duty: 0.5, surge: 2.5 },
  { id: "water-pump", name: "Water pump (deep well, 1 HP)", category: "workshop", minW: 750, maxW: 1000, watts: 875, hours: 2, duty: 0.5, surge: 3 },
];

export const findAppliance = (id) => APPLIANCES.find((a) => a.id === id);
