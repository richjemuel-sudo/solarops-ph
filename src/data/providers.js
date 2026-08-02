/**
 * Philippine distribution utilities with residential effective rates (₱/kWh).
 *
 * Source: Pinas.Solar's rate tracker, which pulls the five largest utilities
 * from their own advisories and the electric cooperatives from ICSC PRESYO-PH.
 * https://www.pinas.solar/solar-guides/electricity-rates-philippines/
 *
 * IMPORTANT: rates move every month, driven mostly by the generation charge.
 * `verifiedAt` records the billing period each figure came from, and the UI
 * shows it so nobody mistakes a stale number for today's number.
 *
 * There are 152 distribution utilities in the country. The 66 below are the
 * ones with a published, dated residential rate. Anything not listed falls
 * back to OTHER_PROVIDER at the national average — clearly labelled as such.
 */

export const RATE_SOURCE = {
  label: "Pinas.Solar rate tracker (ICSC PRESYO-PH + utility advisories)",
  url: "https://www.pinas.solar/solar-guides/electricity-rates-philippines/",
  nationalAverage: 11.45,
  utilitiesTracked: 66,
  utilitiesNationwide: 152,
};

export const OTHER_PROVIDER = {
  value: "other",
  acronym: "Other",
  name: "Not listed — use national average",
  rate: RATE_SOURCE.nationalAverage,
  region: "Other",
  verifiedAt: "2026-06",
  estimated: true,
};

