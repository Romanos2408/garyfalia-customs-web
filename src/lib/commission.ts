import { z } from "zod";

/* ============================================================================
   Commission flow — config + validation, shared by the wizard and the API
   route so the rules live in ONE place.

   WHERE TO EDIT:
   • Item types ............. ITEM_TYPES
   • Sneaker model cards .... SNEAKER_MODELS
   • Size pills ............. SHOE_SIZES / JACKET_SIZES
   • Colour swatches ........ COLOR_SWATCHES
   • Style tags ............. STYLE_TAGS
   • Design approaches ...... DESIGN_APPROACHES
   • PRICE TIERS ............ TIERS  (← placeholder ranges, confirm before launch)
   • Currency symbol ........ CURRENCY
   • "We'll reply within…" .. REPLY_WITHIN
   • Upload limits .......... MAX_FILES / MAX_FILE_MB / ACCEPTED_IMAGE_TYPES
   ========================================================================== */

export const CURRENCY = "€";

/** How soon the owner replies — shown on the success screen. TODO: confirm. */
export const REPLY_WITHIN = "2–3 days";

export const ITEM_TYPES = [
  {
    value: "sneaker",
    label: "Sneakers",
    blurb: "A pair painted to order — AF1s, Vision, your own pair.",
  },
  {
    value: "jacket",
    label: "Jacket",
    blurb: "A denim (or other) jacket with art across the back.",
  },
  {
    value: "other",
    label: "Something else",
    blurb: "Vans, a bag, a helmet, a one-off — tell me what you have in mind.",
  },
] as const;

/** Quick-pick sneaker silhouettes shown as cards when "Sneakers" is chosen.
    Selecting one sets `sneakerModel`; "own" also flips supply to the customer. */
export const SNEAKER_MODELS = [
  { value: "Nike Air Force 1", label: "Air Force 1", desc: "The classic white canvas" },
  { value: "Nike Court Vision", label: "Court Vision", desc: "Clean, minimal, great value" },
  { value: "Air Jordan 1", label: "Jordan 1", desc: "Iconic — more area to paint" },
  { value: "My own pair", label: "My own pair", desc: "Send me a pair you own", own: true },
] as const;

export const GENDERS = ["Men", "Women", "Unisex"] as const;
export const BASE_COLORS = ["White", "Black"] as const;

/** Size pills. EU + US for shoes; letter sizes for jackets. */
export const SHOE_SIZES = {
  EU: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
  US: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
} as const;

export const JACKET_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

/** Colour swatch grid (multi-select). Names are stored; hex is for the chip. */
export const COLOR_SWATCHES = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#E53935" },
  { name: "Blue", hex: "#1E88E5" },
  { name: "Green", hex: "#43A047" },
  { name: "Yellow", hex: "#FDD835" },
  { name: "Orange", hex: "#FB8C00" },
  { name: "Purple", hex: "#8E24AA" },
  { name: "Pink", hex: "#EC407A" },
  { name: "Gold", hex: "#C8A97E" },
  { name: "Teal", hex: "#00897B" },
  { name: "Brown", hex: "#6D4C41" },
] as const;

export const STYLE_TAGS = [
  "Bold / graphic",
  "Minimal",
  "Anime",
  "Abstract",
  "Lettering",
  "Nature",
  "Portrait",
  "Custom",
] as const;

/** How the customer wants to share their design. */
export const DESIGN_APPROACHES = [
  { value: "mockup", title: "I have a mockup", desc: "Upload a finished design" },
  { value: "reference", title: "Reference images", desc: "Share inspiration to work from" },
  { value: "describe", title: "I'll describe it", desc: "Tell me the vision in words" },
] as const;

/* ----------------------------------------------------------------- tiers */

