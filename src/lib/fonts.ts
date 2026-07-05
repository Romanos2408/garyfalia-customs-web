import { Fraunces, Inter } from "next/font/google";

/**
 * Display / headings — Fraunces (variable, optical-size, soft & editorial).
 * Body / UI — Inter (variable).
 *
 * To swap the display face for a bolder streetwear grotesque (e.g. Archivo),
 * change ONLY this file: import the new font, keep the `--font-fraunces`
 * variable name (or rename it everywhere) so globals.css picks it up.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${inter.variable}`;
