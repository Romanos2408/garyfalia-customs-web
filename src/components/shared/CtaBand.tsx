"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Button } from "@/components/ui";

/**
 * The recurring dark-navy invitation band used to close the gallery + about
 * pages. Matches the home "Get Your Own" styling; lighter motion (no SplitText).
 */
export function CtaBand({
  title,
  copy,
  primaryLabel = "Get Yours Now",
  primaryHref = "/commission",
  secondary,
}: {
  title: string;
  copy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondary?: { label: string; href: string };
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const els = gsap.utils.toArray<HTMLElement>("[data-cta-reveal]", ref.current);
      gsap.from(els, {
        autoAlpha: 0,
        y: 26,
        duration: 0.8,
        ease: EASE.out,
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="marble-veins relative overflow-hidden bg-navy-deep text-marble"
    >
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <h2
          data-cta-reveal
          className="max-w-[18ch] text-[length:var(--text-display)] font-light leading-[1.05] text-marble"
        >
          {title}
        </h2>
        {copy ? (
          <p
            data-cta-reveal
            className="measure mt-6 text-lg leading-relaxed text-marble/70"
          >
            {copy}
          </p>
        ) : null}
        <div
          data-cta-reveal
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button href={primaryHref} size="lg" variant="light">
            {primaryLabel}
          </Button>
          {secondary ? (
            <Button href={secondary.href} size="lg" variant="ghostLight">
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
