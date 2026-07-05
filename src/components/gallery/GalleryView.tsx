"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui";
import { PieceFrame } from "./PieceFrame";
import { Lightbox } from "./Lightbox";
import {
  gallery,
  galleryFilters,
  type CommissionType,
} from "@/data/gallery";

type Filter = "all" | CommissionType;

export function GalleryView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const filtered = useMemo(
    () => (filter === "all" ? gallery : gallery.filter((g) => g.type === filter)),
    [filter],
  );

  // reveal: scroll-tied on first load, instant restagger on filter change
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", gridRef.current);
      if (reduce) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }
      if (firstRun.current) {
        firstRun.current = false;
        cards.forEach((c) =>
          gsap.from(c, {
            autoAlpha: 0,
            y: 32,
            duration: 0.7,
            ease: EASE.out,
            scrollTrigger: { trigger: c, start: "top 92%", once: true },
          }),
        );
      } else {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: EASE.out,
            stagger: 0.045,
            overwrite: true,
          },
        );
      }
    },
    { dependencies: [filter], scope: gridRef },
  );

  const close = () => {
    const id = openIndex !== null ? filtered[openIndex]?.id : null;
    setOpenIndex(null);
    if (id) {
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[data-card][data-id="${id}"]`)
          ?.focus();
      });
    }
  };

  return (
    <>
      {/* filter bar */}
      <Container className="pb-10">
        <div
          role="group"
          aria-label="Filter gallery by type"
          className="flex flex-wrap gap-2"
        >
          {galleryFilters.map((opt) => {
            const active = filter === opt.value;
            const count =
              opt.value === "all"
                ? gallery.length
                : gallery.filter((g) => g.type === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300",
                  active
                    ? "bg-navy text-marble"
                    : "text-ink/70 ring-1 ring-inset ring-mist hover:text-ink hover:ring-stone",
                )}
              >
                {opt.label}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    active ? "text-marble/60" : "text-stone",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Container>

      {/* grid */}
      <Container>
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              data-card
              data-id={item.id}
              onClick={() => setOpenIndex(i)}
              className="group block text-left"
            >
              <PieceFrame
                item={item}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              >
                {/* hover / focus overlay — decorative duplicate of the title row below */}
                <div
                  aria-hidden
                  className="pointer-events-none invisible absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-navy-deep/90 via-navy-deep/55 to-transparent p-4 pt-12 opacity-0 transition-[opacity,transform] duration-400 ease-[var(--ease-out)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-marble/70">
                    {item.type} · {item.year}
                  </p>
                  <p className="mt-1 font-display text-lg text-marble">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-marble/65">
                    {item.materials}
                  </p>
                </div>
              </PieceFrame>
              <div className="flex items-baseline justify-between gap-3 pt-3">
                <h2 className="font-display text-base font-medium text-ink">
                  {item.title}
                </h2>
                <span className="shrink-0 text-xs text-stone">{item.base}</span>
              </div>
            </button>
          ))}
        </div>
      </Container>

      {openIndex !== null ? (
        <Lightbox
          items={filtered}
          index={openIndex}
          onClose={close}
          onIndex={setOpenIndex}
        />
      ) : null}
    </>
  );
}
