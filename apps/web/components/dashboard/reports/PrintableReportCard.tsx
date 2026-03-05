"use client"

import { forwardRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface PrintableReportCardProps {
    childName: string
    period: string
    stats: {
        timeSpent: string
        exercisesDone: number
        accuracy: number
        badges: number
    }
    subjects: {
        name: string
        progress: number
    }[]
    className?: string
}

export const PrintableReportCard = forwardRef<HTMLDivElement, PrintableReportCardProps>(
    ({ childName, period, stats, subjects, className }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto print:shadow-none", className)}
            >
                <div className="border-b pb-4 mb-4">
                    <h1 className="font-heading text-3xl font-bold text-primary">FreeGeny</h1>
                    <p className="text-sm text-muted-foreground">
                        Rapport de progression pour {childName} • {period}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Généré le {format(new Date(), "dd MMMM yyyy", { locale: fr })}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-accent/20 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Temps total</p>
                        <p className="font-heading text-xl font-bold">{stats.timeSpent}</p>
                    </div>
                    <div className="bg-accent/20 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Exercices</p>
                        <p className="font-heading text-xl font-bold">{stats.exercisesDone}</p>
                    </div>
                    <div className="bg-accent/20 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Précision</p>
                        <p className="font-heading text-xl font-bold">{stats.accuracy}%</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="font-heading text-lg font-semibold mb-3">Progression par matière</h2>
                    <div className="space-y-3">
                        {subjects.map((subject, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{subject.name}</span>
                                    <span className="font-medium">{subject.progress}%</span>
                                </div>
                                <Progress value={subject.progress} className="h-2" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
                    <span>FreeGeny • Éducation pour tous</span>
                    <span>Page 1/1</span>
                </div>
            </div>
        )
    }
)

PrintableReportCard.displayName = "PrintableReportCard"
