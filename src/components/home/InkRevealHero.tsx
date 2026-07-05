"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroCopy } from "./MotionHero";
import { asset } from "@/lib/asset";

/**
 * Home hero — Garyfalia's full-bleed navy ink footage, but EARNED instead of
 * pre-exposed. The page opens on clean deep navy; a pale droplet falls and,
 * on impact, the ink video is revealed through a circular mask that pops open
 * at the landing point, then EXPANDS with scroll until the smoke owns the
 * whole screen (~60% through the pin). The footage itself keeps scrubbing
 * forward the entire way (HeroBackdrop maps scroll → currentTime), so the
 * smoke both spreads and evolves. Reduced motion: static poster, no theatre.
 */

/** Mask origin — where the droplet lands (fractions of the viewport). */
const IMPACT = { x: 0.62, y: 0.4 };
/** Droplet fall timing (s). */
const DROP = { delay: 0.9, duration: 0.8 };

export function InkRevealHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const [dropDone, setDropDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // reveal radius = impact pop (spring, fires once) + scroll expansion.
  // 9% pop on landing; full-screen (~160% radius) by 60% of the pin, so the
  // last stretch of the pin is pure smoke evolution behind the fading copy.
  const impactR = useSpring(0, { stiffness: 130, damping: 15 });
  const scrollR = useTransform(scrollYProgress, [0.02, 0.6], [0, 155], {
    clamp: true,
  });
  const radius = useTransform<number, number>(
    [impactR, scrollR] as const,
    ([a, b]: number[]) => Math.max(0, (a ?? 0) + (b ?? 0)),
  );
  const clipPath = useMotionTemplate`circle(${radius}% at ${IMPACT.x * 100}% ${IMPACT.y * 100}%)`;

  const onImpact = () => {
    setDropDone(true);
    impactR.set(9);
  };

  // reduced motion: a normal-height hero with the static poster, no mask.
  if (reduce) {
    return (
      <section ref={heroRef} className="relative min-h-svh overflow-hidden bg-navy-deep">
        <Image
          src={asset("/content/video/ink-navy-poster.webp")}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,14,26,0.74)_0%,rgba(7,14,26,0.46)_38%,rgba(7,14,26,0.2)_68%,rgba(7,14,26,0.34)_100%)]" />
        <HeroCopy reduce />
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative h-[230vh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-navy-deep">
        {/* calm base — deep navy + the same paper grain, before any ink exists */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay"
        >
          <filter id="reveal-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#reveal-grain)" />
        </svg>

        {/* the ink footage, unveiled through the expanding circle */}
        <motion.div style={{ clipPath }} className="absolute inset-0 will-change-[clip-path]">
          <HeroBackdrop progress={scrollYProgress} />
        </motion.div>

        {/* the droplet — a pale bead falling to the impact point */}
        {!dropDone ? (
          <motion.span
            aria-hidden
            initial={{ top: "-4%", scaleY: 1, opacity: 0 }}
            animate={{
              top: `${IMPACT.y * 100}%`,
              scaleY: [1, 1.25, 0.55],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: DROP.delay,
              duration: DROP.duration,
              ease: [0.5, 0, 0.9, 0.4], // accelerating, gravity-like
              times: [0, 0.75, 1],
            }}
            onAnimationComplete={onImpact}
            className="absolute z-[5] block h-4 w-3 rounded-full bg-marble/90 shadow-[0_0_22px_rgba(245,243,238,0.5)]"
            style={{ left: `${IMPACT.x * 100}%`, translateX: "-50%" }}
          />
        ) : null}

        <HeroCopy reduce={false} />

        {/* scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-marble/60">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-marble/25">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cue_2s_ease-in-out_infinite] bg-marble" />
          </span>
        </div>
      </div>
    </section>
  );
}
