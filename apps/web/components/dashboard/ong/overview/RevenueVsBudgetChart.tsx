
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function RevenueVsBudgetChart({ data }: { data: { program: string; budget: number; revenue: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="program" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget prévu" />
                <Bar dataKey="revenue" fill="hsl(var(--secondary))" name="Revenus reçus" />
            </BarChart>
        </ResponsiveContainer>
    )
}
