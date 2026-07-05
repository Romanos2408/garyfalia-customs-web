import Link from "next/link";
import { cn } from "@/lib/cn";

/** The brand wordmark — used in header + footer. */
export function Wordmark({
  className,
  light = false,
  onClick,
}: {
  className?: string;
  light?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex items-baseline gap-[0.4ch] font-display leading-none tracking-tight",
        light ? "text-marble" : "text-ink",
        className,
      )}
    >
      <span className="text-[1.35rem] font-medium">Garyfalia</span>
      <span
        className={cn(
          "text-[1.35rem] font-light italic",
          light ? "text-marble/70" : "text-ink/70",
        )}
      >
        Customs
      </span>
    </Link>
  );
}
