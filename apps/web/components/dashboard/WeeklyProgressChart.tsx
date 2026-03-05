"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps
} from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

export interface WeeklyDataPoint {
    day: string
    minutes: number
    exercises?: number
    score?: number
}

interface WeeklyProgressChartProps {
    data: WeeklyDataPoint[]
    className?: string
    showExercises?: boolean
    title?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                <p className="font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name} :</span>
                        <span className="font-semibold">{entry.value} {entry.unit}</span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export function WeeklyProgressChart({
    data,
    className,
    showExercises = false,
    title = "Activité hebdomadaire"
}: WeeklyProgressChartProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-heading">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={{ stroke: "hsl(var(--border))" }}
                            />
                            <YAxis
                                yAxisId="minutes"
                                orientation="left"
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={{ stroke: "hsl(var(--border))" }}
                                unit="min"
                            />
                            {showExercises && (
                                <YAxis
                                    yAxisId="exercises"
                                    orientation="right"
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                    axisLine={{ stroke: "hsl(var(--border))" }}
                                    tickLine={{ stroke: "hsl(var(--border))" }}
                                    unit="ex"
                                />
                            )}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                                iconType="circle"
                            />
                            <Line
                                yAxisId="minutes"
                                type="monotone"
                                dataKey="minutes"
                                name="Minutes"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                                unit="min"
                            />
                            {showExercises && (
                                <Line
                                    yAxisId="exercises"
                                    type="monotone"
                                    dataKey="exercises"
                                    name="Exercices"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: "hsl(var(--secondary))", strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                                    unit="ex"
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
