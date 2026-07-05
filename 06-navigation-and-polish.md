# Prompt 06 — Navigation, footer, transitions, polish & deploy

> Paste below the line into Claude Code after `05`. This is the finishing pass that ties the site together.

---

Finish the Garyfalia Customs site: build the global navigation and footer, add page transitions, and do a full polish + deploy pass. Reuse the existing design system and motion helpers. Keep everything accessible and reduced-motion-safe.

## 1) Header / navigation
- A clean header with the **Garyfalia Customs** wordmark (→ home) and links: **Home, Gallery, About, Get a Commission**. Make "Get a Commission" a prominent button-style link.
- The active route is visually indicated.
- **Scroll behavior:** starts transparent/marble over the hero, then on scroll gains a subtle solid/blur background and slight shrink (via ScrollTrigger or a scroll listener). Smooth, not jumpy.
- **Mobile menu:** an accessible full-screen or slide-in menu — hamburger toggle with proper `aria-expanded`/`aria-controls`, focus trap while open, `Esc` to close, background scroll locked (`data-lenis-prevent`). Animated open/close (staggered link reveal), reduced-motion safe.
- Keyboard accessible; visible focus; links are real `<Link>`s.

## 2) Footer
- A calm navy or marble footer: wordmark + one-line tagline, nav links repeated, **Instagram** (primary social — TODO handle) + any others, contact email (TODO), and a small "© year Garyfalia Customs".
- Optional: a compact "Start a commission" CTA line.

## 3) Page transitions
- Add tasteful route transitions (App Router `template.tsx` or a transition wrapper): a quick fade or marble-wipe between pages. **Must** re-init/refresh ScrollTrigger on route change (`ScrollTrigger.refresh()`) and reset scroll position so animations recalc correctly. Verify no stale triggers leak between pages. Reduced-motion: instant.

## 4) SEO & metadata
- Per-page `metadata` (title, description) using the Next.js Metadata API. Sensible titles like "Garyfalia Customs — Custom Sneakers & Jackets", per-page variants.
- Open Graph + Twitter card tags with a default share image (TODO placeholder in `/public`).
- `favicon`, app icons, a `robots` + `sitemap` (Next.js `sitemap.ts` / `robots.ts`).
- Reasonable structured data (JSON-LD) for an artist/creative business is a nice-to-have.

## 5) Accessibility pass
- Audit headings (one logical `h1` per page, ordered), alt text on all images (descriptive for artwork), color contrast AA, focus-visible everywhere, keyboard operability of nav/lightbox/wizard.
- Confirm the entire site is usable with `prefers-reduced-motion: reduce` — no motion-dependent functionality.
- Add a "skip to content" link.

## 6) Performance
- `next/image` everywhere with correct `sizes`; lazy-load below-the-fold; preload the hero image. Avoid layout shift (reserve aspect ratios).
- Subset/`display: swap` fonts via `next/font`. Avoid loading unused GSAP plugins. Code-split heavy client components.
- Check Lighthouse (Performance/Best Practices/SEO/Accessibility) on a production build and fix obvious regressions. Target green scores; report what you couldn't fully fix and why.

## 7) Deploy
- Ensure `next build` passes clean (no type errors, no lint errors, no console errors in prod).
- Add a concise **`README.md`** at project root covering: install/run, the env vars needed for commission emails (`RESEND_API_KEY`, `COMMISSION_TO_EMAIL`, `COMMISSION_WEBHOOK_URL`), how to re-theme to **navy green** (one variable), how to swap the **display font**, and where to drop the owner's real content (images in `/public/content`, data in `src/data`, the `TODO:` placeholders).
- Give me step-by-step **Vercel deploy** instructions (push to GitHub → import to Vercel → set env vars → deploy), and note the custom-domain step.

## Acceptance criteria
- Nav + mobile menu are accessible, animated, and scroll-aware; footer complete.
- Route transitions are smooth and ScrollTrigger refreshes correctly on every navigation (no broken/duplicated triggers).
- `next build` is clean; Lighthouse scores are strong; reduced-motion fully respected sitewide.
- A clear root `README.md` exists with theming, content, env, and deploy instructions.

When done: summarize the final file tree, the env vars required for the commission form to email the owner, and a tidy checklist of the `TODO:` placeholders remaining across the whole site so the owner can drop in real content in one sitting.
