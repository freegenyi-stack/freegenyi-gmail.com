import { cn } from "@/lib/utils"

interface SectionTitleProps {
    title: string
    subtitle?: string
    className?: string
    align?: "left" | "center" | "right"
}

export function SectionTitle({
    title,
    subtitle,
    className,
    align = "left"
}: SectionTitleProps) {
    return (
        <div className={cn(
            "space-y-2",
            align === "center" && "text-center",
            align === "right" && "text-right",
            className
        )}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-muted-foreground font-body max-w-3xl">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
