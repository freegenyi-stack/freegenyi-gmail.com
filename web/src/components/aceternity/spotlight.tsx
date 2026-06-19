"use client";

import { cn } from "@/lib/utils";

/** Effet spotlight Aceternity-style — hero sobre, fond clair */
export function Spotlight({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-0 h-[169%] w-[138%] animate-pulse lg:w-[84%]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden
    >
      <g filter="url(#fg-spotlight)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="url(#fg-spotlight-fill)"
          fillOpacity="0.35"
        />
      </g>
      <defs>
        <filter
          id="fg-spotlight"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id="fg-spotlight-fill"
          x1="1924.71"
          y1="0"
          x2="1924.71"
          y2="547.002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
