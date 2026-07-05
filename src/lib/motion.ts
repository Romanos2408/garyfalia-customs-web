"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared motion language — one place for easings + durations so every page
 * animates with the same character. Kept free of GSAP imports so it can be
 * pulled into any component without bundling the animation engine.
 */

/** House easing curves. `ui` mirrors the CSS --ease-out token. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  ui: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** Standard durations (seconds). */
export const DURATION = {
  micro: 0.3,
  base: 0.6,
  entrance: 0.9,
  slow: 1.1,
} as const;

/** Default stagger between siblings in a reveal. */
export const STAGGER = 0.08;

/** Imperative check — safe in effects / event handlers (guards SSR). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Reactive hook — re-renders if the user toggles the OS setting live. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false, // server snapshot
  );
}
