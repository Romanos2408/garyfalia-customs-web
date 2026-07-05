"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, SectionHeading } from "@/components/ui";

// TODO: replace with the artist's real story + real techniques/materials.
const story = [
  "It started with my own pair of shoes. I painted a character I loved onto them, wore them out, and people kept stopping me to ask where I got them. Friends asked for their own. Then friends of friends. Somewhere in there it stopped being a hobby.",
  "Now every commission is painted entirely by hand — sketched, blocked in, then built up layer by layer until it reads exactly right. I study the references closely, because the details are the whole point. A look in the eyes, the fall of a cape, the right shade of a logo.",
  "What makes a piece a Garyfalia is that it's made to be worn, not framed. Everything is sealed to flex and last, and nothing is ever repeated. Your piece is yours — the only one of its kind in the world.",
];

const craft = [
  {
    title: "Hand-painting",
    note: "Every line laid down by brush — no prints, no stencils, no shortcuts.",
  },
  {
    title: "Surface prep",
    note: "Leather is cleaned and deglazed so the paint bonds and won't crack.",
  },
  {
    title: "Angelus leather paints",
    note: "Flexible, pro-grade leather paints made to move with the shoe.",
  },
  {
    title: "Acrylics on denim",
    note: "Built up and heat-set into the fabric so the art becomes part of it.",
  },
  {
    title: "Sealing & finish",
    note: "Matte or gloss finisher locks everything in against wear and weather.",
  },
  {
    title: "One of one",
    note: "Each design is painted once, for one person, and never copied.",
  },
];

export function AboutStory() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      els.forEach((el) =>
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: EASE.out,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <Container>
        {/* the story */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div data-reveal>
              <SectionHeading eyebrow="The story" title="How it started." />
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            {story.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="measure text-lg leading-relaxed text-ink/70"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* craft & materials */}
        <div className="mt-24 border-t border-mist pt-16 sm:mt-28">
          <div data-reveal>
            <SectionHeading
              eyebrow="Craft & materials"
              title="Built to be worn."
              lead="The work is only as good as what goes into it. Here's what every piece is made with."
            />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {craft.map((c, i) => (
              <div key={c.title} data-reveal className="flex gap-4">
                <span className="font-display text-lg text-stone tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                    {c.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
