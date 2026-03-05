// app/[locale]/(dashboard)/ecole/analytics/page.tsx
'use client'

import { ClassAnalytics } from '@/components/dashboard/ecole/analytics/ClassAnalytics'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'

export default function EcoleAnalyticsPage() {
    const mockData = [
        { name: 'Participation', value: 85 },
        { name: 'Réussite devoirs', value: 72 },
        { name: 'Assiduité', value: 94 },
        { name: 'Progression', value: 68 },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-primary" /> Analyses & Rapports
                    </h1>
                    <p className="text-muted-foreground font-medium">Consultez les statistiques détaillées de votre classe.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ClassAnalytics data={mockData} />
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" /> Synthèse Globale
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Taux de réussite moyen</p>
                            <p className="text-3xl font-black text-primary">79.5%</p>
                            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '79.5%' }} />
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Assiduité mensuelle</p>
                            <p className="text-3xl font-black text-green-600">92%</p>
                            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '92%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
