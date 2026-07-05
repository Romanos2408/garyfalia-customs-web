# Prompt 07 — Claude Design briefs (visual exploration phase)

Use this file in **Claude Design** (the canvas tool), *before or alongside* the Claude Code build. Claude Design nails the **look, layout, and screen states**; Claude Code (prompts `02`–`06`) adds the **scroll animation + logic**. Don't expect the canvas to author the GSAP/Lenis/SplitText motion — describe the *intended* motion so the design accounts for it, then hand off.

## How to run this
1. Open a new Claude Design project.
2. Paste **Step A** below first — it establishes the design system so every screen starts on-brand. (If you have a repo/style guide, import it instead; otherwise this brief is enough.)
3. Then paste each screen brief (B1–B4) one at a time. Refine on the canvas with inline comments and the color/spacing knobs.
4. When happy, use **Export → Claude Code handoff** to package it, then continue with prompts `02`–`06`.

> Tip: ask for **2 directions** on the big screens (hero, commission step 1), pick one, then say *"save what we have and lock this direction"* before refining details. Keep an eye on usage — design exploration shares limits with Claude Code/chat.

---

## STEP A — Establish the design system (paste first)

> You're designing screens for **Garyfalia Customs**, a custom sneaker & jacket artist's portfolio + commission website. Lock in this design system and use it for every screen unless I say otherwise.
>
> **Mood:** editorial, gallery-grade, quietly premium — "wearable art." Calm, lots of whitespace, the work is the hero. Not loud streetwear, not corporate.
>
> **Color**
> - Page background (marble white): `#F5F3EE`
> - Cards / raised surfaces: `#FBFAF7`
> - Hairline borders / dividers: `#E7E3D9`
> - Muted text / captions: `#B7B2A6`
> - Primary text (deep navy-black): `#0E1B2A`
> - **Primary brand — navy blue: `#16263F`** (buttons, accents)
> - Dark contrast bands / footer: `#0C1A2E`
> - (Alt theme to keep in mind: navy green `#15302A` / `#0C201B` — show me a quick swatch of how the site looks in green too, but design in navy by default.)
> - Optional sparing accent (brass) `#B08A4F` — use almost never.
>
> **Type**
> - Display / headings: **Fraunces** — large, confident, tight leading, slightly editorial.
> - Body / UI: **Inter**.
> - Fluid, generous heading sizes; readable body measure (~60–70 characters).
>
> **Shape & spacing:** soft radii (12–16px on cards), hairline borders in the divider color, subtle shadows only, generous section padding and vertical rhythm.
>
> **Buttons:** primary = navy fill with marble text; secondary = ghost/outline. Calm hover states.
>
> Confirm the system, then wait for me to request the first screen.

---

## B1 — Home page screens

> Design the **home page** as a long single-scroll layout, top to bottom, as separate canvas sections. Give me **2 directions for the hero**, then we'll refine.
>
> **Hero (full viewport):** marble background, a big Fraunces headline (e.g. *"Wearable art, made by hand."*) with **"Garyfalia Customs"** as the wordmark, one supporting line, and two buttons: primary **"Get a Commission"**, ghost **"View Gallery."** Include 1–2 hero artwork images positioned for a subtle parallax feel, and a small scroll cue at the bottom. *(Note for handoff: headline will use a SplitText line/word reveal; images drift on scroll — design with room for that.)*
>
> **Featured Commissions:** an eyebrow ("Selected Work") + a heading, then a **curated, slightly asymmetric grid** of 4–6 pieces (mixed sneaker/jacket, varied sizes — not a uniform grid). Each card: image in a frame, with title/type/year revealed on hover. Below the grid, two buttons side by side: **"Get Yours Now"** + **"View Full Gallery."**
>
> **The Process ("how it works"):** a standout section presenting 5 numbered steps — Reach out → Design & quote → Deposit & slot → The making → Delivery. Design it as a strong horizontal/stepped sequence with a large active step number and a progress rail. *(Handoff note: this will be a pinned, scroll-driven section on desktop and a vertical numbered timeline on mobile — design both states.)*
>
> **"Get Your Own" CTA band:** a full-width **dark navy** band (`#0C1A2E`, marble text) — a deliberate contrast from the marble sections — with a large invitation headline (*"Bring me your blank canvas."*), one line of copy, and a prominent **"Get Your Own"** button.
>
> Show desktop and mobile for each section.

---

## B2 — Gallery page

