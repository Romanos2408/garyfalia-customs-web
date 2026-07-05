import { cn } from "@/lib/cn";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Layout wrapper — comfortable max width with responsive gutters. */
export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Comp = (as ?? "div") as React.ElementType;
  return (
    <Comp
      className={cn("mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
