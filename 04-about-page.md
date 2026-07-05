# Prompt 04 — About page

> Paste below the line into Claude Code after `03`.

---

Build the **About page** (`/about`) for Garyfalia Customs — the artist's story. Reuse the design system, motion helpers, and `SmoothScroll`. This page is editorial and personal: marble-white, lots of breathing room, a couple of well-placed images, restrained motion. It should make a visitor trust the craft.

## Sections (top to bottom)

1. **Intro / portrait**
   - A two-column editorial layout: a large portrait image (TODO placeholder — the artist, or hands at work) on one side, a `SplitText` headline + short lede on the other (e.g., *"Hi, I'm Garyfalia."* + one sentence on what you make and why).
   - Light parallax on the portrait as it scrolls (desktop only).

2. **The story**
   - 2–4 short paragraphs (TODO placeholder copy) about how the work started, the obsession with detail, what makes a piece a "Garyfalia." Reveal paragraphs with a gentle fade-up stagger on scroll. Keep line length readable (measure ~60–70ch).

3. **Craft & materials**
   - A tasteful list/grid of techniques & materials (e.g., hand-painting, leather work, custom dyes, sealants — TODO edit to real ones). Small reveal stagger. Optional inline detail shots.

4. **A few signature pieces**
   - A compact strip pulling 2–3 `featured` items from `gallery.ts` (reuse the card/reveal pattern from the gallery, don't duplicate logic — extract a shared component if helpful), linking to `/gallery`.

5. **Closing CTA band**
   - Same dark navy band pattern as elsewhere: a warm invitation + **"Get a Commission"** button → `/commission`, and a link to Instagram (TODO handle).

## Motion & accessibility
- Reuse the shared reveal/SplitText helpers; consistent easing/durations with the rest of the site.
- Light parallax desktop-only via `matchMedia`; none on mobile.
- Full `prefers-reduced-motion` fallback (everything visible, no scrub/transform reveals).
- Images via `next/image` with reserved aspect ratios.

## Content placeholders
- Clearly mark every `TODO:` (portrait, story paragraphs, materials list, Instagram handle) so the owner can find and replace them fast. Keep the placeholder copy plausible and on-brand so the page looks finished even before real text lands.

## Acceptance criteria
- Reads like a real "about an artist" page, not lorem filler.
- Consistent visual + motion language with home/gallery; no console/hydration errors.
- Reduced motion fully supported; responsive and clean on mobile.

When done: list each `TODO:` placeholder and the file/line where the owner edits it.
