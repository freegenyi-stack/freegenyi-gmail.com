// apps/web/components/dashboard/charts/UnifiedChart.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useChartData } from "./hooks/useChartData"
import type { ChartView } from "./types"

// Import dynamique pour éviter le SSR des graphiques (optionnel mais recommandé)
import dynamic from "next/dynamic"

const WeeklyActivity = dynamic(() => import("./views/WeeklyActivity").then(mod => mod.WeeklyActivity), { ssr: false })
const SubjectTimePie = dynamic(() => import("./views/SubjectTimePie").then(mod => mod.SubjectTimePie), { ssr: false })
const SkillsRadar = dynamic(() => import("./views/SkillsRadar").then(mod => mod.SkillsRadar), { ssr: false })
const LongProgress = dynamic(() => import("./views/LongProgress").then(mod => mod.LongProgress), { ssr: false })
const ChildrenComparison = dynamic(() => import("./views/ChildrenComparison").then(mod => mod.ChildrenComparison), { ssr: false })
const ActivityTypes = dynamic(() => import("./views/ActivityTypes").then(mod => mod.ActivityTypes), { ssr: false })
const GlobalScore = dynamic(() => import("./views/GlobalScore").then(mod => mod.GlobalScore), { ssr: false })

const VIEWS: { value: ChartView; label: string; component: React.ComponentType<any> }[] = [
    { value: "weekly", label: "📆 النشاط الأسبوعي", component: WeeklyActivity },
    { value: "subject-time", label: "⏱️ توزيع الوقت / المادة", component: SubjectTimePie },
    { value: "skills", label: "🧠 الكفاءات / المواد", component: SkillsRadar },
    { value: "long-progress", label: "📈 التقدم على المدى الطويل", component: LongProgress },
    { value: "comparison", label: "👥 مقارنة الأطفال", component: ChildrenComparison },
    { value: "activity-types", label: "🎮 أنواع الأنشطة", component: ActivityTypes },
    { value: "global-score", label: "🏆 النتيجة العامة", component: GlobalScore }
]

interface UnifiedChartProps {
    childId?: string      // optionnel : certaines vues (comparaison) n'en ont pas besoin
    className?: string
}

export function UnifiedChart({ childId, className }: UnifiedChartProps) {
    const [selectedView, setSelectedView] = useState<ChartView>("weekly")
    const { data, isLoading } = useChartData(selectedView, childId)

    const ActiveComponent = VIEWS.find(v => v.value === selectedView)?.component

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-heading text-xl">الإحصائيات</CardTitle>
                <Select value={selectedView} onValueChange={(v: ChartView) => setSelectedView(v)}>
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="اختر عرضاً" />
                    </SelectTrigger>
                    <SelectContent>
                        {VIEWS.map(view => (
                            <SelectItem key={view.value} value={view.value}>
                                {view.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="space-y-3 w-full">
                            <Skeleton className="h-[250px] w-full rounded-lg" />
                            <div className="flex justify-center">
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    ActiveComponent && <ActiveComponent data={data} />
                )}
            </CardContent>
        </Card>
    )
}