export interface Tier {
  value: string;
  name: string;
  tagline: string;
  blurb: string;
  popular?: boolean;
  /** What's included — shown on the home pricing section. */
  includes: string[];
  /** Lowest "from" price — used by the compact hero strip. PLACEHOLDER. */
  from: string;
  /** Indicative ranges per item category. PLACEHOLDERS — confirm before launch. */
  price: { sneaker: string; jacket: string; other: string };
}

export const TIERS: Tier[] = [
  {
    value: "standard",
    name: "Standard",
    tagline: "Clean, single-subject",
    blurb: "One clear subject or motif, crisp linework, a focused palette.",
    includes: ["One main subject or motif", "Up to ~3 colours", "Linework + flat colour"],
    from: `${CURRENCY}120`,
    price: {
      sneaker: `${CURRENCY}120–180`,
      jacket: `${CURRENCY}160–240`,
      other: `from ${CURRENCY}120`,
    },
  },
  {
    value: "premium",
    name: "Premium",
    tagline: "Detailed, full-colour",
    blurb: "Multi-colour shading and detail, more coverage — the popular choice.",
    popular: true,
    includes: ["Multi-subject / scene", "Full colour + shading", "More coverage per piece"],
    from: `${CURRENCY}180`,
    price: {
      sneaker: `${CURRENCY}180–280`,
      jacket: `${CURRENCY}240–360`,
      other: `from ${CURRENCY}220`,
    },
  },
  {
    value: "deluxe",
    name: "Deluxe",
    tagline: "Full-coverage showpiece",
    blurb: "Edge-to-edge work, portraits, gold leaf, premium materials.",
    includes: ["Edge-to-edge coverage", "Portraits & fine detail", "Gold leaf / premium finishes"],
    from: `${CURRENCY}300`,
    price: {
      sneaker: `${CURRENCY}300+`,
      jacket: `${CURRENCY}380+`,
      other: `from ${CURRENCY}350`,
    },
  },
];

export const CONTACT_METHODS = ["Email", "Instagram"] as const;

export const MAX_FILES = 5;
export const MAX_FILE_MB = 8;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
];

/* ----------------------------------------------------------------- types */

export type ItemType = (typeof ITEM_TYPES)[number]["value"];

export interface CommissionForm {
  // 1 — item
  itemType: ItemType | "";
  sneakerModel: string;
  jacketType: string;
  otherItem: string;
  supplyItem: "" | "yes" | "no";
  // 2 — design
  designApproach: "" | "mockup" | "reference" | "describe";
  vision: string;
  styleTags: string[];
  selectedColors: string[];
  colors: string;
  // 3 — size & fit
  shoeSizeUnit: "US" | "EU";
  shoeSize: string;
  gender: string;
  baseColor: string;
  jacketSize: string;
  otherSize: string;
  neededBy: string;
  isGift: boolean;
  // 4 — tier & timeline
  tier: string;
  timeline: "" | "flexible" | "specific";
  timelineDate: string;
  // 5 — details
  name: string;
  email: string;
  phone: string;
  instagram: string;
  howFound: string;
  contactMethod: "" | "Email" | "Instagram";
  country: string;
  notes: string;
  consent: boolean;
  // anti-spam honeypot (must stay empty)
  company: string;
}

export const initialForm: CommissionForm = {
  itemType: "",
  sneakerModel: "",
  jacketType: "",
  otherItem: "",
  supplyItem: "",
  designApproach: "",
  vision: "",
  styleTags: [],
  selectedColors: [],
  colors: "",
  shoeSizeUnit: "EU",
  shoeSize: "",
  gender: "",
  baseColor: "",
  jacketSize: "",
  otherSize: "",
  neededBy: "",
  isGift: false,
  tier: "",
  timeline: "",
  timelineDate: "",
  name: "",
  email: "",
  phone: "",
  instagram: "",
  howFound: "",
  contactMethod: "",
  country: "",
  notes: "",
  consent: false,
  company: "",
};

/* --------------------------------------------------------------- helpers */

