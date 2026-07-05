"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Container, Button, Eyebrow } from "@/components/ui";
import { getGalleryItem } from "@/data/gallery";
import type { LabVariantId } from "@/data/lab";
import { asset } from "@/lib/asset";

const WORN = {
  src: asset("/content/gallery/photo-01_1-nobg.webp"),
  alt: "A model wearing the hand-painted Demon Slayer Hashira denim jacket",
};

function Headline({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        "font-light leading-[0.95] text-ink text-[length:var(--text-hero)]",
        className,
      )}
    >
      Wearable art,
      <br />
      made by hand.
    </h1>
  );
}

function Actions({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button href="/commission" size="lg" variant={light ? "light" : "primary"}>
        Get a Commission
      </Button>
      <Button href="/gallery" size="lg" variant={light ? "ghostLight" : "ghost"}>
        View Gallery
      </Button>
    </div>
  );
}

function Lede({ className }: { className?: string }) {
  return (
    <p className={cn("text-lg leading-relaxed text-ink/65", className)}>
      Hand-painted custom sneakers and denim jackets — anime, music, the things
      you love, painted to order and made to last.
    </p>
  );
}

function Frame({
  src,
  alt,
  sizes,
  priority,
  className,
  scroll,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  scroll?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] border border-mist bg-paper shadow-soft",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.45),transparent_55%)]"
      />
      <div data-scroll={scroll} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-[7%]"
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- layouts */

function TwoCol() {
  const accent = getGalleryItem("dawn");
  return (
    <Container className="grid min-h-svh grid-cols-1 items-center gap-12 pb-24 pt-[calc(var(--header-h)+2rem)] lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7 lg:pr-4">
        <Eyebrow>Garyfalia Customs</Eyebrow>
        <Headline className="mt-6" />
        <Lede className="measure mt-8" />
        <div className="mt-9">
          <Actions />
        </div>
      </div>
      <div className="relative lg:col-span-5">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
          <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)] border border-mist bg-paper shadow-lift">
            <div data-scroll="scale" className="absolute inset-0">
              <Image src={WORN.src} alt={WORN.alt} fill priority sizes="40vw" className="object-contain p-[7%]" />
            </div>
          </div>
          {accent ? (
            <Frame
              src={accent.image}
              alt={accent.alt}
              sizes="18vw"
              scroll="down"
              className="absolute -bottom-10 -left-6 z-30 hidden aspect-[4/5] w-[40%] shadow-lift sm:block lg:-left-14"
            />
          ) : null}
        </div>
      </div>
    </Container>
  );
}

function Fullbleed() {
  return (
    <div className="relative min-h-svh">
      <div className="absolute inset-0 overflow-hidden">
        <div
          data-scroll="up"
          className="absolute bottom-0 right-[-6%] h-[78%] w-[78%] sm:right-0 sm:h-[92%] sm:w-[58%]"
        >
          <Image src={WORN.src} alt={WORN.alt} fill priority sizes="60vw" className="object-contain object-bottom" />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-marble via-marble/85 to-transparent sm:via-marble/55"
        />
      </div>
      <Container className="relative z-10 flex min-h-svh flex-col justify-center pb-24 pt-[var(--header-h)]">
        <div className="max-w-[88%] sm:max-w-[60%] lg:max-w-[52%]">
          <Eyebrow>Garyfalia Customs</Eyebrow>
          <Headline className="mt-6" />
          <Lede className="measure mt-8" />
          <div className="mt-9">
            <Actions />
          </div>
        </div>
      </Container>
    </div>
  );
}

function Split() {
  return (
    <div className="relative grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center px-6 pb-16 pt-[calc(var(--header-h)+2rem)] sm:px-10 lg:py-0 lg:pl-12 lg:pr-16">
        <div>
          <Eyebrow>Garyfalia Customs</Eyebrow>
          <Headline className="mt-6" />
          <Lede className="measure mt-8" />
          <div className="mt-9">
            <Actions />
          </div>
        </div>
      </div>
      <div className="relative min-h-[58vh] overflow-hidden border-t border-mist bg-[#ebedf1] lg:min-h-svh lg:border-l lg:border-t-0">
        <div data-scroll="scale" className="absolute inset-0">
          <Image src={WORN.src} alt={WORN.alt} fill priority sizes="50vw" className="object-contain object-center p-8" />
        </div>
      </div>
    </div>
  );
}

