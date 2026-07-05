"use client";

import { useRef } from "react";
import {
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { asset } from "@/lib/asset";

/**
 * About-page echo of the home hero's ink: the same navy-on-light footage
 * (Pexels #7565969) as a QUIET backdrop behind the artist intro — heavily
 * scrimmed, gently scrubbed by the section's scroll progress. No pin, no
 * droplet theatre; it should read as texture, not a second hero.
 * Reduced motion / small screens keep the plain marble ground (the clip is
 * decorative — not worth 8MB on a phone).
 */
export function AboutInkBackdrop() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
  });

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

  if (reduce) return null;

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* desktop only — decorative, so phones skip the download entirely */}
      <video
        ref={videoRef}
        onLoadedMetadata={onReady}
        className="absolute inset-0 hidden h-full w-full object-cover opacity-60 lg:block"
        muted
        playsInline
        preload="metadata"
        poster={asset("/content/video/ink-light-poster.webp")}
      >
        <source src={asset("/content/video/ink-light.mp4")} type="video/mp4" />
      </video>
      {/* heavy cream scrim — the copy and portrait must stay the subject */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(95deg,#f5f3ee_0%,rgba(245,243,238,0.9)_40%,rgba(245,243,238,0.62)_70%,rgba(245,243,238,0.3)_100%)] lg:block" />
      <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-marble to-transparent lg:block" />
    </div>
  );
}
