# Garyfalia Customs

Portfolio + commission website for **Garyfalia Customs**, a custom sneaker &
denim-jacket artist. Editorial, gallery-grade, "wearable art" — with a calm,
guided multi-step commission flow at its heart.

Built with **Next.js (App Router) · TypeScript · Tailwind v4 · GSAP +
ScrollTrigger + SplitText · Lenis**.

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

> **Note (this machine):** if `node`/`npm` aren't found, they live in Homebrew —
> prefix commands with `export PATH="/opt/homebrew/bin:$PATH";`.

Other scripts:

```bash
npm run build        # production build (type-check + bundle)
npm run start        # serve the production build
npm run lint         # eslint
```

---

## Pages

| Route         | What it is                                                              |
| ------------- | ----------------------------------------------------------------------- |
| `/`           | Animated home — hero, featured strip, pinned "Process", closing CTA     |
| `/gallery`    | Filterable portfolio (All / Sneakers / Jackets) with an accessible lightbox |
| `/about`      | The artist's story, craft & materials, signature pieces                 |
| `/commission` | The 5-step commission wizard (the priority page) + `/api/commission`    |

---

## Commission emails — `.env`

The form works out of the box: with **no** configuration it validates and logs
each request to the server console (so it's testable in dev). To actually
receive requests, copy `.env.example` → `.env.local` and set **one** option:

**Option 1 — Email via [Resend](https://resend.com) (recommended)**

```bash
RESEND_API_KEY=re_xxxxxxxx
COMMISSION_TO_EMAIL=hello@garyfaliacustoms.com
# "from" must be on a domain verified in Resend; leave blank to use the test sender
COMMISSION_FROM_EMAIL=Garyfalia Customs <commissions@garyfaliacustoms.com>
```

**Option 2 — No backend, POST to a form endpoint (Formspree / Zapier / Make)**

```bash
COMMISSION_WEBHOOK_URL=https://formspree.io/f/your-id
```

Delivery priority: Resend → webhook → dev console log. Reference images are sent
as email attachments (Resend) or counted in the webhook payload. A honeypot
field is included; add a captcha + rate-limit for production (see the route
handler `TODO`).

---

## Re-theme to navy green (one line)

All brand colour derives from two CSS variables. In
[`src/app/globals.css`](src/app/globals.css), swap:

```css
--navy: #16263f; /* → #15302a */
--navy-deep: #0c1a2e; /* → #0c201b */
```

The whole site (buttons, dark bands, footer, accents) re-themes instantly.

## Swap the display font

Headings use **Fraunces**. To switch to a bolder grotesque (e.g. Archivo),
edit only [`src/lib/fonts.ts`](src/lib/fonts.ts): import the new font and keep
the `--font-fraunces` CSS-variable name. Everything picks it up.

---

## Where the real content lives

| What                       | Where                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Gallery pieces             | [`src/data/gallery.ts`](src/data/gallery.ts) (add/reorder; `featured: true` puts a piece on the home strip) |
| Process / "how to buy" steps | [`src/data/process.ts`](src/data/process.ts)              |
| Brand basics, socials, email | [`src/data/site.ts`](src/data/site.ts)                    |
| Commission options          | [`src/lib/commission.ts`](src/lib/commission.ts) — item types, style tags, budget bands, currency, reply window |
| Images                      | `public/content/gallery/` (4:5 PNGs)                        |

**Remaining `TODO:` placeholders to swap for real material**

- `src/components/about/AboutIntro.tsx` — real **portrait** of the artist (currently a worn-jacket shot)
- `src/components/about/AboutStory.tsx` — real **story** copy + **techniques/materials**
- `src/data/site.ts` — confirm **location** and **response time**, real **domain** (`url`)
- `src/lib/commission.ts` — confirm the **"reply within…"** window (`REPLY_WITHIN`)
- A real OG image is generated automatically (`src/app/opengraph-image.tsx`) — edit copy there if desired

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
   (Vercel auto-detects Next.js; no build config needed).
3. **Settings → Environment Variables** — add the commission vars from above
   (`RESEND_API_KEY` + `COMMISSION_TO_EMAIL`, or `COMMISSION_WEBHOOK_URL`).
4. **Deploy.**
5. **Custom domain:** Project → **Settings → Domains** → add
   `garyfaliacustoms.com`, then point your registrar's DNS at Vercel (an
   `A`/`CNAME` record as Vercel instructs). Update `site.url` in
   `src/data/site.ts` to the live domain so metadata/sitemap are correct.

---

## Accessibility & motion

Every animation is gated behind `prefers-reduced-motion` — with it on, content
is simply visible (no scrub, pins, or transitions). The site is keyboard-
operable throughout (nav, mobile menu, gallery lightbox, the wizard), with a
skip link, visible focus, and AA-contrast text.
