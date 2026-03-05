// app/[locale]/(dashboard)/ecole/grades/page.tsx
'use client'

import { Gradebook } from '@/components/dashboard/ecole/grades/Gradebook'
import { GradeChart } from '@/components/dashboard/ecole/grades/GradeChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { GraduationCap, TrendingUp } from 'lucide-react'
import { useGrades } from '@/components/dashboard/ecole/hooks/useGrades'

export default function EcoleGradesPage() {
    const { grades } = useGrades()
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-primary" /> Carnet de Notes
                    </h1>
                    <p className="text-muted-foreground font-medium">Visualisez les performances et gérez les évaluations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Gradebook />
                </div>
                <div>
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" /> Progression
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <GradeChart data={grades} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
