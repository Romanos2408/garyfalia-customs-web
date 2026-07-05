import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutStory } from "@/components/about/AboutStory";
import { SignatureStrip } from "@/components/about/SignatureStrip";
import { CtaBand } from "@/components/shared/CtaBand";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About the Artist",
  description:
    "Garyfalia hand-paints custom sneakers and denim jackets to order — anime, music and pop-culture art, built to be worn. Meet the artist behind the work.",
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutStory />
      <SignatureStrip />
      <CtaBand
        title="Let's make something that's only yours."
        copy={`Tell me what you love. You can also follow the work on Instagram at ${site.instagram.handle}.`}
        primaryLabel="Get a Commission"
        secondary={{ label: site.instagram.handle, href: site.instagram.url }}
      />
    </>
  );
}
