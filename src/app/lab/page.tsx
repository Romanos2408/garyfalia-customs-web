import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading, Badge, Button } from "@/components/ui";
import { labVariants } from "@/data/lab";

export const metadata: Metadata = {
  title: "Hero Lab",
  robots: { index: false, follow: false },
};

export default function LabIndexPage() {
  return (
    <section className="pt-[calc(var(--header-h)+3.5rem)]">
      <Container className="pb-28">
        <SectionHeading
          eyebrow="Hero Lab — pick one"
          as="h1"
          title="Four refined takes."
          lead="All keep the calm editorial feel of the current home — no busy clutter. They differ in composition and in the single signature move. Open one, scroll it slowly. Your live home is untouched at /."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {labVariants.map((v) => (
            <Link
              key={v.id}
              href={`/lab/${v.id}`}
              className="group flex flex-col gap-4 rounded-[var(--radius-card)] border border-mist bg-paper p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl font-light text-mist transition-colors group-hover:text-navy">
                  {String(v.n).padStart(2, "0")}
                </span>
                {v.recommended ? <Badge tone="navy">Recommended</Badge> : null}
              </div>
              <h2 className="font-display text-2xl font-medium text-ink">
                {v.name}
              </h2>
              <p className="text-sm leading-relaxed text-ink/60">{v.blurb}</p>
              <span className="mt-2 text-sm font-medium text-navy">
                Open &amp; scroll it →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-mist pt-8">
          <Button href="/" variant="ghost">
            ← Back to the current home
          </Button>
          <p className="text-sm text-stone">
            Best on desktop — scroll slowly and watch how each hero hands off.
          </p>
        </div>
      </Container>
    </section>
  );
}
