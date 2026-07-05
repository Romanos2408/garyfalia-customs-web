"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui";
import { HeroBackdrop } from "./HeroBackdrop";
import { Copy } from "@/components/lab/BloomHero";
import { asset } from "@/lib/asset";

/**
 * Home hero — navy ink on pale water (the site-wide ink identity), full-bleed
 * and SCRUBBED by scroll: the hero pins for a stretch and the plume evolves
 * forward as you scroll down, rewinds as you scroll up (HeroBackdrop maps
 * scroll → currentTime). Copy drifts up and fades over the pin.
 * Reduced motion: static poster, no pin.
 */

/** Navy-ink-on-light footage: Pexels #7565969 ("Colored Ink in the Water",
    Pexels license, free commercial). Re-encoded g=4 for smooth scrubbing. */
const FOOTAGE = {
  src: "/content/video/ink-light.mp4",
  poster: "/content/video/ink-light-poster.webp",
};

export function InkRevealHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // copy drifts up and fades while the ink evolves behind it — the fade
  // finishes only at the very end of the pin, so the headline hands off to
  // the next section without a dead stretch of empty ink.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72, 0.99], [1, 1, 0]);

  // reduced motion: a normal-height hero with the static poster.
  if (reduce) {
    return (
      <section ref={heroRef} className="relative min-h-svh overflow-hidden bg-marble">
        <Image
          src={asset(FOOTAGE.poster)}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(95deg,#f5f3ee_0%,rgba(245,243,238,0.82)_30%,rgba(245,243,238,0.4)_55%,rgba(245,243,238,0.06)_82%)]" />
        <Container className="relative z-10 grid min-h-svh grid-cols-1 items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-[var(--header-h)]">
          <Copy reduce />
        </Container>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative h-[230vh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-marble">
        {/* calm base — marble + paper grain, before any ink exists */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-multiply"
        >
          <filter id="reveal-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#reveal-grain)" />
        </svg>

        {/* the ink footage, scrubbed forward by scroll */}
        <HeroBackdrop progress={scrollYProgress} src={FOOTAGE.src} poster={FOOTAGE.poster} tone="light" />

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 h-svh">
          <Container className="grid h-svh grid-cols-1 items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-[var(--header-h)]">
            <Copy reduce={false} />
          </Container>
        </motion.div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-stone">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-mist">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cue_2s_ease-in-out_infinite] bg-navy" />
          </span>
        </div>
      </div>
    </section>
  );
}