export const PROVIDERS = [
  // NCR / Luzon-wide
  { value: "meralco", acronym: "MERALCO", name: "Manila Electric Company", rate: 14.83, region: "NCR & Luzon", verifiedAt: "2026-07" },

  // Bicol Region
  { value: "ficelco", acronym: "FICELCO", name: "First Catanduanes EC", rate: 16.07, region: "Bicol Region", verifiedAt: "2026-06" },
  { value: "soreco-1", acronym: "SORECO I", name: "Sorsogon EC I", rate: 12.58, region: "Bicol Region", verifiedAt: "2026-06" },
  { value: "fibeco", acronym: "FIBECO", name: "First Bukidnon EC", rate: 11.85, region: "Bicol Region", verifiedAt: "2026-06" },
  { value: "aleco", acronym: "ALECO", name: "Albay EC", rate: 11.08, region: "Bicol Region", verifiedAt: "2026-06" },
  { value: "casureco-2", acronym: "CASURECO II", name: "Camarines Sur EC II", rate: 10.47, region: "Bicol Region", verifiedAt: "2026-06" },
  { value: "canoreco", acronym: "CANORECO", name: "Camarines Norte EC", rate: 10.38, region: "Bicol Region", verifiedAt: "2026-06" },

  // MIMAROPA
  { value: "ormeco", acronym: "ORMECO", name: "Oriental Mindoro EC", rate: 14.92, region: "MIMAROPA", verifiedAt: "2026-06" },
  { value: "omeco", acronym: "OMECO", name: "Occidental Mindoro EC", rate: 12.64, region: "MIMAROPA", verifiedAt: "2026-06" },
  { value: "paleco", acronym: "PALECO", name: "Palawan EC", rate: 12.48, region: "MIMAROPA", verifiedAt: "2026-06" },
  { value: "tielco", acronym: "TIELCO", name: "Tablas Island EC", rate: 11.94, region: "MIMAROPA", verifiedAt: "2026-06" },
  { value: "marelco", acronym: "MARELCO", name: "Marinduque EC", rate: 11.12, region: "MIMAROPA", verifiedAt: "2026-06" },

  // CALABARZON
  { value: "quezelco-1", acronym: "QUEZELCO I", name: "Quezon EC I", rate: 11.72, region: "CALABARZON", verifiedAt: "2026-06" },
  { value: "fleco", acronym: "FLECO", name: "First Laguna EC", rate: 10.71, region: "CALABARZON", verifiedAt: "2026-06" },
  { value: "batelec-1", acronym: "BATELEC I", name: "Batangas EC I", rate: 9.77, region: "CALABARZON", verifiedAt: "2026-06" },

  // Central Luzon
  { value: "sfelapco", acronym: "SFELAPCO", name: "San Fernando Electric Light & Power", rate: 11.31, region: "Central Luzon", verifiedAt: "2026-06" },
  { value: "pelco-2", acronym: "PELCO II", name: "Pampanga EC II", rate: 10.96, region: "Central Luzon", verifiedAt: "2026-06" },
  { value: "neeco-1", acronym: "NEECO I", name: "Nueva Ecija EC I", rate: 10.94, region: "Central Luzon", verifiedAt: "2026-06" },
  { value: "tarelco-2", acronym: "TARELCO II", name: "Tarlac EC II", rate: 10.6, region: "Central Luzon", verifiedAt: "2026-06" },
  { value: "zameco-1", acronym: "ZAMECO I", name: "Zambales EC I", rate: 10.58, region: "Central Luzon", verifiedAt: "2026-06" },
  { value: "penelco", acronym: "PENELCO", name: "Peninsula EC (Bataan)", rate: 10.33, region: "Central Luzon", verifiedAt: "2026-06" },

  // Ilocos Region
  { value: "batanelco", acronym: "BATANELCO", name: "Batanes EC", rate: 12.78, region: "Ilocos Region", verifiedAt: "2026-06" },
  { value: "lueco", acronym: "LUECO", name: "La Union EC", rate: 10.89, region: "Ilocos Region", verifiedAt: "2026-06" },
  { value: "cenpelco", acronym: "CENPELCO", name: "Central Pangasinan EC", rate: 10.4, region: "Ilocos Region", verifiedAt: "2026-06" },
  { value: "inec", acronym: "INEC", name: "Ilocos Norte EC", rate: 10.13, region: "Ilocos Region", verifiedAt: "2026-06" },
  { value: "iseco", acronym: "ISECO", name: "Ilocos Sur EC", rate: 9.5, region: "Ilocos Region", verifiedAt: "2026-06" },

  // Cagayan Valley
  { value: "quirelco", acronym: "QUIRELCO", name: "Quirino EC", rate: 11.42, region: "Cagayan Valley", verifiedAt: "2026-06" },
  { value: "cagelco-2", acronym: "CAGELCO II", name: "Cagayan EC II", rate: 11.34, region: "Cagayan Valley", verifiedAt: "2026-06" },
  { value: "nuvelco", acronym: "NUVELCO", name: "Nueva Vizcaya EC", rate: 10.49, region: "Cagayan Valley", verifiedAt: "2026-06" },
  { value: "iselco-1", acronym: "ISELCO I", name: "Isabela EC I", rate: 10.27, region: "Cagayan Valley", verifiedAt: "2026-06" },

  // Cordillera
  { value: "kaelco", acronym: "KAELCO", name: "Kalinga-Apayao EC", rate: 12.37, region: "Cordillera", verifiedAt: "2026-06" },
  { value: "mopreco", acronym: "MOPRECO", name: "Mountain Province EC", rate: 10.87, region: "Cordillera", verifiedAt: "2026-06" },
  { value: "ifelco", acronym: "IFELCO", name: "Ifugao EC", rate: 10.63, region: "Cordillera", verifiedAt: "2026-06" },
  { value: "beneco", acronym: "BENECO", name: "Benguet EC", rate: 9.7, region: "Cordillera", verifiedAt: "2026-06" },

  // Western Visayas
  { value: "more", acronym: "MORE", name: "MORE Electric and Power (Iloilo)", rate: 14.35, region: "Western Visayas", verifiedAt: "2026-06" },
  { value: "nepc", acronym: "NEPC", name: "Negros Power (Bacolod)", rate: 14.13, region: "Western Visayas", verifiedAt: "2026-06" },
  { value: "capelco", acronym: "CAPELCO", name: "Capiz EC", rate: 12.07, region: "Western Visayas", verifiedAt: "2026-06" },
  { value: "guimelco", acronym: "GUIMELCO", name: "Guimaras EC", rate: 12.01, region: "Western Visayas", verifiedAt: "2026-06" },
  { value: "akelco", acronym: "AKELCO", name: "Aklan EC", rate: 11.51, region: "Western Visayas", verifiedAt: "2026-06" },

  // Central Visayas
  { value: "veco", acronym: "VECO", name: "Visayan Electric (Cebu)", rate: 14.9, region: "Central Visayas", verifiedAt: "2026-06" },
  { value: "noreco-2", acronym: "NORECO II", name: "Negros Oriental EC II", rate: 11.57, region: "Central Visayas", verifiedAt: "2026-06" },
  { value: "boheco-1", acronym: "BOHECO I", name: "Bohol EC I", rate: 10.08, region: "Central Visayas", verifiedAt: "2026-06" },

  // Eastern Visayas
  { value: "soleco", acronym: "SOLECO", name: "Southern Leyte EC", rate: 12.53, region: "Eastern Visayas", verifiedAt: "2026-06" },
  { value: "bileco", acronym: "BILECO", name: "Biliran EC", rate: 12.0, region: "Eastern Visayas", verifiedAt: "2026-06" },
  { value: "norsamelco", acronym: "NORSAMELCO", name: "Northern Samar EC", rate: 11.16, region: "Eastern Visayas", verifiedAt: "2026-06" },
  { value: "samelco-1", acronym: "SAMELCO I", name: "Samar EC I", rate: 10.94, region: "Eastern Visayas", verifiedAt: "2026-06" },
  { value: "leyeco-4", acronym: "LEYECO IV", name: "Leyte EC IV", rate: 10.5, region: "Eastern Visayas", verifiedAt: "2026-06" },

  // Northern Mindanao
  { value: "camelco", acronym: "CAMELCO", name: "Camiguin EC", rate: 13.47, region: "Northern Mindanao", verifiedAt: "2026-06" },
  { value: "cepalco", acronym: "CEPALCO", name: "Cagayan Electric Power and Light", rate: 13.09, region: "Northern Mindanao", verifiedAt: "2026-06" },
  { value: "ilpi", acronym: "ILPI", name: "Iligan Light & Power", rate: 11.65, region: "Northern Mindanao", verifiedAt: "2026-06" },
  { value: "moelci-2", acronym: "MOELCI II", name: "Misamis Occidental EC II", rate: 11.31, region: "Northern Mindanao", verifiedAt: "2026-06" },

  // Davao Region
  { value: "dlpc", acronym: "DLPC", name: "Davao Light and Power", rate: 13.09, region: "Davao Region", verifiedAt: "2026-06" },
  { value: "doreco", acronym: "DORECO", name: "Davao Oriental EC", rate: 11.77, region: "Davao Region", verifiedAt: "2026-06" },
  { value: "dasureco", acronym: "DASURECO", name: "Davao del Sur EC", rate: 10.75, region: "Davao Region", verifiedAt: "2026-06" },

  // Caraga
  { value: "surneco", acronym: "SURNECO", name: "Surigao del Norte EC", rate: 12.67, region: "Caraga", verifiedAt: "2026-06" },
  { value: "surseco-2", acronym: "SURSECO II", name: "Surigao del Sur EC II", rate: 11.89, region: "Caraga", verifiedAt: "2026-06" },
  { value: "aneco", acronym: "ANECO", name: "Agusan del Norte EC", rate: 11.2, region: "Caraga", verifiedAt: "2026-06" },

  // Zamboanga Peninsula
  { value: "zaneco", acronym: "ZANECO", name: "Zamboanga del Norte EC", rate: 11.89, region: "Zamboanga Peninsula", verifiedAt: "2026-06" },
  { value: "zamcelco", acronym: "ZAMCELCO", name: "Zamboanga City EC", rate: 10.97, region: "Zamboanga Peninsula", verifiedAt: "2026-06" },
  { value: "zamsureco-2", acronym: "ZAMSURECO II", name: "Zamboanga del Sur EC II", rate: 10.72, region: "Zamboanga Peninsula", verifiedAt: "2026-06" },

  // SOCCSKSARGEN
  { value: "cotelco", acronym: "COTELCO", name: "Cotabato EC", rate: 10.95, region: "SOCCSKSARGEN", verifiedAt: "2026-06" },
  { value: "socoteco-2", acronym: "SOCOTECO II", name: "South Cotabato EC II", rate: 9.75, region: "SOCCSKSARGEN", verifiedAt: "2026-06" },
  { value: "socoteco-1", acronym: "SOCOTECO I", name: "South Cotabato EC I", rate: 9.75, region: "SOCCSKSARGEN", verifiedAt: "2026-06" },
  { value: "sukelco", acronym: "SUKELCO", name: "Sultan Kudarat EC", rate: 9.38, region: "SOCCSKSARGEN", verifiedAt: "2026-06" },

  // BARMM
  { value: "clpc", acronym: "CLPC", name: "Cotabato Light and Power", rate: 9.67, region: "BARMM", verifiedAt: "2026-06" },
  { value: "lasureco", acronym: "LASURECO", name: "Lanao del Sur EC", rate: 5.43, region: "BARMM", verifiedAt: "2026-06" },

  OTHER_PROVIDER,
];

/** Region order for the grouped dropdown — north to south, "Other" last. */
export const REGION_ORDER = [
  "NCR & Luzon",
  "Ilocos Region",
  "Cagayan Valley",
  "Cordillera",
  "Central Luzon",
  "CALABARZON",
  "MIMAROPA",
  "Bicol Region",
  "Western Visayas",
  "Central Visayas",
  "Eastern Visayas",
  "Zamboanga Peninsula",
  "Northern Mindanao",
  "Davao Region",
  "SOCCSKSARGEN",
  "Caraga",
  "BARMM",
  "Other",
];

export const providersByRegion = () =>
  REGION_ORDER.map((region) => ({
    region,
    items: PROVIDERS.filter((p) => p.region === region).sort(
      (a, b) => b.rate - a.rate
    ),
  })).filter((g) => g.items.length > 0);

export const findProvider = (value) =>
  PROVIDERS.find((p) => p.value === value) ?? OTHER_PROVIDER;
