"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Per-route template — remounts on every navigation. Its job is functional:
 * reset scroll to the top and refresh ScrollTrigger so pinned / scrubbed
 * sections recalculate for the new page.
 *
 * It does NOT fade the page's opacity: hiding the whole page and relying on an
 * animation to reveal it risks a stuck white screen, so pages appear instantly
 * and motion is left to the per-section reveals (which fall back to visible).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lenis = (
        window as unknown as {
          lenis?: { scrollTo: (t: number, o?: object) => void };
        }
      ).lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);

      ScrollTrigger.refresh();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
