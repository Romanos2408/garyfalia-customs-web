"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/data/site";

export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // lock background scroll + Esc to close + focus trap while open
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
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
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      data-lenis-prevent
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-40 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-navy-deep/30 backdrop-blur-sm transition-opacity duration-400 ease-[var(--ease-out)]",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col bg-marble shadow-lift transition-transform duration-500 ease-[var(--ease-out)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-1 px-7 pt-[calc(var(--header-h)+1rem)]"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={isActive(link.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={cn(
                "border-b border-mist py-4 font-display text-2xl transition-[opacity,transform] duration-500 ease-[var(--ease-out)]",
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0",
                link.cta
                  ? "text-navy"
                  : isActive(link.href)
                    ? "text-ink"
                    : "text-ink/70",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-7 pb-10">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            {site.instagram.handle}
          </a>
        </div>
      </div>
    </div>
  );
}
