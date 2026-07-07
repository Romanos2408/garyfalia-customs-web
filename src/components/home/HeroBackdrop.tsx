"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  useReducedMotion,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { asset } from "@/lib/asset";

/**
 * Full-bleed ANIMATED hero background — navy ink in water (Pexels, free
 * commercial) SCRUBBED by scroll: scroll down → the footage evolves forward,
 * scroll up → it rewinds. `progress` is the hero's scroll progress (0→1); we
 * map it to video.currentTime, spring-smoothed (Lenis already smooths the scroll
 * input, which is what keeps seek-scrubbing fluid). A dark scrim keeps the white
 * hero text legible. prefers-reduced-motion → a static poster, no scrubbing.
 */
export function HeroBackdrop({
  progress,
  src = "/content/video/ink-navy.mp4",
  poster = "/content/video/ink-navy-poster.webp",
  tone = "dark",
}: {
  progress: MotionValue<number>;
  /** /public paths — passed through asset() internally. */
  src?: string;
  poster?: string;
  /** "dark": navy ground + dark scrim for marble text.
      "light": marble ground + cream scrim for ink text. */
  tone?: "dark" | "light";
}) {
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

  const light = tone === "light";

  return (
    <div
      aria-hidden
      className={`absolute inset-0 z-0 overflow-hidden ${light ? "bg-marble" : "bg-navy-deep"}`}
    >
      {reduce ? (
        <Image
          src={asset(poster)}
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
          poster={asset(poster)}
        >
          <source src={asset(src)} type="video/mp4" />
        </video>
      )}

      {/* scrim — heavier on the text (left) side, so the headline stays crisp */}
      {light ? (
        <div className="absolute inset-0 bg-[linear-gradient(95deg,#f5f3ee_0%,rgba(245,243,238,0.82)_30%,rgba(245,243,238,0.4)_55%,rgba(245,243,238,0.06)_82%)]" />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,14,26,0.74)_0%,rgba(7,14,26,0.46)_38%,rgba(7,14,26,0.2)_68%,rgba(7,14,26,0.34)_100%)]" />
      )}
      {/* soft top + bottom vignette to seat the header / hand off to the next section */}
      <div
        className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent ${light ? "from-marble/80" : "from-navy-deep/60"}`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent ${light ? "from-marble" : "from-navy-deep/70"}`}
      />

      {/* paper grain */}
      <svg
        className={`absolute inset-0 h-full w-full ${light ? "opacity-[0.04] mix-blend-multiply" : "opacity-[0.07] mix-blend-overlay"}`}
      >
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
