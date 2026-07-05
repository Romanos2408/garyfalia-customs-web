import { cn } from "@/lib/cn";

/** Raised, gallery-grade surface — paper fill, hairline border, soft shadow. */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-mist bg-paper shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
