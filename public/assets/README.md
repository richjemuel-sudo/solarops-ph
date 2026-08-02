# Image assets

Export these from your Figma file and drop them here. The paths below are the
exact ones referenced in `src/data/content.js` and `src/components/Hero.jsx`.

| File                  | Used in    | Suggested size          |
| --------------------- | ---------- | ----------------------- |
| `hero-house.jpg`      | Hero       | 1920 × 1080, < 300 KB   |
| `why-clean-power.jpg` | Why Solar  | 800 × 600               |
| `why-reduce-bills.jpg`| Why Solar  | 800 × 600               |
| `why-sell-power.jpg`  | Why Solar  | 800 × 600               |
| `logo.svg`            | Favicon    | any                     |

The navbar and footer logo is drawn inline in `src/components/Logo.jsx`, so it
works before you export anything. Swap it for `<img src="/assets/logo.svg" />`
once you have the real mark.

Compress with squoosh.app or `npx @squoosh/cli` before committing.
