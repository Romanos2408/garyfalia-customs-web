/**
 * The "how to buy" steps shown on the home Process section.
 * Reorder / rewrite freely — the home section maps straight over this array,
 * and the big step number is just the array index + 1.
 */
export interface ProcessStep {
  number: string;
  title: string;
  blurb: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Reach out",
    blurb:
      "Share your idea, the item, any references and your sizing through the commission form. The more you tell me, the better.",
  },
  {
    number: "02",
    title: "Design & quote",
    blurb:
      "We shape the concept together. You get a sketch and a clear, fixed price before anything is painted.",
  },
  {
    number: "03",
    title: "Deposit & slot",
    blurb:
      "A deposit books your spot in the queue and covers materials. You'll get an honest timeline for when it starts.",
  },
  {
    number: "04",
    title: "The making",
    blurb:
      "Painted entirely by hand, layer by layer, then heat-set and sealed to last. Progress photos along the way.",
  },
  {
    number: "05",
    title: "Delivery",
    blurb:
      "Final photos, balance settled, then your one-of-one piece is shipped or ready to collect — boxed and ready to wear.",
  },
];
