# Garyfalia Customs — Build Pack for Claude Code (Opus 4.8)

This folder contains a sequence of ready-to-paste prompts for building the **Garyfalia Customs** website — a portfolio + commission site for a custom sneaker & jacket artist.

Feed the files into Claude Code **in order**. Each one builds on the project state created by the previous prompt, so don't skip ahead.

---

## The website at a glance

**Pages**
1. **Home** — animated, scroll-driven. Sections in order: Hero → Featured Commissions (gallery sample) → The Process (how to buy) → Get Your Own (CTA) → Footer.
2. **Gallery** — full filterable portfolio (sneakers / jackets), lightbox, "Get Yours Now" CTA.
3. **About** — the artist's story, craft, materials.
4. **Commission ("Get a Commission")** — the multi-step order flow. This is the priority page; it must feel better than the previous version.

**Look & feel**
- Marble-white / warm off-white backgrounds, deep **navy blue** primary (navy green provided as a one-line swap).
- Editorial, gallery-like, "wearable art" energy.
- Smooth scroll + tasteful motion, never gimmicky.

**Animation stack**
- **GSAP** + **ScrollTrigger** (scroll-driven reveals, pinned process section, parallax)
- **SplitText** (headline character/word/line reveals — now 100% free, no Club membership)
- **Lenis** (buttery smooth scroll, synced to GSAP's ticker)

---

## The chosen tech stack (assumption — read this)

These prompts assume:

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **GSAP 3.13+** with `@gsap/react` (`useGSAP` hook) — install from the public npm package, no auth token needed
- **Lenis** (the `lenis` package — *not* the deprecated `@studio-freight/lenis`)
- Deployment on **Vercel**

**Why Next.js:** multiple pages + an interactive multi-step commission form (which benefits from a server route for sending the order by email) make a React framework the cleanest fit, and it deploys in one click.

**If you'd rather use something else** (Astro, or plain Vite + vanilla JS), tell Claude Code at the start of prompt `01`: *"Use [Astro / Vite + vanilla JS] instead of Next.js; keep the same design system, sections, and animation stack."* Everything else in this pack still applies.

---

## How to use this pack

1. Open Claude Code in an **empty project folder**.
2. Paste the contents of **`01-setup-and-design-system.md`** as your first message. Let it finish, then run the dev server and look at it.
3. Continue with `02` → `03` → `04` → `05` → `06`, pasting each in turn. Review and run after each.
4. After each page, glance at it on **mobile width** and with **reduced motion** on — the prompts ask for both, but verify.

Tip: after pasting a prompt, you can add a line like *"Before coding, give me a short plan and the file list you'll create, then proceed."* Opus 4.8 handles this well and it keeps the build legible.

---

## Content you need to supply (gather this first)

Claude Code will scaffold everything with **tasteful placeholders**, but the site only comes alive with the real material. Have these ready (drop them in a `/public/content` folder and point Claude Code at them):

- [ ] **Brand basics:** exact spelling of the name, tagline/one-liner, short "what I do" sentence.
- [ ] **Logo** (SVG preferred) or just the wordmark text if there isn't one yet.
- [ ] **Gallery images** of past commissions — ideally 8–16. For each: title, type (sneaker/jacket), 1–2 line description, materials, year. High-res, roughly square or 4:5.
- [ ] **A few "hero" images** — your best 1–3 pieces for the home hero / featured strip.
- [ ] **About page:** a photo of you (or your hands at work), 2–4 short paragraphs of story, your materials/techniques, anything that signals craft.
- [ ] **The Process steps:** confirm the buying steps (a default 5-step flow is provided — edit to match how you actually work).
- [ ] **Contact + socials:** Instagram handle (key for an artist), email, optional TikTok, location/country, response time.
- [ ] **Where commission requests should go:** an email address. (Setup details in prompt `05`.)

Anything missing can be filled later — placeholders are clearly marked so they're easy to find and replace.

---

## File index

| File | What it does |
|---|---|
| `00-START-HERE.md` | This guide |
| `01-setup-and-design-system.md` | Scaffold the project, install GSAP/Lenis, lock in colors, fonts, motion, layout shell, smooth-scroll provider |
| `02-home-page.md` | The animated home page and all its scroll sections |
| `03-gallery-page.md` | Full filterable gallery + lightbox |
| `04-about-page.md` | About / artist story page |
| `05-commission-page.md` | The multi-step "Get a Commission" order flow (priority) |
| `06-navigation-and-polish.md` | Nav + mobile menu, page transitions, SEO, accessibility, performance, deploy |
| `07-claude-design-brief.md` | *(Optional)* Per-screen briefs for the **Claude Design** canvas — explore the look first, then hand off to Claude Code |

Build well. 🤍
