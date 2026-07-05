"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  useReducedMotion,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

/**
 * Full-bleed ANIMATED hero background — navy ink in water (Pexels, free
 * commercial) SCRUBBED by scroll: scroll down → the footage evolves forward,
 * scroll up → it rewinds. `progress` is the hero's scroll progress (0→1); we
 * map it to video.currentTime, spring-smoothed (Lenis already smooths the scroll
 * input, which is what keeps seek-scrubbing fluid). A dark scrim keeps the white
 * hero text legible. prefers-reduced-motion → a static poster, no scrubbing.
 */
export function HeroBackdrop({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const smooth = useSpring(progress, { stiffness: 90, damping: 26, mass: 0.35 });

  // map smoothed scroll progress → currentTime (skip micro-updates to avoid thrash)
  useMotionValueEvent(smooth, "change", (v) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration || Number.isNaN(vid.duration)) return;
    const t = Math.min(Math.max(v, 0), 1) * vid.duration;
    if (Math.abs(vid.currentTime - t) > 0.02) {
      try {
        vid.currentTime = t;
      } catch {
        /* seeking not ready yet */
      }
    }
  });

  // prime the decoder so it's seekable (esp. iOS): a muted play() then pause()
  const onReady = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().then(() => vid.pause()).catch(() => {});
  };

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-navy-deep">
      {reduce ? (
        <Image
          src="/content/video/ink-navy-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          onLoadedMetadata={onReady}
          className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.95)]"
          muted
          playsInline
          preload="auto"
          poster="/content/video/ink-navy-poster.webp"
        >
          <source src="/content/video/ink-navy.mp4" type="video/mp4" />
        </video>
      )}

      {/* dark scrim — darker on the text (left) side, so the white headline stays crisp */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,14,26,0.74)_0%,rgba(7,14,26,0.46)_38%,rgba(7,14,26,0.2)_68%,rgba(7,14,26,0.34)_100%)]" />
      {/* soft top + bottom vignette to seat the header / hand off to the next section */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-deep/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-deep/70 to-transparent" />

      {/* paper grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
