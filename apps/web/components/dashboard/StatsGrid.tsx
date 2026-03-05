import { StatCard } from "@/components/ui/StatCard"
import { Clock, BookOpen, Award, Target } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Stats {
    timeSpent: string      // ex: "12h 30m"
    exercisesDone: number
    points: number
    accuracy: number       // en %
}

export interface StatsTrends {
    time?: number
    exercises?: number
    points?: number
    accuracy?: number
}

interface StatsGridProps {
    stats: Stats
    trends?: StatsTrends
    className?: string
}

export function StatsGrid({ stats, trends, className }: StatsGridProps) {
    const statItems = [
        {
            title: "Temps total",
            value: stats.timeSpent,
            icon: <Clock className="h-5 w-5" />,
            trend: trends?.time,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Exercices",
            value: stats.exercisesDone,
            icon: <BookOpen className="h-5 w-5" />,
            trend: trends?.exercises,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100"
        },
        {
            title: "Points",
            value: stats.points,
            icon: <Award className="h-5 w-5" />,
            trend: trends?.points,
            color: "text-amber-600",
            bgColor: "bg-amber-100"
        },
        {
            title: "Précision",
            value: `${stats.accuracy}%`,
            icon: <Target className="h-5 w-5" />,
            trend: trends?.accuracy,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ]

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
            {statItems.map((item, index) => (
                <StatCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    icon={
                        <div className={cn("p-2 rounded-xl", item.bgColor)}>
                            <div className={item.color}>{item.icon}</div>
                        </div>
                    }
                    trend={item.trend !== undefined ? {
                        value: Math.abs(item.trend),
                        positive: item.trend > 0
                    } : undefined}
                />
            ))}
        </div>
    )
}
