"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

export function MultiChildComparison() {
    const data = [
        { subject: "Maths", Amine: 85, Sarah: 72 },
        { subject: "Français", Amine: 70, Sarah: 88 },
        { subject: "Sciences", Amine: 90, Sarah: 65 },
        { subject: "Arabe", Amine: 60, Sarah: 75 },
    ]

    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading">Comparaison Fratrie</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis dataKey="subject" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="top" align="right" fontSize={12} iconType="circle" />
                            <Bar dataKey="Amine" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="Sarah" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
