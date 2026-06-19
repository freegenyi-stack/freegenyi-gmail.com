"use client";

import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ShimmerLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  shimmerColor?: string;
  background?: string;
};

export const ShimmerLink = forwardRef<HTMLAnchorElement, ShimmerLinkProps>(
  (
    {
      className,
      children,
      shimmerColor = "rgba(255,255,255,0.45)",
      background = "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #ea580c 100%)",
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        {...props}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--btn-bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5",
          "text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(234,88,12,0.65)]",
          "transition-transform duration-300 active:scale-[0.98]",
          "before:absolute before:inset-0 before:rounded-full before:[background:var(--btn-bg)]",
          "after:absolute after:inset-0 after:animate-shimmer-slide after:rounded-full",
          "after:bg-[linear-gradient(110deg,transparent_25%,var(--shimmer-color)_50%,transparent_75%)]",
          "after:bg-[length:200%_100%]",
          className
        )}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }
);
ShimmerLink.displayName = "ShimmerLink";