/** The indicative price range for the current tier + item, or "" if no tier. */
export function estimateFor(f: CommissionForm): string {
  const tier = TIERS.find((t) => t.value === f.tier);
  if (!tier) return "";
  const key =
    f.itemType === "jacket" ? "jacket" : f.itemType === "other" ? "other" : "sneaker";
  return tier.price[key];
}

/* ------------------------------------------------------------ validation */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const STEP_TITLES = [
  "What are we making?",
  "Your design",
  "Size & fit",
  "Choose your tier",
  "Your details",
] as const;

export const STEP_LABELS = ["Item", "Design", "Size", "Tier", "Details"] as const;

export const TOTAL_STEPS = STEP_TITLES.length;

/**
 * Per-step required-field validation. Returns a map of fieldName -> message
 * for the given step (empty = valid). Only the few genuinely-required fields
 * block progress; everything else is optional but encouraged.
 */
export function validateStep(
  step: number,
  f: CommissionForm,
): Record<string, string> {
  const e: Record<string, string> = {};
  const trimmed = (s: string) => s.trim();

  if (step === 0) {
    if (!f.itemType) e.itemType = "Pick what you'd like made.";
    if (f.itemType === "other" && !trimmed(f.otherItem))
      e.otherItem = "Tell me what the item is.";
  }

  if (step === 1) {
    if (!f.designApproach)
      e.designApproach = "Pick how you'd like to share your design.";
    // a written brief is required unless they're uploading a finished mockup
    if (f.designApproach && f.designApproach !== "mockup" && trimmed(f.vision).length < 10)
      e.vision = "A sentence or two about your idea helps a lot.";
  }

  // step 2 (size) and step 3 (tier) are optional — no blockers.

  if (step === 4) {
    if (!trimmed(f.name)) e.name = "Your name, please.";
    if (!trimmed(f.email)) e.email = "An email is required so I can reply.";
    else if (!EMAIL_RE.test(trimmed(f.email)))
      e.email = "That email doesn't look right.";
    if (!f.consent) e.consent = "Please tick this so I can contact you.";
  }

  return e;
}

/** Full server-side schema (defence in depth on the API route). */
export const commissionServerSchema = z.object({
  itemType: z.enum(["sneaker", "jacket", "other"]),
  sneakerModel: z.string().max(200).optional().default(""),
  jacketType: z.string().max(200).optional().default(""),
  otherItem: z.string().max(400).optional().default(""),
  supplyItem: z.enum(["yes", "no", ""]).optional().default(""),
  designApproach: z.enum(["mockup", "reference", "describe", ""]).optional().default(""),
  vision: z.string().trim().max(4000).optional().default(""),
  styleTags: z.array(z.string()).optional().default([]),
  selectedColors: z.array(z.string()).optional().default([]),
  colors: z.string().max(400).optional().default(""),
  shoeSizeUnit: z.enum(["US", "EU"]).optional().default("EU"),
  shoeSize: z.string().max(40).optional().default(""),
  gender: z.string().max(40).optional().default(""),
  baseColor: z.string().max(40).optional().default(""),
  jacketSize: z.string().max(80).optional().default(""),
  otherSize: z.string().max(120).optional().default(""),
  neededBy: z.string().max(40).optional().default(""),
  isGift: z.boolean().optional().default(false),
  tier: z.string().max(40).optional().default(""),
  timeline: z.enum(["flexible", "specific", ""]).optional().default(""),
  timelineDate: z.string().max(40).optional().default(""),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().regex(EMAIL_RE).max(200),
  phone: z.string().max(40).optional().default(""),
  instagram: z.string().max(120).optional().default(""),
  howFound: z.string().max(120).optional().default(""),
  contactMethod: z.enum(["Email", "Instagram", ""]).optional().default(""),
  country: z.string().max(120).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  consent: z.literal(true),
});

export type CommissionPayload = z.infer<typeof commissionServerSchema>;
