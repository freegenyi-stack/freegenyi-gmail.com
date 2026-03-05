// app/[locale]/(dashboard)/ecole/settings/page.tsx
'use client'

import { ClassSettings } from '@/components/dashboard/ecole/settings/ClassSettings'
import { Settings } from 'lucide-react'

export default function EcoleSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Settings className="h-8 w-8 text-primary" /> Paramètres de Classe
                    </h1>
                    <p className="text-muted-foreground font-medium">Configurez les options et préférences de votre espace enseignant.</p>
                </div>
            </div>
            <div className="max-w-2xl">
                <ClassSettings />
            </div>
        </div>
    )
}
