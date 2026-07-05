"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Container } from "@/components/ui";
import { createInkSim, type InkSim } from "@/lib/inksim/createInkSim";
import { Copy } from "@/components/lab/BloomHero";

/**
 * Home hero — the ink is EARNED, not pre-exposed. The page opens as calm
 * marble; ~1s in, a single navy droplet falls and detonates into a live GPU
 * fluid sim (see /lab/inksim); from then on scrolling injects ink that blooms
 * outward through the pinned hero — forward as you go down, dispersing on its
 * own physics. After the drop, tiny splats near the impact point keep the
 * bloom breathing without repainting the whole canvas.
 * Falls back to the static bloom poster when WebGL2 is unavailable or
 * reduced-motion is on (no droplet theatre either — poster + copy only).
 */

/** Where the droplet lands, as fractions of the hero (right of the copy). */
const IMPACT = { x: 0.62, y: 0.38 };
/** Droplet fall duration (s) + delay before it starts. */
const DROP = { delay: 0.7, duration: 0.75 };

export function DropletHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<InkSim | null>(null);
  const landedRef = useRef(false);
  const [fallback, setFallback] = useState(false);
  const [dropDone, setDropDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1, 0]);

  // boot the simulation (calm — nothing is injected until the droplet lands)
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sim = createInkSim(canvas, { gridResolution: 256, solverIterations: 24 });
    if (!sim) {
      setFallback(true);
      return;
    }
    simRef.current = sim;

    const visible = { current: true };
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) sim.resume();
      else sim.pause();
    });
    io.observe(canvas);

    // after impact: faint pulses AT the impact point so the bloom keeps
    // breathing in place — reads as the drop still diffusing, not new ink.
    const breathe = window.setInterval(() => {
      if (!visible.current || !landedRef.current) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      sim.splat(
        w * (IMPACT.x + (Math.random() - 0.5) * 0.05),
        h * (IMPACT.y + (Math.random() - 0.5) * 0.05),
        (Math.random() - 0.5) * 3,
        -2 - Math.random() * 3,
      );
    }, 1600);

    return () => {
      window.clearInterval(breathe);
      io.disconnect();
      sim.destroy();
      simRef.current = null;
      landedRef.current = false;
    };
  }, [reduce]);

  // the droplet hits: one hard vertical splat + two angled echoes = detonation
  const onImpact = () => {
    setDropDone(true);
    landedRef.current = true;
    const sim = simRef.current;
    const canvas = canvasRef.current;
    if (!sim || !canvas) return;
    const x = canvas.clientWidth * IMPACT.x;
    const y = canvas.clientHeight * IMPACT.y;
    sim.splat(x, y, 0, 70);
    window.setTimeout(() => sim.splat(x - 14, y + 10, -22, 26), 90);
    window.setTimeout(() => sim.splat(x + 16, y + 12, 24, 30), 180);
  };

  // scroll paints: a brush of ink travels down-canvas with hero progress,
  // so the bloom expands the further you scroll (and disperses when you stop).
  useEffect(() => {
    if (reduce) return;
    let lastY = window.scrollY;
    let lastT = 0;
    const onScroll = () => {
      const sim = simRef.current;
      const canvas = canvasRef.current;
      const hero = heroRef.current;
      if (!sim || !canvas || !hero || !landedRef.current) return;
      const now = performance.now();
      if (now - lastT < 26) return;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      lastT = now;
      if (Math.abs(dy) < 0.5) return;

      const total = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / total, 0), 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // the brush spirals outward from the impact point as progress grows
      const spread = 0.08 + 0.34 * progress;
      const angle = progress * Math.PI * 3;
      const x = w * (IMPACT.x + spread * Math.cos(angle) * 0.9);
      const y = h * (IMPACT.y + spread * Math.sin(angle) * 0.8 + 0.18 * progress);
      const v = Math.max(Math.min(dy, 55), -55);
      sim.splat(x, y, (Math.random() - 0.5) * 7, v);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  const showSim = !reduce && !fallback;

  return (
    <section
      ref={heroRef}
      className={reduce ? "relative min-h-svh overflow-hidden" : "relative h-[240vh]"}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-marble">
        {showSim ? (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/content/video/ink-bloom-poster.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
          />
        )}

        {/* the falling droplet — a small navy bead that drops to the impact
            point, squashes, and hands off to the sim's detonation */}
        {showSim && !dropDone ? (
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
              ease: [0.5, 0, 0.9, 0.4], // gravity: accelerating fall
              times: [0, 0.75, 1],
            }}
            onAnimationComplete={onImpact}
            className="absolute z-[1] block h-4 w-3 rounded-full bg-navy shadow-[0_0_18px_rgba(22,38,63,0.35)]"
            style={{ left: `${IMPACT.x * 100}%`, translateX: "-50%" }}
          />
        ) : null}

        {/* cream scrim keeps the dark headline crisp on the left */}
        <div className="absolute inset-0 bg-[linear-gradient(95deg,#f5f3ee_0%,#f5f3ee_26%,rgba(245,243,238,0.42)_52%,rgba(245,243,238,0)_80%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-marble to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-marble to-transparent" />

        <svg className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-multiply">
          <filter id="droplet-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#droplet-grain)" />
        </svg>

        <motion.div
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
          className="relative z-10 h-svh"
        >
          <Container className="grid h-svh grid-cols-1 items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-[var(--header-h)]">
            <Copy reduce={reduce} />
          </Container>
        </motion.div>

        {!reduce ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-stone">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em]">Scroll to paint</span>
            <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-mist">
              <span className="absolute inset-x-0 top-0 h-3 animate-[cue_2s_ease-in-out_infinite] bg-navy" />
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
