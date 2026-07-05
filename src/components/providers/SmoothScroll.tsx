"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll provider. Initializes Lenis and drives it from GSAP's ticker
 * (a single RAF loop — Lenis `autoRaf: false`), and keeps ScrollTrigger in
 * sync. Under reduced-motion the scroll is effectively instant (lerp = 1) and
 * no smoothing runs.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: reduce ? 1 : 0.1, // instant scroll if reduced motion
      smoothWheel: !reduce,
    });

    // expose for debugging / programmatic scroll (harmless in prod)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // keep ScrollTrigger updated as Lenis scrolls
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // make sure triggers measure correctly once everything has mounted
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
