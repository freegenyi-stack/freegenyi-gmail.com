
'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function DonorSegmentChart({ data }: { data: { name: string; value: number }[] }) {
    const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#f59e0b', '#94a3b8', '#10b981']

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}
