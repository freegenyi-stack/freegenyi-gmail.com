// apps/web/components/dashboard/charts/views/SkillsRadar.tsx
"use client"

import * as Recharts from "recharts"
const {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} = Recharts as any
import type { SkillData } from "../types"

interface Props {
    data: SkillData[]
}

export function SkillsRadar({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                    name="الإتقان"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                />
            </RadarChart>
        </ResponsiveContainer>
    )
}
