/**
 * /lab — six STRUCTURALLY different hero layouts to compare on the web.
 * These differ in composition (where text and work sit), not just in the reveal.
 * The production home at "/" is untouched.
 */
export type LabVariantId =
  | "inksim"
  | "bloom"
  | "motion"
  | "twocol"
  | "fullbleed"
  | "split"
  | "centered"
  | "galleryrow"
  | "stacked";

export interface LabVariant {
  id: LabVariantId;
  n: number;
  name: string;
  blurb: string;
  recommended?: boolean;
}

export const labVariants: LabVariant[] = [
  {
    id: "inksim",
    n: 1,
    name: "Live ink simulation (WebGL)",
    blurb:
      "A real GPU fluid sim (ported from Volcomix/ink-drop). Scrolling injects navy ink that blooms and disperses live — crisp at any size, truly evolving. Text parallaxes.",
    recommended: true,
  },
  {
    id: "bloom",
    n: 2,
    name: "Bloom-in (scroll-scrubbed video)",
    blurb:
      "A real ink-into-clear-water clip scrubbed by scroll — it builds from nothing as you go down, rewinds as you go up. Crisper clip, dark text, text parallax.",
  },
  {
    id: "motion",
    n: 3,
    name: "Motion-Driven (Framer Motion)",
    blurb:
      "Built with Framer Motion per the ui-ux-pro-max brief: spring word-reveal, a cursor-tilting art frame, magnetic CTAs, a floating accent — visuals-first, reduced-motion aware.",
  },
  {
    id: "twocol",
    n: 4,
    name: "Two-column",
    blurb:
      "The current shape — text left, a framed piece right. Here as the baseline to compare against.",
  },
  {
    id: "fullbleed",
    n: 5,
    name: "Full-bleed cover",
    blurb:
      "One large image filling the hero, headline laid over it. Immersive, magazine-cover energy.",
  },
  {
    id: "split",
    n: 6,
    name: "Split screen",
    blurb:
      "A hard 50/50 — text on marble at left, a full-height image bleeding off the right edge.",
  },
  {
    id: "centered",
    n: 7,
    name: "Type-led, centered",
    blurb:
      "The words are the hero: a huge centred headline, with a piece peeking up behind it.",
  },
  {
    id: "galleryrow",
    n: 8,
    name: "Gallery row",
    blurb:
      "Headline up top, then a row of real pieces that slides sideways as you scroll. The work is the hero.",
  },
  {
    id: "stacked",
    n: 9,
    name: "Stacked editorial",
    blurb:
      "An oversized headline across the full width, with pieces arranged like a magazine spread below.",
  },
];

export function getLabVariant(id: string): LabVariant | undefined {
  return labVariants.find((v) => v.id === id);
}
