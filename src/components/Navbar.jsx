import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "../data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur-glass">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-8"
      >
        <a href="#top" className="rounded-lg" aria-label="SolarOps PH — home">
          <Logo className="h-13 w-13 sm:h-17 lg:h-18" />
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded font-sans text-sm font-semibold text-navy transition-colors hover:text-navy/60"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#calculator"
              className="flex items-center gap-1.5 rounded-lg px-1 font-sans text-sm font-bold text-solar transition-opacity hover:opacity-75"
            >
              <Zap className="h-4 w-4 fill-solar" aria-hidden="true" />
              Calculator
            </a>
          </li>
        </ul>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-navy transition-colors hover:bg-cream md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-navy/10 bg-white px-4 pb-6 pt-2 shadow-card md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3.5 font-sans text-base font-semibold text-navy hover:bg-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href="#calculator"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-solar px-4 py-3.5 font-sans text-base font-bold text-navy-deep"
              >
                <Zap className="h-4 w-4 fill-navy-deep" aria-hidden="true" />
                Calculator
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
