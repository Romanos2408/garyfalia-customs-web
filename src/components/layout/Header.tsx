"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { navLinks } from "@/data/site";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // subtle solid/blur background + shrink once the user leaves the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // home hero is a dark full-bleed video — use light header chrome while sitting
  // over it (i.e. at the top, before the solid marble bar fades in).
  const onDark = pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out)]",
        scrolled
          ? "border-b border-mist/70 bg-marble/80 backdrop-blur-md supports-[backdrop-filter]:bg-marble/65"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center justify-between px-6 transition-[height] duration-500 ease-[var(--ease-out)] sm:px-8 lg:px-12",
          scrolled ? "h-16" : "h-[var(--header-h)]",
        )}
      >
        <Wordmark light={onDark} />

        {/* desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks
            .filter((l) => !l.cta)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive(link.href)
                    ? onDark
                      ? "text-marble"
                      : "text-ink"
                    : onDark
                      ? "text-marble/80 hover:text-marble"
                      : "text-ink/70 hover:text-ink",
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-px origin-left transition-transform duration-300 ease-[var(--ease-out)]",
                    onDark ? "bg-marble" : "bg-navy",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          <Link
            href="/commission"
            className={cn(
              "ml-3 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium shadow-soft transition-[transform,background-color] duration-300 ease-[var(--ease-out)] motion-safe:hover:-translate-y-0.5",
              onDark
                ? "bg-marble text-ink hover:bg-white"
                : "bg-navy text-marble hover:bg-navy-deep",
            )}
          >
            Get a Commission
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-6 transition-transform duration-300 ease-[var(--ease-out)]",
                onDark ? "bg-marble" : "bg-ink",
                menuOpen ? "top-1/2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 transition-opacity duration-200",
                onDark ? "bg-marble" : "bg-ink",
                menuOpen ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-6 transition-transform duration-300 ease-[var(--ease-out)]",
                onDark ? "bg-marble" : "bg-ink",
                menuOpen ? "top-1/2 -rotate-45" : "bottom-0",
              )}
            />
          </span>
        </button>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isActive={isActive}
      />
    </header>
  );
}
