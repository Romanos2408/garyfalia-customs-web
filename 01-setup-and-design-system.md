# Prompt 01 — Project setup & design system

> Paste everything below the line into Claude Code as your first message.

---

You are building a portfolio + commission website for **Garyfalia Customs**, a custom sneaker and jacket artist. This is the foundation step: scaffold the project, install the animation stack, and lock in a reusable design system and layout shell. Do **not** build the individual pages yet — we'll do those in later prompts. Build clean, well-organized, production-quality code.

## Stack

- **Next.js (latest, App Router) + TypeScript**
- **Tailwind CSS (latest)**
- **GSAP 3.13+** + **ScrollTrigger** + **SplitText**, plus **`@gsap/react`** for the `useGSAP` hook
- **Lenis** (the `lenis` package — NOT `@studio-freight/lenis`, which is deprecated)

### Important install notes
- GSAP is now 100% free including SplitText — install from the public npm registry with plain `npm install gsap @gsap/react`. **Do not** add any auth token, `.npmrc`, or private registry. Do not use any "nulled"/cracked plugin packages.
- Optional but recommended: read the official GSAP AI guidance at `https://github.com/greensock/gsap-skills` for correct, current GSAP patterns, and follow it.
- Scaffold with `create-next-app` (App Router, TypeScript, Tailwind, ESLint, `src/` dir, `@/*` alias). Use the App Router, not the Pages Router.

## Project structure (create this shape)

```
src/
  app/
    layout.tsx          # root layout, fonts, <SmoothScroll>, nav, footer
    page.tsx            # home (placeholder for now)
    gallery/page.tsx    # placeholder
    about/page.tsx      # placeholder
    commission/page.tsx # placeholder
    globals.css         # tokens + base styles
  components/
    providers/SmoothScroll.tsx
    layout/Header.tsx   # placeholder for now
    layout/Footer.tsx   # placeholder for now
    ui/                 # Button, Container, etc.
  lib/
    gsap.ts             # central GSAP plugin registration
    motion.ts           # shared easings, durations, reduced-motion helper
  data/                 # gallery items, process steps (typed mock data)
```

For now the four pages can be simple placeholders (just an `<h1>` + a sentence) so the dev server runs cleanly. Real content comes in later prompts.

---

## Design system — implement exactly

### Colors (CSS custom properties + Tailwind theme)

Define these as CSS variables in `globals.css` and expose them to Tailwind. **Navy blue is the default primary.** Put the navy-green alternative right next to it as a commented one-line swap so the whole site can be re-themed by changing a single variable.

```
/* Surfaces */
--marble:      #F5F3EE;  /* page background — warm marble white */
--paper:       #FBFAF7;  /* cards / raised surfaces */
--mist:        #E7E3D9;  /* hairline borders, dividers */
--stone:       #B7B2A6;  /* muted text, captions, marble veining */

/* Ink & brand */
--ink:         #0E1B2A;  /* primary text — deep navy-black */
--navy:        #16263F;  /* PRIMARY brand color (navy blue) */
--navy-deep:   #0C1A2E;  /* darker navy for footers / contrast blocks */

/* Alternative theme — swap --navy and --navy-deep to these for "navy green":
--navy:        #15302A;
--navy-deep:   #0C201B;
*/

/* Optional tasteful accent (off by default; a warm brass that reads as "craft").
   Mention it in a comment; do not use it heavily. */
--accent:      #B08A4F;
```

- Default page background = `--marble`. Default text = `--ink`. Primary buttons / dark sections = `--navy` / `--navy-deep` with `--marble` text.
- Keep contrast accessible (WCAG AA for text).

### Typography (Google Fonts, via `next/font`)

- **Display / headings:** `Fraunces` (variable; use its optical-size + soft, slightly editorial character). Large, tight leading, generous size on hero.
- **Body / UI:** `Inter`.
- Expose as CSS variables `--font-display` and `--font-sans` and wire into Tailwind (`font-display`, `font-sans`).
- Type scale should be fluid (use `clamp()`), with a big, confident hero display size.
- *(Alt the owner may request later: swap Fraunces for a bolder grotesque like Archivo/Anton for a more "streetwear" feel. Keep the font easy to swap in one place.)*

### Spacing, layout, shape
- Generous whitespace — this is a gallery, let it breathe.
- A `Container` component with a comfortable max-width (~1200–1280px) and responsive gutters.
- Soft, minimal radii (cards ~12–16px). Hairline borders use `--mist`. Subtle shadows only.
- Respect a consistent vertical rhythm between sections (large section padding).

### Motion principles (define in `lib/motion.ts`, reuse everywhere)
- A house easing curve, e.g. `power3.out` for entrances and a custom cubic-bezier `(0.16, 1, 0.3, 1)` for UI.
- Standard durations: micro ~0.3s, entrance ~0.8–1.1s, scroll-scrub tied to scroll.
- A small set of reusable reveal helpers (fade-up, mask-reveal, stagger) so pages stay consistent.
- **Reduced motion is a first-class requirement** (see below).

---

## Smooth scroll + GSAP wiring (get this right)

Create `components/providers/SmoothScroll.tsx` as a **client component** that initializes **Lenis** and drives it from **GSAP's ticker** (single RAF loop — set Lenis `autoRaf: false`). Wrap the app body with it in `layout.tsx`.

Use this canonical integration:

```ts
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: reduce ? 1 : 0.1, // instant scroll if reduced motion
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Also:
- Centralize plugin registration in `lib/gsap.ts` (register `ScrollTrigger`, `SplitText`, `useGSAP`'s deps) and import from there so plugins register once.
- Always guard browser-only code (`"use client"`, check for `window`) to avoid Next.js SSR/hydration errors.
- Provide a reusable `useReducedMotion()` helper. Every animation later must early-return / fall back to a simple opacity state when reduced motion is on.
- Set `data-lenis-prevent` guidance available for any future scrollable modal.

---

## Reusable UI to create now

- `Container` — layout wrapper.
- `Button` — primary (navy fill, marble text) and ghost/outline variants; subtle hover motion; works as `<a>`/`<Link>` or `<button>`.
- A simple `SectionHeading` component (eyebrow label + display heading) used across pages.

---

## Acceptance criteria

- `npm run dev` runs with **no console errors or hydration warnings**.
- Smooth scrolling works and feels good; it does **not** break anchor links or `position: sticky`.
- With OS "reduce motion" enabled, scroll is effectively instant and no entrance animations run.
- Colors and fonts match the tokens above; switching `--navy`/`--navy-deep` to the green values re-themes the whole site.
- Code is typed, organized into the structure above, and the four placeholder pages render.

When done, give me: the list of files you created, the exact dependency versions installed, and a one-paragraph summary of how to re-theme to navy green and how to swap the display font.
