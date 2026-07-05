"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Eyebrow } from "@/components/ui";

export function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const heading = headingRef.current;
      if (!heading) return;
      const copyEls = copyRef.current
        ? gsap.utils.toArray<HTMLElement>("[data-stagger]", copyRef.current)
        : [];

      if (reduce) {
        gsap.set([heading, ...copyEls], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(heading, { autoAlpha: 0 });
      gsap.set(copyEls, { autoAlpha: 0, y: 22 });

      let split: InstanceType<typeof SplitText> | null = null;
      const build = () => {
        if (!headingRef.current) return;
        split = new SplitText(headingRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(heading, { autoAlpha: 1 });
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .from(split.lines, { yPercent: 115, duration: 0.95, stagger: 0.12 })
          .to(copyEls, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.4);
      };
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);

      // portrait parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to("[data-portrait]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => {
        split?.revert();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="pt-[calc(var(--header-h)+3rem)]"
    >
      <Container className="grid grid-cols-1 items-center gap-12 pb-20 lg:grid-cols-12 lg:gap-16">
        {/* portrait */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-mist bg-paper shadow-lift lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.6),transparent_55%)]"
            />
            {/* TODO: replace with a real portrait of the artist (or hands at work). */}
            <div data-portrait className="absolute inset-[-6%]">
              <Image
                src="/content/gallery/photo-01_1-nobg.webp"
                alt="Garyfalia wearing one of her hand-painted denim jackets"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-contain p-[6%]"
              />
            </div>
          </div>
        </div>

        {/* intro copy */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <Eyebrow>The artist</Eyebrow>
          <h1
            ref={headingRef}
            className="mt-6 text-[length:var(--text-display)] font-light leading-[1.04] text-ink"
          >
            Hi, I&rsquo;m Garyfalia.
          </h1>
          <div ref={copyRef} className="mt-6">
            <p
              data-stagger
              className="measure text-xl leading-relaxed text-ink/70"
            >
              I paint the things people love — anime, music, characters, the
              little details that mean something — onto sneakers and denim, so
              they can wear them every day.
            </p>
            <p
              data-stagger
              className="measure mt-4 text-base leading-relaxed text-ink/70"
            >
              Every piece is made to order and one of one. No two ever leave the
              studio the same.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
