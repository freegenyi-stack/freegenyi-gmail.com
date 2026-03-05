// app/[locale]/(dashboard)/ecole/students/page.tsx
'use client'

import { StudentList } from '@/components/dashboard/ecole/students/StudentList'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function EcoleStudentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" /> Gestion des Élèves
                    </h1>
                    <p className="text-muted-foreground font-medium">Suivez et gérez les dossiers de vos élèves.</p>
                </div>
            </div>
            <StudentList />
        </div>
    )
}
