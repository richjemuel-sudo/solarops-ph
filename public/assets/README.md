# Image assets

Export these from your Figma file and drop them here. The paths below are the
exact ones referenced in `src/data/content.js` and `src/components/Hero.jsx`.

| File                  | Used in    | Suggested size          |
| --------------------- | ---------- | ----------------------- |
| `hero-house.jpg`      | Hero       | 1920 × 1080, < 300 KB   |
| `why-clean-power.jpg` | Why Solar  | 800 × 600               |
| `why-reduce-bills.jpg`| Why Solar  | 800 × 600               |
| `why-sell-power.jpg`  | Why Solar  | 800 × 600               |
| `solarops-ph-logo.png`| Navbar, footer, favicon | 320 x 80, transparent |

`solarops-ph-logo.png` is the official mark. It is used by `Logo.jsx` in the
navbar and footer, and as the favicon and apple-touch-icon in `index.html`.
Export it with a transparent background so it sits correctly on both the white
navbar and the white chip in the navy footer.

Compress with squoosh.app or `npx @squoosh/cli` before committing.
