# Prompt 02 — Home page (the animated centerpiece)

> Paste below the line into Claude Code after `01` is finished and running.

---

Build the **home page** for Garyfalia Customs. This is the centerpiece — it should feel like an immersive, scroll-driven editorial piece, elegant rather than flashy. Use the design system, motion helpers, and `SmoothScroll` provider already in the project. Use **GSAP + ScrollTrigger**, **SplitText**, and **Lenis** (already wired). Use the `useGSAP` hook from `@gsap/react` for all animations so cleanup is automatic, and scope animations to a ref.

The page is one vertical scroll with these sections in this exact order:
**Hero → Featured Commissions → The Process → Get Your Own → (Footer is global).**

Put real-feeling placeholder content and clearly-marked `TODO:` placeholders for images/text the owner will supply. Pull gallery + process data from typed files in `src/data/` so they're easy to edit.

---

## Global animation rules (apply to every section)
- Animate with `useGSAP` scoped to a section ref. Register/`gsap.context` cleanly.
- Everything must **degrade gracefully under `prefers-reduced-motion`**: no transforms/scrub, content simply visible. Gate animation setup behind the reduced-motion check.
- Use `ScrollTrigger` for on-scroll reveals; use the house easing/durations from `lib/motion.ts`.
- Don't animate layout-shifting properties in a way that hurts CLS. Prefer `transform`/`opacity`. Reserve image space.
- Keep it performant on mobile: lighter or disabled parallax on small screens (use `gsap.matchMedia()` to branch desktop vs mobile).

---

## 1) Hero — full viewport

- Full-height (`100svh`), `--marble` background. Big confident **Fraunces** display of the brand line, e.g. *"Wearable art, made by hand."* with **"Garyfalia Customs"** as the wordmark.
- A short supporting sentence (one line) and **two buttons**: primary **"Get a Commission"** (→ `/commission`) and ghost **"View Gallery"** (→ `/gallery`).
- **SplitText headline reveal:** split the headline into lines (and words), then stagger a mask/clip reveal upward on load. Use SplitText's masking option; revert the split on cleanup. Ensure the screen-reader label stays intact (SplitText adds aria handling — keep it).
- **Subtle parallax:** include one or two hero image elements (TODO placeholders — your best pieces) that drift at a slightly different rate than the text as the user scrolls out of the hero (small `y` movement via ScrollTrigger `scrub`). Keep it tasteful — a few dozen pixels, not dramatic.
- A small **scroll cue** at the bottom (e.g., a thin line that draws down, or "scroll" with a soft bob) that fades out once the user scrolls.
- On load, the supporting text and buttons fade-up after the headline, lightly staggered.

## 2) Featured Commissions — gallery sample

- An **eyebrow** ("Selected Work" / "Recent Commissions") + a `SectionHeading`.
- A curated set of **4–6 featured pieces** from `src/data/gallery.ts` (a typed array: `id, title, type: "sneaker" | "jacket", description, materials, year, image`). Use the first few flagged `featured: true`.
- Layout: an editorial, slightly asymmetric grid (not a plain uniform grid). Mix sizes; let it feel curated. Use `next/image` with proper `sizes` and aspect ratios; reserve space to avoid CLS.
- **Reveal:** as each card enters the viewport, fade/mask-up with a small stagger. Add a gentle **image parallax inside each card** (image scales slightly / shifts `y` within an `overflow-hidden` frame on scroll). Hover: subtle zoom + the title/meta slides up.
- Below the grid, **two CTAs side by side**: primary **"Get Yours Now"** (→ `/commission`) and ghost **"View Full Gallery"** (→ `/gallery`). (These two buttons are explicitly required here.)

## 3) The Process — "how to buy", scroll-driven

This is the "progress / steps to buy" section. Make it a standout **pinned, scroll-driven** sequence.

- Heading like *"From idea to icon — how it works"*.
- Steps come from `src/data/process.ts` (typed array of `{ number, title, blurb }`). Default 5 steps — edit text to match the real flow:
  1. **Reach out** — share your idea, the item, references, sizing.
  2. **Design & quote** — we shape the concept together; you get a sketch + price.
  3. **Deposit & slot** — a deposit books your spot in the queue.
  4. **The making** — hand-crafted, with progress photos along the way.
  5. **Delivery** — finished piece shipped (or picked up), ready to wear.
- **Behavior:** pin the section (`ScrollTrigger` pin) and advance through steps as the user scrolls — e.g., a horizontal progress rail or a large rotating step number on one side, with the active step's text/image revealing on the other. Active step highlights; a progress line fills. Keep it readable; don't trap the user too long (sensible pin distance).
- **Mobile fallback (via `matchMedia`):** do NOT pin on small screens. Instead lay the steps out vertically as a clean numbered timeline with a draw-in connector line and fade-up per step.
- Reduced motion: plain vertical numbered list, all visible.

## 4) Get Your Own — closing CTA band

- A full-width **dark band** (`--navy-deep`, `--marble` text) — a strong visual shift from the marble sections above.
- Large invitation headline (SplitText word reveal on enter) like *"Bring me your blank canvas."*
- One line of supporting copy + a prominent **"Get Your Own"** button → `/commission`. Optionally a secondary "See the gallery" ghost link.
- Optional: a faint parallax texture/marble-vein graphic in the background (very subtle, low contrast). Keep text legible.

---

## Data files to create
- `src/data/gallery.ts` — ~8–12 typed placeholder items (mix of sneakers & jackets, a few `featured: true`), with `TODO:` image paths under `/public/content/gallery/`.
- `src/data/process.ts` — the 5 steps above, easily editable.

## Acceptance criteria
- Scroll feels smooth and cohesive top-to-bottom; sections share consistent rhythm and motion language.
- Hero SplitText reveal works and reverts cleanly (no leftover split spans, no layout jump, no double-trigger on route changes).
- Featured grid reveals + internal image parallax work; both required CTAs ("Get Yours Now" + "View Full Gallery") are present and link correctly.
- Process section pins and steps through on desktop; degrades to a vertical timeline on mobile and under reduced motion.
- No console errors, no hydration warnings, good CLS (images reserve space), 60fps-ish scrolling on a normal laptop.
- All animations disabled/simplified under `prefers-reduced-motion`.

When done: show me the section component files, and tell me exactly which lines/files to edit to (a) swap in real images, (b) reorder or rewrite the process steps, (c) change which pieces are "featured".
