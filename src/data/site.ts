/**
 * Single source of truth for brand basics, contact + socials.
 * Edit these and they update across the whole site.
 */
export const site = {
  name: "Garyfalia Customs",
  /** Hero / headline line. */
  tagline: "Wearable art, made by hand.",
  /** One-sentence "what I do". */
  intro:
    "Hand-painted custom sneakers and denim jackets — one-of-one pieces, painted to order.",
  /** Owner inbox for commission requests (also the .env fallback). */
  email: "hello@garyfaliacustoms.com",
  instagram: {
    handle: "@garyfalia.customs",
    url: "https://instagram.com/garyfalia.customs",
  },
  location: "Athens, Greece",
  /** TODO: confirm the real "we'll reply within…" window. */
  responseTime: "2–3 days",
  /** Canonical site URL (used for metadata / OG / sitemap). TODO: real domain. */
  url: "https://garyfaliacustoms.com",
} as const;

/** Primary navigation, reused by header + footer. */
export interface NavLink {
  label: string;
  href: string;
  /** rendered as a prominent button instead of a plain link */
  cta?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Get a Commission", href: "/commission", cta: true },
];