> Design the **Gallery** page: a calm portfolio wall.
> - Page header: eyebrow + heading ("The Work") + one intro line.
> - **Filter controls:** All / Sneakers / Jackets — active filter clearly styled in navy.
> - **Grid:** responsive masonry/justified, handles mixed aspect ratios gracefully (no awkward cropping of full pieces). Card hover: gentle zoom + slide-up overlay with title, type, materials, year.
> - **Lightbox state:** design the open lightbox — large image, title, full description, materials, year, prev/next arrows, close button, dimmed backdrop.
> - Closing band with a **"Get Yours Now"** button (match the home CTA styling).
> - Desktop + mobile.

---

## B3 — About page

> Design the **About** page — editorial and personal, marble white, lots of air.
> - **Intro:** two-column — large portrait image one side, Fraunces headline (*"Hi, I'm Garyfalia."*) + short lede the other.
> - **The story:** 2–4 short paragraphs at a readable measure.
> - **Craft & materials:** a tasteful list/grid of techniques and materials, optional detail shots.
> - **Signature pieces:** a compact strip of 2–3 featured works linking to the gallery.
> - **Closing band:** dark navy invitation + **"Get a Commission"** button + an Instagram link.
> - Desktop + mobile.

---

## B4 — Commission wizard (the priority — design every step)

> Design the **"Get a Commission"** flow as a **multi-step wizard** — this is the most important part of the site and must feel calm, guided, and premium. One focused decision per step. Design **each step as its own screen**, plus the shared chrome.
>
> **Shared chrome (on every step):**
> - A persistent **progress indicator**: numbered steps (1–5) with labels + a filling progress bar; current step emphasized in navy, completed steps marked done.
> - A compact **live order summary** panel (sidebar on desktop, collapsible on mobile) reflecting selections so far.
> - **Back / Continue** buttons; Continue clearly primary. *(Handoff note: steps slide/fade between each other; Continue is disabled until the step is valid.)*
>
> **Step 1 — "What are we making?"**: three large tappable **choice cards** — Sneakers / Jacket / Other (icon or thumbnail each), one selected and highlighted in navy. Show a conditional follow-up field appearing below (e.g. brand/model for sneakers; "will you supply the item?" yes/no).
>
> **Step 2 — "Your vision"**: a large description textarea with a helpful placeholder; multi-select **style tags** (bold/graphic, minimal, anime, abstract, lettering, nature, custom) as pill toggles; a color-direction field/swatches; and a **reference image uploader** with drag-and-drop, image-preview thumbnails, and remove buttons. Design the empty, hover, and "files added" states.
>
> **Step 3 — "Specs & sizing"**: conditional on step 1 — shoe size with a US/EU toggle for sneakers, jacket size (XS–XXL or measurements) for jackets, a generic field for Other; plus an optional needed-by date and a "this is a gift" toggle.
>
> **Step 4 — "Budget & timeline"**: a budget-range selector with editable bands (e.g. €150–300 / €300–500 / €500–800 / €800+ / not sure yet); timeline flexibility (flexible / specific date); a reassuring line that the final quote comes later.
>
> **Step 5 — "Your details & review"**: name, email, optional Instagram, preferred contact method, country/region, and an "anything else" field; then a **clean read-only review summary** of all previous answers with small "edit" links per section; a consent checkbox; and a primary **Submit** button.
>
> **Success state**: a warm confirmation screen — short thank-you, "what happens next" (you'll hear back within [X]), a copy of their request summary or a reference number, and a button back to the gallery/home. Design a small, classy success moment.
>
> Show desktop and mobile for the chrome and all five steps + success. Keep every field clearly labeled and the hierarchy obvious — this should feel effortless to fill out.

---

## After the canvas: handoff

- Use **Export → Claude Code handoff** to package the agreed screens into a codebase as a starting point, **or** keep the canvas as a visual reference and run prompts `02`–`06` as written.
- Either way, prompts `02`–`06` are what add the **GSAP + Lenis + SplitText scroll animation, the pinned process section, the wizard validation/persistence, and the email submission** — the canvas defines the look; Claude Code makes it move and work.
- Reuse the exact same color/type tokens in both tools so the design and the build stay identical.

## What to keep in Claude Design vs. Claude Code
- **Claude Design:** visual direction, layout, color/type in context, component shapes, all the static screen states (incl. lightbox open, wizard steps, hover/empty/error states).
- **Claude Code:** scroll choreography, SplitText reveals, parallax, pinning, route transitions, form logic + validation, image uploads, the `/api/commission` email route, performance, accessibility wiring, and deploy.
