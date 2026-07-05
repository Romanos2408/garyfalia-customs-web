"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { Container, Button, Eyebrow } from "@/components/ui";
import { site } from "@/data/site";
import { getGalleryItem } from "@/data/gallery";

const accent = getGalleryItem("dawn"); // Naruto AF1

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const heading = headlineRef.current;
      if (!heading) return;
      const staggers = gsap.utils.toArray<HTMLElement>(
        "[data-stagger]",
        supportingRef.current,
      );

      if (reduce) {
        gsap.set([heading, ...staggers], { autoAlpha: 1, y: 0 });
        return;
      }

      // hide synchronously to avoid a flash before SplitText runs
      gsap.set(heading, { autoAlpha: 0 });
      gsap.set(staggers, { autoAlpha: 0, y: 24 });

      let split: InstanceType<typeof SplitText> | null = null;
      const build = () => {
        if (!headlineRef.current) return;
        split = new SplitText(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(heading, { autoAlpha: 1 });
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .from(split.lines, { yPercent: 118, duration: 1, stagger: 0.12 })
          .to(
            staggers,
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
            0.55,
          );
      };

      const fontsReady = document.fonts
        ? document.fonts.ready
        : Promise.resolve();
      fontsReady.then(build);

      // image parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const scrollTrigger = {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        } as const;
        gsap.to("[data-hero-img='back']", {
          yPercent: -14,
          ease: "none",
          scrollTrigger,
        });
        gsap.to("[data-hero-img='front']", {
          yPercent: 9,
          ease: "none",
          scrollTrigger,
        });
      });

      // scroll cue fades out as the hero leaves
      gsap.to(cueRef.current, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "4% top",
          end: "16% top",
          scrub: true,
        },
      });

      return () => {
        split?.revert();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <Container className="grid min-h-svh grid-cols-1 items-center gap-12 pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[var(--header-h)]">
        {/* copy */}
        <div className="lg:col-span-7 lg:pr-6">
          <div data-stagger>
            <Eyebrow>{site.name}</Eyebrow>
          </div>
          <h1
            ref={headlineRef}
            className="mt-6 text-[length:var(--text-hero)] font-light leading-[0.95] text-ink"
          >
            Wearable art,
            <br />
            made by hand.
          </h1>
          <div ref={supportingRef} className="mt-8">
            <p
              data-stagger
              className="measure text-lg leading-relaxed text-ink/65"
            >
              {site.intro} Anime, music, the stuff you love — painted onto
              sneakers and denim, and made to last.
            </p>
            <div data-stagger className="mt-9 flex flex-wrap gap-4">
              <Button href="/commission" size="lg">
                Get a Commission
              </Button>
              <Button href="/gallery" size="lg" variant="ghost">
                View Gallery
              </Button>
            </div>
          </div>
        </div>

        {/* images */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
            {/* back / main — worn jacket */}
            <div
              data-hero-img="back"
              className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)] border border-mist bg-paper shadow-lift"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.7),transparent_55%)]"
              />
              <Image
                src="/content/gallery/photo-01_1-nobg.webp"
                alt="A model wearing the hand-painted Demon Slayer Hashira denim jacket, eyes of the Hashira across the back"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain p-[7%]"
              />
            </div>

            {/* front / accent — sneaker */}
            {accent ? (
              <div
                data-hero-img="front"
                className="absolute -bottom-10 -left-6 hidden w-[42%] overflow-hidden rounded-[var(--radius-card)] border border-mist bg-paper shadow-lift sm:block lg:-left-14"
              >
                <div className="relative aspect-[4/5]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.7),transparent_55%)]"
                  />
                  <Image
                    src={accent.image}
                    alt={accent.alt}
                    fill
                    sizes="(max-width: 1024px) 40vw, 18vw"
                    className="object-contain p-[10%] drop-shadow-[0_18px_30px_rgba(14,27,42,0.16)]"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>

      {/* scroll cue */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-3 text-stone"
      >
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em]">
          Scroll
        </span>
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-mist">
          <span className="absolute inset-x-0 top-0 h-4 animate-[cue_2s_ease-in-out_infinite] bg-navy" />
        </span>
      </div>
    </section>
  );
}
