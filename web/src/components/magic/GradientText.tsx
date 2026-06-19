"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
};

export default function GradientText({ children, className, as: Tag = "span" }: Props) {
  return (
    <Tag
      className={cn(
        "fg-gradient-text bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </Tag>
  );
}
