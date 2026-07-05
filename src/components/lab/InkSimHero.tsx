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
import { Copy } from "./BloomHero";

/**
 * /lab/inksim — a LIVE GPU ink-in-water fluid simulation (ported from
 * Volcomix/ink-drop, MIT) as the hero background. Scrolling injects ink that
 * blooms and disperses in real time — crisp at any size, genuinely evolving
 * (not a clip). Re-tinted to navy ink on marble. Falls back to a static poster
 * when WebGL2 / float targets are unavailable or reduced-motion is on.
 */
export function InkSimHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<InkSim | null>(null);
  const [fallback, setFallback] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1, 0]);

  // boot the simulation
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

    // only run while visible
    const visible = { current: true };
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) sim.resume();
      else sim.pause();
    });
    io.observe(canvas);

    // gentle ambient drips so the hero breathes even before you scroll
    let drift = 0;
    const ambient = window.setInterval(() => {
      if (!visible.current) return;
      drift += 0.7;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const x = w * (0.6 + 0.16 * Math.sin(drift));
      const y = h * (0.36 + 0.18 * Math.cos(drift * 0.7));
      sim.splat(x, y, (Math.random() - 0.5) * 5, -4 - Math.random() * 5);
    }, 1100);

    return () => {
      window.clearInterval(ambient);
      io.disconnect();
      sim.destroy();
      simRef.current = null;
    };
  }, [reduce]);

  // scroll injects ink — a brush that travels down the canvas as you scroll
  useEffect(() => {
    if (reduce) return;
    let lastY = window.scrollY;
    let lastT = 0;
    const onScroll = () => {
      const sim = simRef.current;
      const canvas = canvasRef.current;
      const hero = heroRef.current;
      if (!sim || !canvas || !hero) return;
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
      const x = w * (0.58 + 0.14 * Math.sin(progress * Math.PI * 2));
      const y = h * (0.2 + 0.56 * progress);
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

        {/* cream scrim keeps the dark headline crisp on the left */}
        <div className="absolute inset-0 bg-[linear-gradient(95deg,#f5f3ee_0%,#f5f3ee_26%,rgba(245,243,238,0.42)_52%,rgba(245,243,238,0)_80%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-marble to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-marble to-transparent" />

        <svg className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-multiply">
          <filter id="inksim-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#inksim-grain)" />
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
