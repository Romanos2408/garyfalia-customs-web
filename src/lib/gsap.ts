/**
 * Central GSAP plugin registration. Import gsap / ScrollTrigger / SplitText /
 * useGSAP from THIS module everywhere so plugins register exactly once and
 * only in the browser. (GSAP 3.13+ — SplitText is now 100% free.)
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
