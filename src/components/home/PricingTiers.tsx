import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { TIERS } from "@/lib/commission";

/**
 * Home pricing section — the full Standard / Premium / Deluxe cards with the
 * per-item ranges. Numbers come from TIERS in lib/commission.ts (one source of
 * truth shared with the hero strip and the commission wizard).
 */
export function PricingTiers() {
  return (
    <section id="pricing" className="scroll-mt-[var(--header-h)] py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Three ways to commission."
          lead="Every piece is quoted individually — these are the ranges most commissions land in, by level of detail. The final number is always confirmed with you before any paint touches the canvas."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.value}
              className={cn(
                "relative flex flex-col rounded-[var(--radius-card)] border bg-paper p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1",
                t.popular ? "border-navy ring-1 ring-navy" : "border-mist",
              )}
            >
              {t.popular ? (
                <span className="absolute right-5 top-5 rounded-full bg-navy px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-marble">
                  Most popular
                </span>
              ) : null}

              <h3 className="font-display text-2xl font-medium text-ink">
                {t.name}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-stone">
                {t.tagline}
              </p>

              {/* ranges */}
              <dl className="mt-6 space-y-2 border-y border-mist py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink/70">Sneakers</dt>
                  <dd className="font-display text-lg font-medium text-navy">
                    {t.price.sneaker}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-ink/70">Jackets</dt>
                  <dd className="font-display text-lg font-medium text-navy">
                    {t.price.jacket}
                  </dd>
                </div>
              </dl>

              {/* includes */}
              <ul className="mt-5 flex flex-col gap-2.5">
                {t.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-ink/75">
                    <svg
                      aria-hidden
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 shrink-0 text-navy"
                    >
                      <path
                        d="M3 8.5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>

              <Link
                href="/commission"
                className={cn(
                  "mt-7 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors",
                  t.popular
                    ? "bg-navy text-marble hover:bg-navy-deep"
                    : "text-navy ring-1 ring-inset ring-navy/30 hover:bg-navy/[0.04]",
                )}
              >
                Start with {t.name}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink/70">
          Ranges are indicative and depend on detail and coverage — not a fixed
          list. Tell me your idea and I&rsquo;ll confirm an exact quote before
          anything begins.
        </p>
      </Container>
    </section>
  );
}
