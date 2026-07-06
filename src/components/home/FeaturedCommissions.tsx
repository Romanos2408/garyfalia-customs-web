"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Button, SectionHeading, Badge } from "@/components/ui";
import { PieceFrame } from "@/components/gallery/PieceFrame";
import { featuredGallery } from "@/data/gallery";
import { asset } from "@/lib/asset";

// a curated, deliberately uneven set — 6 pieces so the mobile 3-up grid
// makes two clean rows
const items = featuredGallery.slice(0, 6);
const layout = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-20",
  "lg:col-span-5 lg:mt-6",
  "lg:col-span-7 lg:mt-14",
  "lg:col-span-6",
  "lg:col-span-6 lg:mt-10",
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
          y: 24,
          duration: 1.1,
          ease: EASE.out,
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
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
    <section ref={sectionRef} className="relative bg-marble py-24 sm:py-32">
      {/* the hero's ink continues behind the work — clearly visible where the
          hero hands off, settling into clean marble by the time the grid ends */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[120vh] overflow-hidden"
      >
        <Image
          src={asset("/content/video/ink-light-poster.webp")}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-[0.5] [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.35)_35%,transparent_70%)]"
        />
      </div>

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              A few favourites <span className="text-ink/55">— recently made.</span>
            </>
          }
          lead="Each piece is painted to order, one of one. Here are some that left the studio lately."
        />

        <div className="mt-14 grid grid-cols-3 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-10 lg:mt-20 lg:grid-cols-12">
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
                sizes="(max-width: 1024px) 33vw, 40vw"
              />
              <div className="pt-2 text-center sm:pt-4">
                <h3 className="font-display text-sm font-medium text-ink sm:text-xl">
                  {item.title}
                </h3>
                <span className="hidden text-sm text-stone sm:mt-1 sm:block">
                  {item.base} · {item.year}
                </span>
              </div>
              <div className="hidden pt-2 text-center sm:block">
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
