"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Button } from "@/components/ui";

export function GetYourOwn() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const heading = headingRef.current;
      if (!heading) return;
      const subChildren = subRef.current
        ? Array.from(subRef.current.children)
        : [];

      if (reduce) {
        gsap.set([heading, ...subChildren], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(heading, { autoAlpha: 0 });
      gsap.set(subChildren, { autoAlpha: 0, y: 20 });

      let split: InstanceType<typeof SplitText> | null = null;
      const build = () => {
        if (!headingRef.current) return;
        split = new SplitText(headingRef.current, {
          type: "words,lines",
          mask: "lines",
        });
        gsap.set(heading, { autoAlpha: 1 });
        gsap.from(split.words, {
          yPercent: 120,
          duration: 0.85,
          ease: EASE.out,
          stagger: 0.05,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        });
        gsap.to(subChildren, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.out,
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 58%" },
        });
      };
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);

      return () => split?.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="marble-veins relative overflow-hidden bg-navy-deep text-marble"
    >
      <Container className="flex flex-col items-center py-28 text-center sm:py-36">
        <h2
          ref={headingRef}
          className="max-w-[16ch] text-[length:var(--text-display)] font-light leading-[1.05] text-marble"
        >
          Bring me your blank canvas.
        </h2>
        <div ref={subRef} className="flex flex-col items-center">
          <p className="measure mt-7 text-lg leading-relaxed text-marble/70">
            Tell me what you love and what you want it on. I&rsquo;ll turn it
            into something only you own.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/commission" size="lg" variant="light">
              Get Your Own
            </Button>
            <Button href="/gallery" size="lg" variant="ghostLight">
              See the gallery
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
