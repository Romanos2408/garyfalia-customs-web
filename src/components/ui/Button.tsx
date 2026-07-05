import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "light" | "ghostLight";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none tracking-tight " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-out)] " +
  "will-change-transform select-none disabled:pointer-events-none disabled:opacity-50 " +
  "motion-safe:hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  // navy fill, marble text — the primary CTA on light sections
  primary:
    "bg-navy text-marble shadow-soft hover:bg-navy-deep hover:shadow-lift",
  // outline on light sections
  ghost:
    "bg-transparent text-ink ring-1 ring-inset ring-mist hover:ring-navy hover:bg-paper",
  // marble fill, navy text — primary CTA on dark navy bands
  light: "bg-marble text-navy shadow-soft hover:bg-paper hover:shadow-lift",
  // outline on dark navy bands
  ghostLight:
    "bg-transparent text-marble ring-1 ring-inset ring-marble/30 hover:ring-marble/70 hover:bg-marble/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base sm:h-14 sm:px-9",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type, ...rest } = props as ButtonAsButton;
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
