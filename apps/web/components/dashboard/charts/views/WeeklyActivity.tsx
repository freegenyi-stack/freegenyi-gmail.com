// apps/web/components/dashboard/charts/views/WeeklyActivity.tsx
"use client"

import * as Recharts from "recharts"
const {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} = Recharts as any
import type { WeeklyDataPoint } from "../types"

interface Props {
    data: WeeklyDataPoint[]
}

export function WeeklyActivity({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                    dataKey="day"
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
                    unit="ex"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "var(--shadow-sm)"
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    iconType="circle"
                />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="minutes"
                    name="الوقت (دقيقة)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="exercises"
                    name="التمارين"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(var(--secondary))" }}
                    activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
