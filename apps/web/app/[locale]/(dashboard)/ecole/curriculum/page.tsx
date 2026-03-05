// app/[locale]/(dashboard)/ecole/curriculum/page.tsx
'use client'

import { CurriculumView } from '@/components/dashboard/ecole/curriculum/CurriculumView'
import { ClipboardList } from 'lucide-react'

export default function EcoleCurriculumPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-primary" /> Suivi du Programme
                    </h1>
                    <p className="text-muted-foreground font-medium">Suivez l'avancement des compétences du programme national.</p>
                </div>
            </div>
            <CurriculumView />
        </div>
    )
}
