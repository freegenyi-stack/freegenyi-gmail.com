import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Subject {
    id: string
    name: string
    progress: number // 0-100
    icon: string
    target?: number
    color?: string
    bgColor?: string
}

interface SubjectProgressListProps {
    subjects: Subject[]
    className?: string
    showTarget?: boolean
}

const defaultColors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
]

export function SubjectProgressList({
    subjects,
    className,
    showTarget = true
}: SubjectProgressListProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle className="text-xl font-heading">Progression par matière</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {subjects.map((subject, index) => {
                    const progressColor = subject.color || defaultColors[index % defaultColors.length]
                    const isTargetReached = subject.target && subject.progress >= subject.target

                    return (
                        <div key={subject.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{subject.icon}</span>
                                    <span className="font-medium">{subject.name}</span>
                                    {showTarget && subject.target && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] h-5"
                                        >
                                            Objectif {subject.target}%
                                        </Badge>
                                    )}
                                </div>
                                <span className={cn(
                                    "font-semibold",
                                    subject.progress >= 80 ? "text-green-600" : "text-muted-foreground"
                                )}>
                                    {subject.progress}%
                                </span>
                            </div>
                            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className={cn(progressColor, "h-full transition-all duration-500")}
                                    style={{ width: `${Math.min(subject.progress, 100)}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
