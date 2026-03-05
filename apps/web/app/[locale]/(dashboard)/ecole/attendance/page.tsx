// app/[locale]/(dashboard)/ecole/attendance/page.tsx
'use client'

import { AttendanceSheet } from '@/components/dashboard/ecole/attendance/AttendanceSheet'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CalendarCheck } from 'lucide-react'

export default function EcoleAttendancePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <CalendarCheck className="h-8 w-8 text-primary" /> Registre de Présences
                    </h1>
                    <p className="text-muted-foreground font-medium">Effectuez l'appel quotidien et suivez les assiduités.</p>
                </div>
            </div>
            <AttendanceSheet />
        </div>
    )
}
