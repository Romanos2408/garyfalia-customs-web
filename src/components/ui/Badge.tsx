import { cn } from "@/lib/cn";

/** Small pill label — e.g. a piece's type or year. */
export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "navy" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]",
        tone === "default" && "bg-marble/80 text-ink/70 ring-1 ring-inset ring-mist",
        tone === "navy" && "bg-navy text-marble",
        tone === "light" && "bg-marble/15 text-marble ring-1 ring-inset ring-marble/25",
        className,
      )}
    >
      {children}
    </span>
  );
}
