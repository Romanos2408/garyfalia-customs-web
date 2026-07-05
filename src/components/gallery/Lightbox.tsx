"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { Badge } from "@/components/ui";
import type { GalleryItem } from "@/data/gallery";

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  // entrance animation (once)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, scale: 0.96, y: 12 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    },
    { dependencies: [] },
  );

  // scroll lock + initial focus (mount only)
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const closeBtn = dialogRef.current?.querySelector<HTMLElement>(
      "[data-close]",
    );
    closeBtn?.focus();
    return () => {
      root.style.overflow = prevOverflow;
    };
  }, []);

  // keyboard: Esc, arrows, Tab focus-trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onIndex(index - 1);
      } else if (e.key === "ArrowRight" && hasNext) {
        onIndex(index + 1);
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, hasPrev, hasNext, onClose, onIndex]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} — ${item.base}`}
        className="relative w-full max-w-5xl"
      >
        <div
          ref={panelRef}
          data-lenis-prevent
          className="grid max-h-[90vh] grid-cols-1 overflow-auto rounded-[var(--radius-card)] bg-paper shadow-lift md:grid-cols-[1.1fr_1fr]"
        >
          {/* image */}
          <div className="relative aspect-[4/5] bg-marble md:aspect-auto md:min-h-[60vh]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-5%,rgba(255,255,255,0.8),transparent_55%)]"
            />
            <Image
              key={item.image}
              src={item.image}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 92vw, 50vw"
              className="object-contain p-6 drop-shadow-[0_24px_40px_rgba(14,27,42,0.2)]"
            />
          </div>

          {/* info */}
          <div className="flex flex-col gap-5 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <Badge tone="navy">{item.type}</Badge>
              <span className="text-sm text-stone">{item.year}</span>
            </div>
            <h2 className="font-display text-[length:var(--text-title)] font-medium leading-tight text-ink">
              {item.title}
            </h2>
            <p className="text-base leading-relaxed text-ink/70">
              {item.description}
            </p>

            <dl className="mt-1 space-y-3 border-t border-mist pt-5 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Canvas</dt>
                <dd className="text-right text-ink">{item.base}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Materials</dt>
                <dd className="text-right text-ink">{item.materials}</dd>
              </div>
            </dl>

            {/* nav footer */}
            <div className="mt-auto flex items-center justify-between gap-4 pt-6">
              <span className="text-sm tabular-nums text-stone">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => hasPrev && onIndex(index - 1)}
                  disabled={!hasPrev}
                  aria-label="Previous piece"
                  className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-inset ring-mist transition-colors hover:bg-marble disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Arrow dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => hasNext && onIndex(index + 1)}
                  disabled={!hasNext}
                  aria-label="Next piece"
                  className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-inset ring-mist transition-colors hover:bg-marble disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Arrow dir="right" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* close */}
        <button
          type="button"
          data-close
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full bg-marble text-ink shadow-lift ring-1 ring-inset ring-mist transition-transform hover:scale-105 sm:-top-4 sm:-right-4"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={dir === "right" ? "rotate-180" : ""}
    >
      <path
        d="M11 3L5 9l6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
