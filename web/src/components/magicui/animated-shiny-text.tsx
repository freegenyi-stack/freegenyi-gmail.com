import { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type AnimatedShinyTextProps = ComponentPropsWithoutRef<"span"> & {
  shimmerWidth?: number;
};

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 120,
  ...props
}: AnimatedShinyTextProps) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "animate-shiny-text bg-[length:var(--shiny-width)_100%] bg-clip-text bg-no-repeat [background-position:0_0]",
        "bg-gradient-to-r from-transparent via-orange-600/90 via-50% to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
