/**
 * The portfolio. Each entry renders a gallery card + lightbox with zero other
 * code changes.
 *
 * HOW TO EDIT:
 *  • Add / remove / reorder pieces  → edit this array (order here = order shown).
 *  • Change which appear on the home "Featured" strip → toggle `featured: true`.
 *  • Add a new filter category (e.g. "accessory") → add it to `CommissionType`
 *    below and to `galleryFilters`; the gallery filter bar derives from there.
 *  • Swap an image → drop a file in /public/content/gallery and update `image`.
 *
 * Images are uniform 4:5 (1600×2000) transparent PNGs, shown object-contain in
 * a cream frame, so nothing is ever cropped.
 */

export type CommissionType = "sneaker" | "jacket";

export interface GalleryItem {
  id: string;
  /** url-safe id, also used as the lightbox hash target */
  slug: string;
  title: string;
  type: CommissionType;
  /** the blank canvas the art lives on */
  base: string;
  description: string;
  materials: string;
  year: number;
  /** path under /public */
  image: string;
  /** descriptive alt text for the artwork (a11y) */
  alt: string;
  featured?: boolean;
}

export const IMAGE_RATIO = { w: 1600, h: 2000 } as const;

export const gallery: GalleryItem[] = [
  {
    id: "dawn",
    slug: "dawn",
    title: "Dawn",
    type: "sneaker",
    base: "Nike Air Force 1",
    description:
      "Itachi and the red-cloud crew, hand-painted across the panels — a quiet, deliberate tribute for a die-hard Naruto fan.",
    materials: "Leather AF1, Angelus leather paints, matte sealant",
    year: 2024,
    image: "/content/gallery/photo-08-nobg.webp",
    alt: "White Nike Air Force 1 sneakers hand-painted with Naruto Akatsuki characters and red clouds",
    featured: true,
  },
  {
    id: "starlight",
    slug: "starlight",
    title: "Starlight",
    type: "jacket",
    base: "Denim jacket",
    description:
      "A celestial guardian painted across the back panel in cool blues and silver — stars dusted into the denim by hand.",
    materials: "Denim jacket, acrylics, heat-set + sealed",
    year: 2024,
    image: "/content/gallery/photo-09-nobg.webp",
    alt: "Blue denim jacket with a celestial anime guardian painted across the back in blues and silver",
    featured: true,
  },
  {
    id: "bohemian",
    slug: "bohemian",
    title: "Bohemian",
    type: "sneaker",
    base: "Nike Air Force 1",
    description:
      "Two panels, two eras of Freddie — a line-art portrait on one shoe, a full-colour stage moment on the other.",
    materials: "Leather AF1, Angelus leather paints, matte sealant",
    year: 2023,
    image: "/content/gallery/photo-02-nobg.webp",
    alt: "Pair of white Air Force 1 sneakers hand-painted with portraits of Freddie Mercury",
    featured: true,
  },
  {
    id: "the-founding",
    slug: "the-founding",
    title: "The Founding",
    type: "jacket",
    base: "Black denim jacket",
    description:
      "The Attack Titan rising out of smoke on washed black denim — high contrast, lots of texture, built to be worn loud.",
    materials: "Black denim jacket, acrylics, heat-set + sealed",
    year: 2025,
    image: "/content/gallery/photo-13-nobg.webp",
    alt: "Black denim jacket painted with the Attack on Titan titan emerging from smoke",
    featured: true,
  },
  {
    id: "nezuko",
    slug: "nezuko",
    title: "Nezuko",
    type: "sneaker",
    base: "Nike Court Vision",
    description:
      "Soft cherry-blossom wash with Nezuko across both sides — a gentler palette that still reads from across the room.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2024,
    image: "/content/gallery/photo-06-nobg.webp",
    alt: "White Nike sneakers hand-painted with the Demon Slayer character Nezuko on a pink blossom background",
    featured: true,
  },
  {
    id: "pillars",
    slug: "pillars",
    title: "Pillars",
    type: "jacket",
    base: "Denim jacket",
    description:
      "The Hashira, reduced to their eyes — five stacked colour blocks across the back, each one its own character study.",
    materials: "Denim jacket, acrylics, heat-set + sealed",
    year: 2025,
    image: "/content/gallery/photo-01_2-nobg.webp",
    alt: "Blue denim jacket with the eyes of the Demon Slayer Hashira painted in stacked colour blocks",
    featured: true,
  },
  {
    id: "wano",
    slug: "wano",
    title: "Wano",
    type: "sneaker",
    base: "Nike Court Vision",
    description:
      "The Straw Hats in their Wano arc fits — mixed line-art and full colour wrapping around both shoes.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2024,
    image: "/content/gallery/photo-07-nobg.webp",
    alt: "White Nike sneakers painted with One Piece characters Luffy and Zoro in their Wano outfits",
  },
  {
    id: "crimson-moon",
    slug: "crimson-moon",
    title: "Crimson Moon",
    type: "sneaker",
    base: "Nike Air Force 1",
    description:
      "Uchiha brothers against a deep red moon — heavy blacks, one accent colour, nothing wasted.",
    materials: "Leather AF1, Angelus leather paints, matte sealant",
    year: 2025,
    image: "/content/gallery/photo-12-nobg.webp",
    alt: "White Air Force 1 sneakers painted with Naruto Uchiha characters against a red moon",
  },
  {
    id: "brothers",
    slug: "brothers",
    title: "Brothers",
    type: "sneaker",
    base: "adidas low-tops",
    description:
      "Ace, Luffy and Sabo together — a warm, story-first piece for someone who grew up on the manga.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2023,
    image: "/content/gallery/photo-11-nobg.webp",
    alt: "White adidas sneakers painted with the One Piece brothers Ace, Luffy and Sabo",
  },
  {
    id: "kamehameha",
    slug: "kamehameha",
    title: "Kamehameha",
    type: "sneaker",
    base: "Low-top sneakers",
    description:
      "Goku, the turtle kanji and a scatter of dragon balls — clean black line-work on white, with orange pops.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2023,
    image: "/content/gallery/photo-03-nobg.webp",
    alt: "White low-top sneakers painted with Dragon Ball Goku, the turtle kanji and dragon balls",
  },
  {
    id: "vision",
    slug: "vision",
    title: "Vision",
    type: "sneaker",
    base: "Nike Court Vision",
    description:
      "The companion to the Starlight jacket — the same celestial character, reworked to wrap a pair of sneakers.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2024,
    image: "/content/gallery/photo-10-nobg.webp",
    alt: "White Nike sneakers painted with a celestial anime character in blues and lilac",
  },
  {
    id: "wanted",
    slug: "wanted",
    title: "Wanted",
    type: "sneaker",
    base: "Nike Court Vision",
    description:
      "Zoro on a torn 'WANTED' poster motif — sandy, washed tones for a more vintage feel.",
    materials: "Leather sneaker, Angelus leather paints, matte sealant",
    year: 2025,
    image: "/content/gallery/photo-14-nobg.webp",
    alt: "White Nike sneakers painted with One Piece Zoro on a torn wanted poster",
  },
  {
    id: "cat-and-mouse",
    slug: "cat-and-mouse",
    title: "Cat & Mouse",
    type: "sneaker",
    base: "Nike Air Force 1",
    description:
      "Tom and Jerry mid-chase across a cheese-and-blue backdrop — a playful all-over print, fun front to back.",
    materials: "Leather AF1, Angelus leather paints, matte sealant",
    year: 2023,
    image: "/content/gallery/photo-15-nobg.webp",
    alt: "White Air Force 1 sneakers painted all over with Tom and Jerry on a blue and cheese background",
  },
  {
    id: "te-fiti",
    slug: "te-fiti",
    title: "Te Fiti",
    type: "sneaker",
    base: "Kids' sneakers",
    description:
      "A Moana set sized for little feet — Maui, Pua and Heihei tucked around the toe and heel.",
    materials: "Kids' sneakers, Angelus leather paints, matte sealant",
    year: 2024,
    image: "/content/gallery/photo-05-nobg.webp",
    alt: "Children's white sneakers painted with Moana characters Maui, Pua and Heihei",
  },
];

/** Home + about pull from here. */
export const featuredGallery = gallery.filter((g) => g.featured);

/** Filter bar options. Add a category here + to CommissionType to extend. */
export const galleryFilters: { label: string; value: "all" | CommissionType }[] =
  [
    { label: "All", value: "all" },
    { label: "Sneakers", value: "sneaker" },
    { label: "Jackets", value: "jacket" },
  ];

export function getGalleryItem(slug: string): GalleryItem | undefined {
  return gallery.find((g) => g.slug === slug);
}
