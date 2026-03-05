import { cn } from "@/lib/utils"

interface ProgressRingProps {
    progress: number        // 0-100
    size?: number
    strokeWidth?: number
    className?: string
    children?: React.ReactNode
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    className,
    children
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Cercle de fond */}
                <circle
                    className="text-muted"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Cercle de progression */}
                <circle
                    className="text-primary transition-all duration-500 ease-out"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children || <span className="text-sm font-medium">{Math.round(progress)}%</span>}
            </div>
        </div>
    )
}
