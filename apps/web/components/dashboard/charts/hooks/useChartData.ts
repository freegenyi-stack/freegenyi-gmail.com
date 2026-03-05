// apps/web/components/dashboard/charts/hooks/useChartData.ts
"use client"

import { useEffect, useState } from "react"
import type {
    ChartView,
    WeeklyDataPoint,
    SubjectTimeData,
    SkillData,
    LongProgressData,
    ChildComparisonData,
    ActivityTypeData,
    GlobalScoreData
} from "../types"

// Données mockées par vue
const mockData = {
    weekly: (childId?: string): WeeklyDataPoint[] => [
        { day: "Lun", minutes: 25, exercises: 4 },
        { day: "Mar", minutes: 40, exercises: 6 },
        { day: "Mer", minutes: 35, exercises: 5 },
        { day: "Jeu", minutes: 30, exercises: 4 },
        { day: "Ven", minutes: 45, exercises: 7 },
        { day: "Sam", minutes: 20, exercises: 3 },
        { day: "Dim", minutes: 15, exercises: 2 }
    ],
    "subject-time": (childId?: string): SubjectTimeData[] => [
        { subject: "Maths", time: 185, fill: "hsl(168 55% 32%)" },
        { subject: "Français", time: 140, fill: "hsl(12 80% 65%)" },
        { subject: "Sciences", time: 95, fill: "hsl(45 80% 50%)" },
        { subject: "Histoire", time: 70, fill: "hsl(200 70% 45%)" }
    ],
    skills: (childId?: string): SkillData[] => [
        { subject: "Calcul", value: 85 },
        { subject: "Géométrie", value: 70 },
        { subject: "Grammaire", value: 65 },
        { subject: "Conjugaison", value: 80 },
        { subject: "Expériences", value: 90 }
    ],
    "long-progress": (childId?: string): LongProgressData[] => [
        { week: "S10", minutes: 180, score: 72 },
        { week: "S11", minutes: 210, score: 75 },
        { week: "S12", minutes: 195, score: 78 },
        { week: "S13", minutes: 240, score: 82 },
        { week: "S14", minutes: 225, score: 85 },
        { week: "S15", minutes: 260, score: 87 }
    ],
    comparison: (): ChildComparisonData[] => [
        { childName: "Léo", Maths: 85, Français: 70, Sciences: 90 },
        { childName: "Emma", Maths: 75, Français: 90, Sciences: 65 },
        { childName: "Noah", Maths: 95, Français: 60, Sciences: 80 }
    ],
    "activity-types": (): ActivityTypeData[] => [
        { type: "Exercices", count: 45, week: "Cette semaine" },
        { type: "Jeux", count: 12, week: "Cette semaine" },
        { type: "Vidéos", count: 8, week: "Cette semaine" },
        { type: "Défis", count: 5, week: "Cette semaine" }
    ],
    "global-score": (childId?: string): GlobalScoreData => ({
        current: 2450,
        target: 3000,
        unit: "pts"
    })
}

export function useChartData(view: ChartView, childId?: string) {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        // Simule un appel API
        const timer = setTimeout(() => {
            const fetcher = mockData[view]
            setData(fetcher(childId))
            setIsLoading(false)
        }, 600) // délai artificiel pour voir le loader

        return () => clearTimeout(timer)
    }, [view, childId])

    return { data, isLoading }
}
