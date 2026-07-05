# Prompt 03 — Gallery page

> Paste below the line into Claude Code after `02`.

---

Build the **Gallery page** (`/gallery`) for Garyfalia Customs — the full portfolio of past commissions. Reuse the design system, motion helpers, `SmoothScroll`, and the typed `src/data/gallery.ts` created earlier (extend the data shape if needed). Tone: a calm, premium gallery wall — the work is the hero, animation stays out of the way.

## Layout & content
- A short page header: eyebrow + `SectionHeading` (e.g., *"The Work"*), and one line of intro.
- **Filter controls**: `All / Sneakers / Jackets` (derive options from the data `type`). Active filter is clearly styled (navy). Filtering is instant and animated, not a hard cut.
- **Grid**: responsive masonry-style or justified grid that handles mixed aspect ratios gracefully (no awkward cropping of full pieces). Use `next/image` with correct `sizes`; reserve aspect-ratio space to keep CLS near zero.
- **Card**: image in an `overflow-hidden` frame; on hover, gentle image zoom and a slide-up overlay showing `title`, `type`, `materials`, `year`. Fully keyboard-focusable with visible focus styles.

## Motion
- On load / on scroll, cards reveal with a soft fade/mask-up **stagger** (ScrollTrigger batch so off-screen rows animate as they enter).
- When a filter changes, use a **FLIP-style** transition (GSAP `Flip` is free) or a clean fade-out/in + restagger so items rearrange smoothly rather than jumping.
- Subtle parallax on images within their frames is optional and must stay light; skip on mobile.
- Everything obeys `prefers-reduced-motion` (instant show, no scrub).

## Lightbox
- Clicking a piece opens an accessible **lightbox / modal**: larger image, title, full description, materials, year; prev/next navigation; close on `Esc`, on backdrop click, and via a visible close button.
- Trap focus while open, restore focus to the triggering card on close, lock background scroll (and set `data-lenis-prevent` on the scrollable modal content so Lenis doesn't fight it). Add appropriate `role="dialog"`, `aria-modal`, and a label.
- Animate open/close softly (scale + fade); respect reduced motion.

## CTA
- At the bottom of the page, a closing band with **"Get Yours Now"** → `/commission` (consistent with the home page CTA styling).

## Acceptance criteria
- All gallery items render from data; adding an item to `gallery.ts` makes it appear with no other code changes.
- Filtering works for All/Sneakers/Jackets with a smooth rearrange animation.
- Lightbox is fully keyboard-accessible (open, navigate, close), traps + restores focus, and locks background scroll without breaking Lenis.
- No CLS issues, no console/hydration errors, smooth on mobile.
- Reduced-motion users get a clean, static, fully-usable gallery.

When done: tell me how to add/remove/reorder gallery items and how to add a new filter category (e.g., "Accessories") in one place.
