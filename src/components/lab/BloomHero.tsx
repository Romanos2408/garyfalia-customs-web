"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Container } from "@/components/ui";
import { asset } from "@/lib/asset";

/**
 * /lab/bloom — "Bloom-in" concept. A navy ink drop blooms into CLEAR water as
 * you scroll (the clip is scrubbed by scroll position, so it builds from nothing
 * forward / un-blooms backward). The footage sits on a cream ground, so the hero
 * stays on-brand marble/navy with DARK text. Text parallaxes (drifts + fades) at
 * a different rate than the background. prefers-reduced-motion → static poster.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const headlineV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const wordRise: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  show: {
    opacity: 1,
    y: "0em",
    transition: { type: "spring", stiffness: 150, damping: 19 },
  },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Headline({ reduce }: { reduce: boolean }) {
  const lines = ["Wearable art,", "made by hand."];
  return (
    <h1 className="text-[length:var(--text-hero)] font-light leading-[0.98] text-ink">
      {lines.map((line) => {
        const words = line.split(" ");
        return (
          <span key={line} className="block whitespace-nowrap">
            {words.map((w, i) => (
              <Fragment key={i}>
                <motion.span
                  variants={reduce ? undefined : wordRise}
                  className="inline-block will-change-transform"
                >
                  {w}
                </motion.span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

function Magnetic({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16 });
  const y = useSpring(my, { stiffness: 220, damping: 16 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x, y }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex"
    >
      <Link
        href={href}
        className={
          primary
            ? "inline-flex h-12 items-center rounded-full bg-navy px-8 text-sm font-medium text-marble shadow-soft transition-colors hover:bg-navy-deep"
            : "inline-flex h-12 items-center rounded-full border border-ink/20 px-8 text-sm font-medium text-ink transition-colors hover:border-ink/40"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* ---- scrubbed bloom backdrop (mirrored so the bloom sits on the right) ---- */

function BloomBackdrop({
  progress,
  reduce,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smooth = useSpring(progress, { stiffness: 90, damping: 26, mass: 0.35 });

  useMotionValueEvent(smooth, "change", (v) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration || Number.isNaN(vid.duration)) return;
    const t = Math.min(Math.max(v, 0), 1) * vid.duration;
    if (Math.abs(vid.currentTime - t) > 0.02) {
      try {
        vid.currentTime = t;
      } catch {
        /* not seekable yet */
      }
    }
  });

  const onReady = () => {
    const vid = videoRef.current;
    if (vid) vid.play().then(() => vid.pause()).catch(() => {});
  };

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-marble">
      {reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset("/content/video/ink-bloom-poster.webp")}
          alt=""
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          onLoadedMetadata={onReady}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
          muted
          playsInline
          preload="auto"
          poster={asset("/content/video/ink-bloom-poster.webp")}
        >
          <source src={asset("/content/video/ink-bloom.mp4")} type="video/mp4" />
        </video>
      )}

      {/* cream scrim — keeps the dark headline crisp on the left */}
      <div className="absolute inset-0 bg-[linear-gradient(95deg,#f5f3ee_0%,#f5f3ee_30%,rgba(245,243,238,0.5)_55%,rgba(245,243,238,0.05)_82%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-marble to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-marble to-transparent" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-multiply">
        <filter id="bloom-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bloom-grain)" />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- copy */

export function Copy({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      variants={reduce ? undefined : headlineV}
      initial={reduce ? false : "hidden"}
      animate={reduce ? false : "show"}
      className="lg:col-span-7 lg:pr-6"
    >
      <motion.span
        variants={reduce ? undefined : fadeUp}
        className="inline-flex items-center gap-3 text-[length:var(--text-eyebrow)] font-semibold uppercase tracking-[0.22em] text-stone"
      >
        <span aria-hidden className="h-px w-7 bg-stone/50" />
        Garyfalia Customs
      </motion.span>

      <div className="mt-6">
        <Headline reduce={reduce} />
      </div>

      <motion.p
        variants={reduce ? undefined : fadeUp}
        className="measure mt-8 text-lg leading-relaxed text-ink/70"
      >
        Hand-painted custom sneakers and denim jackets — anime, music, the things
        you love, painted to order and made to last.
      </motion.p>

      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="mt-9 flex flex-wrap gap-4"
      >
        <Magnetic href="/commission" primary>
          Get a Commission
        </Magnetic>
        <Magnetic href="/gallery">View Gallery</Magnetic>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- hero */

export function BloomHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // text parallax: the copy drifts up + fades while the bloom evolves behind it.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1, 0]);

  if (reduce) {
    return (
      <section ref={heroRef} className="relative min-h-svh overflow-hidden">
        <BloomBackdrop progress={scrollYProgress} reduce />
        <Container className="relative z-10 grid min-h-svh grid-cols-1 items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-[var(--header-h)]">
          <Copy reduce />
        </Container>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <BloomBackdrop progress={scrollYProgress} reduce={false} />

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 h-svh">
          <Container className="grid h-svh grid-cols-1 items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-[var(--header-h)]">
            <Copy reduce={false} />
          </Container>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-stone">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em]">Scroll</span>
          <span aria-hidden className="relative block h-9 w-px overflow-hidden bg-mist">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cue_2s_ease-in-out_infinite] bg-navy" />
          </span>
        </div>
      </div>
    </section>
  );
}
