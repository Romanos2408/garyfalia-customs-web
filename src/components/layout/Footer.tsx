import Link from "next/link";
import { Container } from "@/components/ui";
import { navLinks, site } from "@/data/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="marble-veins mt-auto bg-navy-deep text-marble">
      <Container className="py-16 sm:py-20">
        {/* CTA line */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-marble/15 pb-12 md:flex-row md:items-end">
          <p className="max-w-xl font-display text-[length:var(--text-title)] font-light leading-tight text-marble">
            Got a piece in mind? Let&rsquo;s make it real.
          </p>
          <Link
            href="/commission"
            className="inline-flex h-12 shrink-0 items-center rounded-full bg-marble px-7 text-sm font-medium text-navy shadow-soft transition-[transform,background-color] duration-300 ease-[var(--ease-out)] motion-safe:hover:-translate-y-0.5 hover:bg-paper"
          >
            Get a Commission
          </Link>
        </div>

        {/* columns */}
        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark light />
            <p className="measure-narrow mt-4 text-sm leading-relaxed text-marble/60">
              {site.intro}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-marble/40">
              Explore
            </h2>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-marble/75 transition-colors hover:text-marble"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-marble/40">
              Contact
            </h2>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-sm text-marble/75 transition-colors hover:text-marble"
            >
              {site.instagram.handle}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="w-fit text-sm text-marble/75 transition-colors hover:text-marble"
            >
              {site.email}
            </a>
            <span className="text-sm text-marble/50">{site.location}</span>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-marble/15 pt-6 text-xs text-marble/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {site.name}. All artwork hand-painted to order.
          </span>
          <span>Wearable art, made by hand.</span>
        </div>
      </Container>
    </footer>
  );
}
