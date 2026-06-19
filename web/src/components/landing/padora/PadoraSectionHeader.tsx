import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  isRTL?: boolean;
};

export default function PadoraSectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
  isRTL,
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        isRTL && !centered && "text-right",
        className
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">{label}</p>
      <h2
        className={cn(
          "font-landing-display mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-[2.75rem]",
          isRTL && "font-ui-ar"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-slate-600 md:text-lg",
            isRTL && "font-lateef text-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
