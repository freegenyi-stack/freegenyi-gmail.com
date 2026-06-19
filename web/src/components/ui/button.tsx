import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "luxury"
    | "glassIcon"
    | "glassTrigger"
    | "nav"
    | "navActive"
    | "linkMuted"
    | "linkDark"
    | "glow"
    | "shimmer";
  size?: "default" | "sm" | "lg" | "icon" | "iconLg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-orange-600",
          variant === "outline" &&
            "rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50",
          variant === "ghost" &&
            "rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          variant === "secondary" &&
            "rounded-xl border border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-100",
          variant === "luxury" &&
            "rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-105 hover:shadow-orange-500/40",
          variant === "glow" &&
            "rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/45 hover:brightness-105",
          variant === "shimmer" &&
            "fg-shimmer-btn rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/20 hover:from-orange-600 hover:via-orange-500 hover:to-amber-500",
          variant === "glassIcon" &&
            "fg-glass-icon size-9 shrink-0 rounded-full p-0 sm:size-10",
          variant === "glassTrigger" &&
            "fg-glass-trigger inline-flex h-10 min-w-[10.5rem] justify-between gap-2 rounded-2xl px-3.5 text-sm text-gray-800 hover:border-orange-300/80 data-[state=open]:border-orange-400/80 data-[state=open]:ring-2 data-[state=open]:ring-orange-500/20",
          variant === "nav" &&
            "whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium text-gray-500 hover:text-orange-600 lg:px-5 xl:px-6",
          variant === "navActive" &&
            "whitespace-nowrap rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-800 shadow-sm lg:px-5 xl:px-6",
          variant === "linkMuted" &&
            "h-auto rounded-none bg-transparent p-0 text-sm font-medium text-gray-500 shadow-none hover:bg-transparent hover:text-orange-600",
          variant === "linkDark" &&
            "h-auto rounded-none bg-transparent p-0 text-sm font-medium text-gray-700 shadow-none hover:bg-transparent hover:text-orange-600",
          size === "default" && !["glassIcon", "nav", "navActive", "linkMuted", "linkDark"].includes(variant) && "h-11 px-5 text-sm",
          size === "sm" && "h-9 px-4 text-xs",
          size === "lg" && "h-12 px-8 text-sm",
          size === "icon" && variant !== "glassIcon" && "h-9 w-9 rounded-full p-0 sm:h-10 sm:w-10",
          size === "iconLg" && "h-10 w-10 rounded-full p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
