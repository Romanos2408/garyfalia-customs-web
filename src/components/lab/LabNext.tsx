import { Container, SectionHeading, Badge } from "@/components/ui";
import { PieceFrame } from "@/components/gallery/PieceFrame";
import { featuredGallery } from "@/data/gallery";

// A simple destination below each lab hero so the scroll-exit has context.
export function LabNext() {
  const items = featuredGallery.slice(0, 3);
  return (
    <section className="relative z-10 bg-marble py-24">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title="…and the gallery takes over."
          lead="This is just here so you can feel the hero hand off as you scroll. The real Selected Work section comes after you pick a hero."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group block">
              <PieceFrame item={item} sizes="(max-width: 640px) 100vw, 33vw" />
              <div className="flex items-baseline justify-between gap-3 pt-3">
                <h3 className="font-display text-lg font-medium text-ink">
                  {item.title}
                </h3>
                <Badge>{item.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
