# SolarOps PH

Free solar sizing calculator for Philippine homes. Enter a monthly electric
bill, pick a system type, and get a system size, installed-cost range, and
payback period.

## Run it

```bash
npm install
npm run dev
```

Node 18+. Stack: React 18 + Vite + Tailwind CSS 3 + lucide-react.

## Structure

```
public/assets/          images exported from Figma (see the README in there)
src/
  App.jsx               section order + skip link
  components/           one file per section
  data/content.js       copy, links, system types, sizing constants
  data/providers.js     66 utilities with dated ₱/kWh rates
  data/appliances.js    appliance catalog: wattage, runtime, duty, surge
  lib/estimate.js       the sizing engine — pure functions, no React
```

Everything you'd tune day-to-day lives in `src/data/`: utility rates, the
appliance catalog, cost per kWp per system type, peak sun hours, derate factor,
panel wattage, FAQ copy, and the external Learn links.

## Utility rates

`data/providers.js` holds 66 distribution utilities with residential effective
rates, each carrying a `verifiedAt` billing period that the UI displays. Rates
in the Philippines change **every month** — the generation charge is a
pass-through cost that tracks WESM spot prices — so treat any figure older than
a couple of months as stale and re-check the source.

There are 152 DUs nationwide; the rest have no published, dated residential
rate, so they fall back to `OTHER_PROVIDER` at the ₱11.45 national average and
are labelled as an estimate in the UI. To add one, append an entry with its
acronym, rate, region and `verifiedAt` — no other file needs to change.

Source: <https://www.pinas.solar/solar-guides/electricity-rates-philippines/>
(official advisories for the top five utilities, ICSC PRESYO-PH for co-ops).

## How the numbers are produced

```
monthly kWh = bill ÷ utility rate
daily kWh   = monthly kWh ÷ 30
array kWp   = (daily kWh × target offset) ÷ (peak sun hours × derate)
```

Defaults: 4.5 peak sun hours (PH annual daily average), 0.8 derate for wiring,
heat, inverter and soiling losses, 600 W panels. Installed cost carries a ±12%
spread. Savings are discounted to 90% of the offset value, because exported
energy earns generation-cost credits under net metering rather than the full
retail rate.

Grid-tied is sized to cover 85% of consumption, hybrid 90%, off-grid 100%.
Off-grid also zeroes the bill outright rather than discounting it — you are
disconnected from the utility, so there is nothing left to pay.

Array size prints as watts-peak below 1 kWp (`600 Wp`, not `0.6 kWp`).

Inverter capacity is the largest of: **twice the array** (headroom for motor
starting surge, not just steady-state), the running load plus 25%, or the
running load plus the largest motor's startup surge. That figure is then
rounded up to a capacity actually sold — 1.6, 2.4, 3.2, 3.6, 4.2, 5, 6, 8, 10,
12, 16, 20, 25, 30 kW. A 700 Wp array therefore lands on a 1.6 kW inverter.
Because inverter capacity sets bank voltage, it is computed before the
battery.

Battery capacity is driven by the appliances the user marks as priorities.
Combined nameplate load is multiplied by a 0.45 diversity factor (households
never run everything at once), carried for 8 hours on hybrid or 20 on off-grid,
then divided by the usable fraction — 90% depth of discharge × 90% inverter
efficiency. Off-grid additionally floors the bank at whole-house autonomy,
since there's no utility to fall back on.

That energy requirement is then turned into a real bank by `selectBank()`:

| Inverter size   | Bank nominal voltage |
| --------------- | -------------------- |
| up to 2 kW      | 12.8 V ("12 V")      |
| 2.1 – 4.2 kW    | 25.6 V ("24 V")      |
| 4.3 kW and up   | 51.2 V ("48 V")      |

Capacity comes from what LiFePO4 is actually sold in — 50, 100, 120, 150, 200,
230, 250, 280, 300, 314, 324 Ah — picking the smallest single unit that covers
the requirement. Only when no single battery fits does it parallel identical
units (from 200 Ah up, fewest strings first, four maximum), so you get
"2 × 300 Ah in parallel" rather than a fictional 600 Ah cell. If even that
can't reach the requirement, the bank is returned with `undersized: true` and
the UI says the job needs a custom multi-bank design.

Inverter sizing takes the largest of: the array plus 10%, the running load plus
25%, or the running load plus the single largest motor's startup surge.

