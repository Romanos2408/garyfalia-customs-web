"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Container } from "@/components/ui";
import { getGalleryItem } from "@/data/gallery";
import { HeroBackdrop } from "./HeroBackdrop";

/**
 * Home hero — full-bleed ink video that SCRUBS with scroll (the hero pins for a
 * stretch so you watch the footage evolve forward as you scroll down / rewind as
 * you scroll up). White type over it; foreground product image stays calm (fade
 * only). prefers-reduced-motion → a normal-height hero with a static poster.
 */

const WORN = {
  src: "/content/gallery/photo-01_1-nobg.webp",
  alt: "A model wearing the hand-painted Demon Slayer Hashira denim jacket",
};
const accent = getGalleryItem("dawn"); // Naruto AF1

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------ headline */

const headline: Variants = {
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
    <h1 className="text-[length:var(--text-hero)] font-light leading-[0.98] text-marble [text-shadow:0_2px_30px_rgba(7,14,26,0.45)]">
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

/* ----------------------------------------------------- magnetic button */

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
            ? "inline-flex h-12 items-center rounded-full bg-marble px-8 text-sm font-medium text-ink shadow-lift transition-colors hover:bg-white"
            : "inline-flex h-12 items-center rounded-full border border-marble/40 px-8 text-sm font-medium text-marble transition-colors hover:border-marble/80 hover:bg-marble/10"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------- art frame (calm) */

function ArtFrame({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? false : { opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)] border border-marble/15 bg-paper/95 shadow-lift backdrop-blur-sm"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.6),transparent_55%)]"
        />
        <Image
          src={WORN.src}
          alt={WORN.alt}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 42vw"
          className="object-contain p-[7%]"
        />
      </motion.div>

      {accent ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? false : { opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
          className="absolute -bottom-10 -left-6 z-20 hidden aspect-[4/5] w-[42%] overflow-hidden rounded-[var(--radius-card)] border border-marble/15 bg-paper/95 shadow-lift backdrop-blur-sm sm:block lg:-left-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.6),transparent_55%)]"
          />
          <Image
            src={accent.image}
            alt={accent.alt}
            fill
            sizes="(max-width: 1024px) 40vw, 18vw"
            className="object-contain p-[10%]"
          />
        </motion.div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- copy */

function HeroCopy({ reduce }: { reduce: boolean }) {
  return (
    <Container className="relative z-10 grid h-svh grid-cols-1 items-center gap-12 pb-24 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[var(--header-h)]">
      <motion.div
        variants={reduce ? undefined : headline}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "show"}
        className="lg:col-span-7 lg:pr-6"
      >
        <motion.span
          variants={reduce ? undefined : fadeUp}
          className="inline-flex items-center gap-3 text-[length:var(--text-eyebrow)] font-semibold uppercase tracking-[0.22em] text-marble/70"
        >
          <span aria-hidden className="h-px w-7 bg-marble/40" />
          Garyfalia Customs
        </motion.span>

        <div className="mt-6">
          <Headline reduce={reduce} />
        </div>

        <motion.p
          variants={reduce ? undefined : fadeUp}
          className="measure mt-8 text-lg leading-relaxed text-marble/80"
        >
          Hand-painted custom sneakers and denim jackets — anime, music, the
          things you love, painted to order and made to last.
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

      <div className="relative lg:col-span-5">
        <ArtFrame reduce={reduce} />
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------- hero */

export function MotionHero() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // reduced motion: a normal-height hero, static poster, no pin / no scrub.
  if (reduce) {
    return (
      <section ref={heroRef} className="relative min-h-svh overflow-hidden">
        <HeroBackdrop progress={scrollYProgress} />
        <HeroCopy reduce />
      </section>
    );
  }

  // the section is tall; the inner pins (sticky) while the ink scrubs with scroll.
  return (
    <section ref={heroRef} className="relative h-[230vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <HeroBackdrop progress={scrollYProgress} />
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
