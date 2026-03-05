// apps/web/components/dashboard/charts/views/LongProgress.tsx
"use client"

import * as Recharts from "recharts"
const {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} = Recharts as any
import type { LongProgressData } from "../types"

interface Props {
    data: LongProgressData[]
}

export function LongProgress({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    unit="min"
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    unit="%"
                    domain={[0, 100]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="minutes"
                    name="الوقت (دقيقة)"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
                <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="score"
                    name="متوسط النتيجة"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
