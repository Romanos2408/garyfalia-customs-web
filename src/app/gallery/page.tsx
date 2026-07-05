import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { GalleryView } from "@/components/gallery/GalleryView";
import { CtaBand } from "@/components/shared/CtaBand";

export const metadata: Metadata = {
  title: "Gallery — Custom Sneakers & Jackets",
  description:
    "The full portfolio of Garyfalia Customs: hand-painted anime and pop-culture sneakers and denim jackets, each one a one-of-one commission.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="pt-[calc(var(--header-h)+3.5rem)]">
        <Container className="pb-12">
          <SectionHeading
            eyebrow="The Work"
            as="h1"
            title="Every piece, one of one."
            lead="A growing archive of past commissions — painted by hand onto sneakers and denim. Filter by type, or tap any piece to see it up close."
          />
        </Container>

        <GalleryView />
      </section>

      <div className="mt-24 sm:mt-32">
        <CtaBand
          title="See one you love? Yours can be next."
          copy="Every piece here started as someone's idea. Tell me yours and I'll paint it."
          primaryLabel="Get Yours Now"
          secondary={{ label: "About the artist", href: "/about" }}
        />
      </div>
    </>
  );
}
