"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, CheckCircle2, Circle } from "lucide-react"

interface Goal {
    id: string
    title: string
    current: number
    target: number
    completed: boolean
}

interface GoalTrackerProps {
    initialGoals: Goal[]
    onAddGoal: (goal: Omit<Goal, "id" | "completed">) => void
    onUpdateGoal: (id: string, current: number) => void
}

export function GoalTracker({ initialGoals, onAddGoal, onUpdateGoal }: GoalTrackerProps) {
    const [goals, setGoals] = useState<Goal[]>(initialGoals.length > 0 ? initialGoals : [
        { id: "g1", title: "Exercices de maths", current: 5, target: 10, completed: false },
        { id: "g2", title: "Minutes de lecture", current: 120, target: 180, completed: false }
    ])

    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Objectifs de la semaine
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Ajouter
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {goal.completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                                <span className="text-sm font-medium">{goal.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{goal.current} / {goal.target}</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
