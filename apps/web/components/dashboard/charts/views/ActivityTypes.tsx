// apps/web/components/dashboard/charts/views/ActivityTypes.tsx
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
import type { ActivityTypeData } from "../types"

interface Props {
    data: ActivityTypeData[]
}

export function ActivityTypes({ data }: Props) {
    // Transformer pour stacked bar – on suppose une seule semaine
    const transformed = [
        {
            name: data[0]?.week || "Cette semaine",
            ...data.reduce((acc, item) => ({ ...acc, [item.type]: item.count }), {})
        }
    ]

    const types = data.map(d => d.type)

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformed} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)"
                    }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                {types.map((type, index) => (
                    <Bar
                        key={type}
                        dataKey={type}
                        name={type}
                        stackId="a"
                        fill={`hsl(${index * 60}, 70%, 50%)`}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}
