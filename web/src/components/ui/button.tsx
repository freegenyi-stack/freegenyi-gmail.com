import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "luxury";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-slate-900 text-white hover:bg-orange-600 shadow-lg shadow-slate-900/10",
          variant === "outline" && "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50",
          variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          variant === "secondary" && "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100",
          variant === "luxury" &&
            "rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-105 hover:shadow-orange-500/40",
          size === "default" && "h-11 px-5 text-sm",
          size === "sm" && "h-9 px-4 text-xs",
          size === "lg" && "h-12 px-8 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
