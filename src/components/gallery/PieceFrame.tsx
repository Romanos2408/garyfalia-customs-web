import Image from "next/image";
import { cn } from "@/lib/cn";
import type { GalleryItem } from "@/data/gallery";

/**
 * The cream-framed artwork image — shared by the home featured strip, the
 * gallery grid and the about page so the framing + hover zoom stay identical.
 * The transparent 4:5 PNGs sit object-contain on paper, so nothing crops.
 *
 * The inner [data-parallax] wrapper is the hook the home/gallery sections use
 * to drift the image on scroll. `group-hover` zoom is driven by the nearest
 * `.group` ancestor (the card / button the parent wraps this in).
 */
export function PieceFrame({
  item,
  sizes,
  priority = false,
  className,
  rounded = true,
  children,
}: {
  item: GalleryItem;
  sizes: string;
  priority?: boolean;
  className?: string;
  rounded?: boolean;
  /** optional overlay (e.g. hover caption) rendered clipped inside the frame */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden border border-mist bg-paper",
        rounded && "rounded-[var(--radius-card)]",
        className,
      )}
    >
      {/* faint top-light so the cream frame reads as a lit surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.7),transparent_55%)]"
      />
      <div data-parallax className="absolute inset-[-4%]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-[9%] drop-shadow-[0_18px_30px_rgba(14,27,42,0.16)] transition-transform duration-[900ms] ease-[var(--ease-out)] will-change-transform group-hover:scale-[1.05]"
        />
      </div>
      {children}
    </div>
  );
}
