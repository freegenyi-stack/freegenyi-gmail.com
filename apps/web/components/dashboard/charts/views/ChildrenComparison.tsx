// apps/web/components/dashboard/charts/views/ChildrenComparison.tsx
"use client"

import * as Recharts from "recharts"
const {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} = Recharts as any
import type { ChildComparisonData } from "../types"

interface Props {
    data: ChildComparisonData[]
}

export function ChildrenComparison({ data }: Props) {
    // Détermine les matières dynamiquement
    const subjects = data.length
        ? Object.keys(data[0]).filter(key => key !== "childName")
        : []

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                    dataKey="childName"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    unit="%"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                {subjects.map((subject, index) => (
                    <Bar
                        key={subject}
                        dataKey={subject}
                        name={subject}
                        fill={`hsl(${index * 45}, 70%, 50%)`}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}
