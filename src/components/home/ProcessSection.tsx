"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, SectionHeading } from "@/components/ui";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(-1);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const scope = sectionRef.current;
      if (!scope) return;

      const panels = gsap.utils.toArray<HTMLElement>("[data-step]", scope);
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", scope);
      const total = processSteps.length;

      const setActive = (idx: number) => {
        if (idx === activeRef.current) return;
        activeRef.current = idx;
        panels.forEach((p, i) => {
          const on = i === idx;
          p.style.opacity = on ? "1" : "0";
          p.style.transform = `translateY(${on ? 0 : i < idx ? -18 : 18}px)`;
          p.style.pointerEvents = on ? "auto" : "none";
        });
        ticks.forEach((t, i) => {
          t.dataset.on = i <= idx ? "true" : "false";
        });
      };

      // ---- mobile / reduced motion: simple vertical timeline reveal ----
      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-m-step]",
          scope,
        );
        if (reduce) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
          gsap.set("[data-m-line]", { scaleY: 1 });
          return;
        }
        gsap.set(items, { autoAlpha: 0, y: 30 });
        items.forEach((el) => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
        gsap.fromTo(
          "[data-m-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-m-track]",
              start: "top 70%",
              end: "bottom 80%",
              scrub: true,
            },
          },
        );
      });

      // ---- desktop: pinned, scrub-driven sequence ----
      mm.add("(min-width: 1024px)", () => {
        // initialise panels stacked, first one visible
        panels.forEach((p) => {
          p.style.transition =
            "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)";
        });
        setActive(0);

        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          // ~0.55 viewport of scroll per step — long enough to read, short
          // enough that it never feels like the page has stopped scrolling.
          end: () => "+=" + window.innerHeight * (total * 0.55),
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (fillRef.current) {
              fillRef.current.style.transform = `scaleY(${p})`;
            }
            const idx = Math.min(total - 1, Math.floor(p * total));
            setActive(idx);
          },
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-marble">
      {/* ===================== desktop (pinned) ===================== */}
      <div className="hidden lg:block">
        <div ref={pinRef} className="relative h-svh overflow-hidden">
          <Container className="grid h-full grid-cols-2 items-center gap-16">
            {/* left — heading + progress list */}
            <div>
              <SectionHeading
                eyebrow="How it works"
                as="h2"
                title={
                  <>
                    From idea to icon.
                  </>
                }
                lead="Five simple steps, from the first message to a finished, one-of-one piece in your hands."
              />

              <div className="relative mt-12 pl-9">
                {/* track + fill (decorative, kept outside the list) */}
                <span className="absolute left-[6px] top-1 bottom-1 w-px bg-mist" />
                <span
                  ref={fillRef}
                  className="absolute left-[6px] top-1 h-[calc(100%-0.5rem)] w-px origin-top scale-y-0 bg-navy"
                />
                <ol className="relative space-y-7">
                {processSteps.map((s, i) => (
                  <li
                    key={s.number}
                    data-tick={i}
                    data-on="false"
                    className="group relative flex items-center gap-4 [&[data-on='true']_.dot]:border-navy [&[data-on='true']_.dot]:bg-navy [&[data-on='true']_.lab]:text-ink"
                  >
                    <span className="dot absolute -left-9 h-3.5 w-3.5 rounded-full border-2 border-mist bg-marble transition-colors duration-300" />
                    <span className="lab text-sm font-medium uppercase tracking-[0.16em] text-stone transition-colors duration-300">
                      {s.number} · {s.title}
                    </span>
                  </li>
                ))}
                </ol>
              </div>
            </div>

            {/* right — stacked step panels */}
            <div className="relative h-[60vh]">
              {processSteps.map((s, i) => (
                <div
                  key={s.number}
                  data-step={i}
                  className="absolute inset-0 flex flex-col justify-center opacity-0"
                >
                  <span
                    aria-hidden
                    className="font-display text-[clamp(7rem,14vw,13rem)] font-light leading-none text-[#8d8678]"
                  >
                    {s.number}
                  </span>
                  <h3 className="mt-4 font-display text-[length:var(--text-title)] font-medium text-ink">
                    {s.title}
                  </h3>
                  <p className="measure mt-4 text-lg leading-relaxed text-ink/65">
                    {s.blurb}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* ===================== mobile (timeline) ===================== */}
      <div className="lg:hidden">
        <Container className="py-24 sm:py-28">
          <SectionHeading
            eyebrow="How it works"
            title="From idea to icon."
            lead="Five simple steps, from the first message to a finished piece in your hands."
          />
          <ol data-m-track className="relative mt-12 space-y-10 pl-12">
            <span className="absolute left-[19px] top-2 bottom-2 w-px bg-mist" />
            <span
              data-m-line
              className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top scale-y-0 bg-navy"
            />
            {processSteps.map((s) => (
              <li key={s.number} data-m-step className="relative">
                <span className="absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full border border-mist bg-paper font-display text-sm font-medium text-navy">
                  {s.number}
                </span>
                <h3 className="font-display text-xl font-medium text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink/65">
                  {s.blurb}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  );
}
