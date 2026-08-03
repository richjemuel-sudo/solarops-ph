import { Facebook, Mail, ExternalLink } from "lucide-react";
import Logo from "./Logo";
import { QUICK_LINKS, LEARN_LINKS } from "../data/content";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + disclaimer */}
          <div>
            <span className="inline-flex rounded-lg bg-white px-3 py-2">
              <Logo className="h-9 w-auto" />
            </span>
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-white/70">
              A free solar sizing calculator for Philippine homes. Built by an
              electrical practitioner, not a sales team.
            </p>
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/70">
              Independent project — not affiliated with any solar installer or
              distribution utility.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-labelledby="footer-quick">
            <h2
              id="footer-quick"
              className="font-sans text-base font-bold text-white"
            >
              Quick links
            </h2>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded font-body text-sm text-white/70 transition-colors hover:text-solar"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Learn */}
          <nav aria-labelledby="footer-learn">
            <h2
              id="footer-learn"
              className="font-sans text-base font-bold text-white"
            >
              Learn
            </h2>
            <ul className="mt-5 space-y-3">
              {LEARN_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-1.5 rounded font-body text-sm text-white/70 transition-colors hover:text-solar"
                  >
                    {link.label}
                    <ExternalLink
                      className="mt-0.5 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Feedbacks */}
          <div>
            <h2 className="font-sans text-base font-bold text-white">
              Feedbacks
            </h2>
            <p className="mt-5 font-body text-sm text-white/70">Message us on</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded font-body text-sm text-white/70 transition-colors hover:text-solar"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  Rich Montero
                </a>
              </li>
              <li>
                <a
                  href="mailto:richjemuel@gmail.com"
                  className="inline-flex items-center gap-2.5 rounded font-body text-sm text-white/70 transition-colors hover:text-solar"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  richjemuel@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mt-14 border-mint/40" />

        <div className="mt-6 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-body text-xs text-white/60">
            © 2026 SolarOps PH · Built by Rich Jemuel Montero · Made in Virac,
            Catanduanes, Philippines
          </p>
          <p className="flex justify-center gap-4 font-body text-xs text-white/60 sm:justify-end">
            <a href="#top" className="rounded hover:text-solar">
              Privacy
            </a>
            <a href="#top" className="rounded hover:text-solar">
              Disclaimer
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
