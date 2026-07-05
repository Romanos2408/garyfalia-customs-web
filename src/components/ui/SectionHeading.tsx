import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[length:var(--text-eyebrow)] font-semibold uppercase tracking-[0.22em]",
        light ? "text-marble/60" : "text-stone",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-7",
          light ? "bg-marble/30" : "bg-stone/50",
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  light = false,
  as: Heading = "h2",
  className,
  id,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <Heading
        id={id}
        className={cn(
          "text-[length:var(--text-display)] font-light leading-[1.04]",
          light ? "text-marble" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <p
          className={cn(
            "measure text-lg leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-marble/70" : "text-ink/65",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
