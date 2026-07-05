"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { labVariants, type LabVariant } from "@/data/lab";

/** Floating switcher so the owner can flip between hero variations and compare. */
export function LabBar({ current }: { current: LabVariant }) {
  const idx = labVariants.findIndex((v) => v.id === current.id);
  const prev = labVariants[(idx - 1 + labVariants.length) % labVariants.length];
  const next = labVariants[(idx + 1) % labVariants.length];

  return (
    <div className="fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-mist bg-marble/85 p-1.5 pl-2 shadow-lift backdrop-blur-md">
        <Link
          href={`/lab/${prev.id}`}
          aria-label="Previous variation"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-paper hover:text-ink"
        >
          ‹
        </Link>

        <div className="px-2 text-center">
          <div className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-stone">
            {current.n} / {labVariants.length}
          </div>
          <div className="font-display text-sm font-medium text-ink">
            {current.name}
          </div>
        </div>

        <Link
          href={`/lab/${next.id}`}
          aria-label="Next variation"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-paper hover:text-ink"
        >
          ›
        </Link>

        <span className="mx-1 h-6 w-px bg-mist" />

        <div className="hidden items-center gap-1.5 px-1 sm:flex">
          {labVariants.map((v) => (
            <Link
              key={v.id}
              href={`/lab/${v.id}`}
              aria-label={v.name}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                v.id === current.id ? "bg-navy" : "bg-mist hover:bg-stone",
              )}
            />
          ))}
        </div>

        <Link
          href="/lab"
          className="ml-1 rounded-full px-3 py-1.5 text-xs font-medium text-ink/60 transition-colors hover:bg-paper hover:text-ink"
        >
          All
        </Link>
        <Link
          href="/"
          className="rounded-full px-3 py-1.5 text-xs font-medium text-ink/60 transition-colors hover:bg-paper hover:text-ink"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