function Centered() {
  const piece = getGalleryItem("bohemian");
  return (
    <Container className="relative flex min-h-svh flex-col items-center justify-center pb-24 pt-[var(--header-h)] text-center">
      {piece ? (
        <div
          data-scroll="scale"
          className="pointer-events-none absolute bottom-[8%] left-1/2 z-0 h-[52%] w-[min(86vw,520px)] -translate-x-1/2"
        >
          <Image src={piece.image} alt={piece.alt} fill priority sizes="80vw" className="object-contain object-bottom opacity-95" />
        </div>
      ) : null}
      <div className="relative z-10 flex flex-col items-center">
        <Eyebrow>Garyfalia Customs</Eyebrow>
        <Headline className="mt-6 max-w-[14ch]" />
        <Lede className="measure-narrow mx-auto mt-7" />
        <div className="mt-9">
          <Actions />
        </div>
      </div>
    </Container>
  );
}

function GalleryRow() {
  const ids = ["dawn", "starlight", "bohemian", "the-founding", "nezuko", "wano"];
  const pieces = ids.map(getGalleryItem).filter(Boolean);
  return (
    <section className="flex min-h-svh flex-col justify-center pb-16 pt-[calc(var(--header-h)+2rem)]">
      <Container>
        <Eyebrow>Garyfalia Customs</Eyebrow>
        <Headline className="mt-5 !text-[length:var(--text-display)]" />
      </Container>
      <div className="mt-12 overflow-hidden">
        <div data-scroll="slidex" className="flex w-max gap-6 px-6 sm:px-10 lg:px-12">
          {pieces.map((p, i) => (
            <Frame
              key={p!.id}
              src={p!.image}
              alt={p!.alt}
              sizes="26vw"
              priority={i < 2}
              className="aspect-[4/5] w-[clamp(190px,26vw,290px)] shrink-0"
            />
          ))}
        </div>
      </div>
      <Container className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Lede className="measure" />
          <Actions />
        </div>
      </Container>
    </section>
  );
}

function Stacked() {
  const a = getGalleryItem("starlight");
  const b = getGalleryItem("dawn");
  return (
    <Container className="flex min-h-svh flex-col justify-center pb-20 pt-[calc(var(--header-h)+2rem)]">
      <Eyebrow>Garyfalia Customs</Eyebrow>
      <Headline className="mt-5" />
      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-12">
        {a ? (
          <Frame
            src={a.image}
            alt={a.alt}
            sizes="40vw"
            priority
            scroll="up"
            className="col-span-1 aspect-[4/5] shadow-lift sm:col-span-5"
          />
        ) : null}
        {b ? (
          <Frame
            src={b.image}
            alt={b.alt}
            sizes="34vw"
            scroll="down"
            className="col-span-1 aspect-[4/5] shadow-lift sm:col-span-4 sm:col-start-7 sm:mt-14"
          />
        ) : null}
        <div className="col-span-2 flex flex-col justify-end gap-7 sm:col-span-2 sm:col-start-11">
          <Lede />
          <Actions />
        </div>
      </div>
    </Container>
  );
}

const layouts: Record<Exclude<LabVariantId, "motion" | "bloom" | "inksim">, () => React.JSX.Element> = {
  twocol: TwoCol,
  fullbleed: Fullbleed,
  split: Split,
  centered: Centered,
  galleryrow: GalleryRow,
  stacked: Stacked,
};

export function LabHero({ variant }: { variant: Exclude<LabVariantId, "motion" | "bloom" | "inksim"> }) {
  const heroRef = useRef<HTMLElement>(null);
  const Layout = layouts[variant];

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.utils.toArray<HTMLElement>("[data-scroll='scale']", hero).forEach((el) =>
          gsap.to(el, { scale: 1.06, ease: "none", scrollTrigger: st }),
        );
        gsap.utils.toArray<HTMLElement>("[data-scroll='up']", hero).forEach((el) =>
          gsap.to(el, { yPercent: -12, ease: "none", scrollTrigger: st }),
        );
        gsap.utils.toArray<HTMLElement>("[data-scroll='down']", hero).forEach((el) =>
          gsap.to(el, { yPercent: 12, ease: "none", scrollTrigger: st }),
        );
        gsap.utils.toArray<HTMLElement>("[data-scroll='slidex']", hero).forEach((el) =>
          gsap.to(el, { xPercent: -28, ease: "none", scrollTrigger: st }),
        );
      });
      return () => mm.revert();
    },
    { scope: heroRef, dependencies: [variant] },
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <Layout />
    </section>
  );
}
