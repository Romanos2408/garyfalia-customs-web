"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, SectionHeading } from "@/components/ui";
import { PieceFrame } from "@/components/gallery/PieceFrame";
import { featuredGallery } from "@/data/gallery";

const picks = featuredGallery.slice(0, 3);

export function SignatureStrip() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      cards.forEach((c) =>
        gsap.from(c, {
          autoAlpha: 0,
          y: 32,
          duration: 0.7,
          ease: EASE.out,
          scrollTrigger: { trigger: c, start: "top 88%", once: true },
        }),
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-marble pb-24 sm:pb-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Signature pieces" title="A few I'm proud of." />
          <Link
            href="/gallery"
            className="text-sm font-medium text-navy underline-offset-4 hover:underline"
          >
            See the full gallery →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {picks.map((item, i) => (
            <Link
              key={item.id}
              href="/gallery"
              data-reveal
              className="group block"
            >
              <PieceFrame
                item={item}
                priority={i === 0}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="flex items-baseline justify-between gap-3 pt-3">
                <h3 className="font-display text-lg font-medium text-ink">
                  {item.title}
                </h3>
                <span className="shrink-0 text-sm text-stone">{item.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
