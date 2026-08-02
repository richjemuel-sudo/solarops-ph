import { useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, X } from "lucide-react";
import {
  APPLIANCES,
  APPLIANCE_CATEGORIES,
  findAppliance,
} from "../data/appliances";
import { formatWatts } from "../lib/estimate";

/**
 * Picker for the loads a household wants covered during a brownout.
 *
 * `value` is [{ id, qty }]; `onChange` receives the next array. The parent owns
 * the state so the calculator can clear stale results when it changes.
 */
export default function ApplianceSelector({ value = [], onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const chosenIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? APPLIANCES.filter((a) => a.name.toLowerCase().includes(q))
      : APPLIANCES;

    return APPLIANCE_CATEGORIES.map((cat) => ({
      ...cat,
      items: pool.filter((a) => a.category === cat.id),
    })).filter((cat) => cat.items.length > 0);
  }, [query]);

  const totalWatts = value.reduce((sum, v) => {
    const a = findAppliance(v.id);
    return sum + (a ? a.watts * v.qty : 0);
  }, 0);

  function add(id) {
    const existing = value.find((v) => v.id === id);
    onChange(
      existing
        ? value.map((v) => (v.id === id ? { ...v, qty: v.qty + 1 } : v))
        : [...value, { id, qty: 1 }]
    );
    setQuery("");
    inputRef.current?.focus();
  }

  function setQty(id, qty) {
    if (qty < 1) return remove(id);
    onChange(value.map((v) => (v.id === id ? { ...v, qty } : v)));
  }

  function remove(id) {
    onChange(value.filter((v) => v.id !== id));
  }

  return (
    <div>
      <label
        htmlFor="appliance-search"
        className="block font-sans text-sm font-bold text-navy"
      >
        Which appliances must stay powered?
      </label>
      <p className="mt-1 font-body text-sm text-slate-body">
        Pick the loads you want covered during a brownout. This sizes the
        battery — skip it and we'll size from your bill alone.
      </p>

      <div className="mt-3.5 rounded-xl border border-navy/15 bg-white p-3">
        {/* search */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40"
            aria-hidden="true"
          />
          <input
            id="appliance-search"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="appliance-listbox"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            placeholder="Search appliances — aircon, fridge, welder…"
            className="w-full rounded-lg border border-navy/10 bg-cream/50 py-2.5 pl-9 pr-3 font-body text-sm text-navy placeholder:text-slate-body/60 focus:border-solar focus:bg-white focus:outline-none focus:ring-2 focus:ring-solar/40"
          />
        </div>

        {/* results */}
        {open && (
          <div
            id="appliance-listbox"
            role="listbox"
            className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-navy/10 bg-white"
          >
            {matches.length === 0 ? (
              <p className="px-3 py-4 font-body text-sm text-slate-body">
                No appliance matches "{query}". Try a shorter word, like "fan"
                or "pump".
              </p>
            ) : (
              matches.map((cat) => (
                <div key={cat.id}>
                  <p className="sticky top-0 bg-cream px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-navy/60">
                    <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                  </p>
                  {cat.items.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      role="option"
                      aria-selected={chosenIds.has(a.id)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => add(a.id)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-solar/10"
                    >
                      <span className="font-body text-sm text-navy">
                        {a.name}
                        {chosenIds.has(a.id) && (
                          <span className="ml-2 rounded bg-solar/25 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase text-navy">
                            added
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-body text-xs text-slate-body">
                        {a.minW}–{a.maxW} W
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {/* chips */}
        {value.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {value.map(({ id, qty }) => {
              const a = findAppliance(id);
              if (!a) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-1 rounded-lg border border-solar bg-solar/10 py-1 pl-1 pr-1.5"
                >
                  <button
                    type="button"
                    onClick={() => setQty(id, qty - 1)}
                    aria-label={`Fewer ${a.name}`}
                    className="grid h-6 w-6 place-items-center rounded text-navy hover:bg-solar/30"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>

                  <span className="px-1 font-body text-sm text-navy">
                    <span className="font-sans font-bold">{qty}×</span> {a.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQty(id, qty + 1)}
                    aria-label={`More ${a.name}`}
                    className="grid h-6 w-6 place-items-center rounded text-navy hover:bg-solar/30"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(id)}
                    aria-label={`Remove ${a.name}`}
                    className="grid h-6 w-6 place-items-center rounded text-navy/50 hover:bg-solar/30 hover:text-navy"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {value.length > 0 && (
        <p className="mt-2 font-body text-xs text-slate-body">
          Combined running load:{" "}
          <span className="font-sans font-bold text-navy">
            {formatWatts(totalWatts)}
          </span>{" "}
          across {value.length} {value.length === 1 ? "item" : "items"}.
        </p>
      )}
    </div>
  );
}
