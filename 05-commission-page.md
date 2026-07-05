# Prompt 05 — Commission page (the order flow) — PRIORITY

> Paste below the line into Claude Code after `04`. This is the most important page. Build it carefully and make it feel premium and effortless.

---

Build the **"Get a Commission" page** (`/commission`) for Garyfalia Customs — a **multi-step order request flow**. This is the heart of the site. The previous version of this site had an order procedure the owner liked; this one must be **clearly better**: smoother, clearer, more reassuring, and harder to get wrong. Reuse the design system, motion helpers, and `SmoothScroll`.

Design goals: a calm, guided, gallery-grade experience. The visitor should always know where they are, what's left, and feel confident their request landed. No overwhelm — one focused decision per step.

## Overall shape

A **stepper wizard** with a persistent **progress indicator** (numbered steps + a filling progress bar) and a **live order summary** that updates as they go. Steps animate in/out with a soft slide/fade (respecting reduced motion). Validation is per-step: the visitor can't advance until the current step is valid, with friendly inline error messages (not alarming). State persists across steps (and ideally across refresh — see persistence note).

### Steps

1. **What are we making?**
   - Choose item type: **Sneakers / Jacket / Other** (large, tappable choice cards with an icon or thumbnail; one selected, clearly highlighted in navy).
   - Conditional follow-up: if Sneakers → brand/model + you'll supply the pair? (yes/no). If Jacket → garment type + you'll supply it? If Other → short free-text describing the item.

2. **Your vision**
   - Free-text description of the idea/design (with a helpful placeholder prompt).
   - Style tags/multi-select (e.g., bold/graphic, minimal, anime, abstract, lettering, nature, custom — editable list).
   - Color direction (a few swatches or a free-text field).
   - **Reference image upload** (optional, multiple): drag-and-drop + click, image previews with remove buttons, client-side validation (type = image, max ~5 files, max ~8MB each, show friendly errors). Keep uploads in component state for now; the submit step handles delivery.

3. **Specs & sizing**
   - Conditional on step 1: shoe size (US/EU toggle) for sneakers; jacket size (XS–XXL or measurements) for jackets; generic field for "Other".
   - Optional: deadline/needed-by date, and whether it's a gift.

4. **Budget & timeline**
   - Budget range (a select or slider with sensible bands — editable; e.g., "€150–300 / €300–500 / €500–800 / €800+ / not sure yet"). Keep currency a single editable constant.
   - Flexibility on timeline (flexible / specific date).
   - A reassuring line that the quote is confirmed later, this just helps scope it.

5. **Your details & review**
   - Name, email (required, validated), Instagram/handle (optional), preferred contact method, country/shipping region, anything else (free text).
   - A **clear review summary** of everything entered (read-only, with "edit" links that jump back to the relevant step).
   - Consent checkbox (e.g., "I'm happy to be contacted about this request").
   - **Submit** → success state.

### Progress, summary, navigation
- Sticky/visible **progress bar** with step labels; current step emphasized, completed steps marked done. Clicking a completed step jumps back to it.
- A compact **live summary** panel (sidebar on desktop, collapsible on mobile) reflecting current selections.
- **Back / Continue** buttons; Continue is disabled until the step validates. Smooth animated transition between steps; on step change, move focus to the new step's heading for screen-reader users.

### Submission handling (make it work out of the box, upgradable later)
- Create a **Next.js Route Handler** at `app/api/commission/route.ts` that accepts the form (multipart for the image references) and:
  - **Default (no setup required):** validate server-side, then deliver the request. Implement it so it works immediately with whichever of these the owner configures, in this priority:
    1. **Resend** email to the owner's address if `RESEND_API_KEY` is set (compose a clean HTML summary email; attach or link the reference images).
    2. Else, if a generic `COMMISSION_WEBHOOK_URL` (e.g., a Formspree/Make/Zapier endpoint) is set, POST the payload there.
    3. Else, in development, log the structured payload to the server console and still return success (so the flow is testable with zero config).
  - Return a typed JSON result; the client shows a friendly success or error state accordingly.
- Read all secrets from environment variables. **Never** hardcode keys. Add a `.env.example` documenting `RESEND_API_KEY`, `COMMISSION_TO_EMAIL`, `COMMISSION_WEBHOOK_URL`.
- Note for the owner in a comment: a real production setup should add spam protection (honeypot field — include one now — and optionally a captcha later) and a file-size/type limit on the server.

### Success state
- A warm confirmation screen: a short thank-you, what happens next (you'll reply within X — TODO set the real timeframe), the visitor's reference number or a copy of their summary, and a button back to the gallery or home. A small, classy success animation (respecting reduced motion).

## Validation & UX details
- Use a typed schema (e.g., **Zod**) shared between client and the route handler so validation rules live in one place.
- Inline, friendly validation; never block with a generic alert. Show errors only after a field is touched or on a failed Continue.
- Required: item type, vision description, email, consent. Everything else optional but encouraged.
- Email format validated; trim inputs; guard against empty/whitespace.
- Disable the submit button while the request is in flight; show a loading state; handle/network-error gracefully with a retry.

## Persistence
- Persist in-progress answers to `sessionStorage` (or `localStorage`) so a refresh doesn't wipe the form. Restore on mount. Clear on successful submit. Guard for SSR (`typeof window`).

## Accessibility (non-negotiable)
- Proper labels for every field, `aria-invalid` + described-by error messages, logical tab order, visible focus, the stepper exposed as navigable, focus moved to the new step on change.
- Fully usable with keyboard only and with reduced motion (steps just swap, no slide).
- Color contrast AA.

## Motion
- Step transitions: gentle slide + fade using the shared easing; progress bar animates its fill; choice cards have a satisfying select micro-interaction. All gated behind reduced-motion.

## Acceptance criteria
- The full 5-step flow can be completed start → success with keyboard only and with a mouse, on desktop and mobile.
- Per-step validation prevents advancing when invalid, with clear inline messages; review step accurately reflects all inputs and its "edit" links work.
- Submitting hits `/api/commission`, succeeds with zero configuration in dev (logs payload), and is ready to email via Resend or POST to a webhook once env vars are set. `.env.example` exists.
- Refreshing mid-flow restores progress; a successful submit clears it.
- Reference image upload validates type/size/count and previews/removes correctly.
- No console/hydration errors; reduced-motion fully supported.

When done, give me:
1. A short walkthrough of the flow and the files you created.
2. Exactly what the owner must set in `.env` to receive requests by email (Resend) and the alternative no-backend Formspree route.
3. Where to edit the step content: item types, style tags, budget bands, currency, and the "we'll reply within X" timeframe.
