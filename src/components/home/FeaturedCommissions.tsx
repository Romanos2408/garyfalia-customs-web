"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Button, SectionHeading, Badge } from "@/components/ui";
import { PieceFrame } from "@/components/gallery/PieceFrame";
import { featuredGallery } from "@/data/gallery";

// a curated, deliberately uneven set
const items = featuredGallery.slice(0, 5);
const layout = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-20",
  "lg:col-span-4",
  "lg:col-span-4 lg:mt-12",
  "lg:col-span-4 lg:mt-4",
];

export function FeaturedCommissions() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const cards = gsap.utils.toArray<HTMLElement>("[data-reveal]", sectionRef.current);

      if (reduce) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      // reveal each card as it enters — a per-card trigger fires reliably even
      // when the card is already in view on load (deep-link / scroll restore).
      cards.forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: EASE.out,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });

      // gentle internal image parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -3.5 },
            {
              yPercent: 3.5,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-marble py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              A few favourites <span className="text-ink/55">— recently made.</span>
            </>
          }
          lead="Each piece is painted to order, one of one. Here are some that left the studio lately."
        />

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href="/gallery"
              data-reveal
              className={`group block ${layout[i] ?? "lg:col-span-4"}`}
            >
              <PieceFrame
                item={item}
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
              <div className="flex items-baseline justify-between gap-4 pt-4">
                <h3 className="font-display text-xl font-medium text-ink">
                  {item.title}
                </h3>
                <span className="shrink-0 text-sm text-stone">
                  {item.base} · {item.year}
                </span>
              </div>
              <div className="pt-2">
                <Badge>{item.type}</Badge>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/commission" size="lg">
            Get Yours Now
          </Button>
          <Button href="/gallery" size="lg" variant="ghost">
            View Full Gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}