Per-appliance runtimes in the backup table assume that load running alone off a
full bank; the "all at once" row uses the combined nameplate draw.

Planning estimates only. A roof survey determines the final design.

## Design tokens

| Token        | Hex                      | Use                                    |
| ------------ | ------------------------ | -------------------------------------- |
| `cream`      | `#F4F3E1`                | alternating section backgrounds        |
| `navy`       | `#102670`                | headings, primary text                 |
| `navy-deep`  | `#0B1B3D`                | results card, footer, Calculate button |
| `solar`      | `#FFCC00`                | CTAs, selected states, accents         |
| `mint`       | `#2CF59E`                | positive figures on dark surfaces      |
| `slate-body` | `#475569`                | secondary text on light surfaces       |
| `glass`      | `rgba(114,122,165,0.07)` | metric tiles on the navy card          |

Type: Moul (display), Montserrat (UI and labels), Mozilla Text (body). Loaded
from Google Fonts in `index.html`.

## The PDF blueprint

`lib/blueprint.js` builds the downloadable report with jsPDF, entirely in the
browser — the user's bill never leaves their machine, and there's no backend to
deploy. jsPDF is dynamically imported from `ResultsCard`, so its ~350 KB stays
out of the initial bundle until someone clicks the button.

Sections: headline figures, the inputs used, a full **solar array
specification** (panel count, technology, footprint, expected daily output,
warranty), an **inverter specification** (rated capacity, type, what drove the
sizing, max DC input, surge requirement), a **battery specification** (bank
layout, chemistry, usable energy, design backup window), **balance of system
and installation** (mounting, DC side, AC side, protection and earthing, labor,
permits), cost and return, a **"where the money goes"** breakdown by line item,
the backup coverage table when applicable, and the assumptions behind every
number.

Cost shares per line item live in `COST_BREAKDOWN` in `data/content.js` and
differ by system type — a battery is 40% of an off-grid job and 0% of a
grid-tied one.

`buildBlueprint(result)` returns the jsPDF document and `generateBlueprint()`
saves it — split that way so the layout can be rendered and inspected in a test
without a DOM.

The header loads `/assets/solarops-ph-logo.png` at runtime via `fetch`, so the
PDF and the site always show the same mark. It sits on a white chip because the
logo contains navy, and the width is capped at 62 mm so a wide mark can't run
into the title block. If the file is missing the header falls back to a drawn
sun-and-roofline rather than failing the download.

One constraint worth knowing: jsPDF's built-in fonts use WinAnsi encoding,
which has no ₱ glyph, so the PDF prints `PHP 12,500` instead. Embedding a
Unicode font would add roughly 300 KB for a single character. The web UI still
uses ₱ throughout.

## Hero sky cycle

The hero runs a looping day/night cycle in pure CSS — no images, no JS, no
canvas. Four fixed gradients (dawn, day, dusk, night) cross-fade over the photo
with `mix-blend-mode: soft-light`, plus a darkening layer for night, a sun that
tracks an arc, and a tiled starfield that only appears after dusk. Because it
tints the existing photo rather than replacing the sky, it works with whatever
hero image you drop in.

Speed is one variable. `Hero.jsx` sets it inline:

```jsx
style={{ "--sky-duration": "60s" }}
```

Drop it to `6s` while you're tuning the look, then put it back — waiting a
minute per loop to check the dusk phase gets old fast.

Two things that are easy to break if you refactor this:

- The sky layers are **direct siblings of the `<img>`, not wrapped in a
  positioned div**. `mix-blend-mode` blends against the nearest stacking
  context, so a `z-index`-ed wrapper would make them blend against the wrapper
  (transparent) and the tint would silently do nothing. Layering is DOM order;
  only the text block carries a `z-index`.
- The keyframe opacities are tuned so the four tints never stack above 1.0 and
  never all drop out at once. If you shift one phase, shift its neighbours.

`prefers-reduced-motion` freezes the whole thing at midday rather than leaving
a blank sky.

## Accessibility

Radio-group semantics on the system-type cards, `aria-expanded` and
`aria-controls` on the FAQ accordion and mobile menu, a skip link, visible
focus rings, and `prefers-reduced-motion` honored globally.

---

Built by Rich Jemuel Montero · Virac, Catanduanes, Philippines
