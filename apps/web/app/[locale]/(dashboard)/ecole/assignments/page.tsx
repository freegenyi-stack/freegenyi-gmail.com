// app/[locale]/(dashboard)/ecole/assignments/page.tsx
'use client'

import { AssignmentCreatorWizard } from '@/components/dashboard/ecole/assignments/AssignmentCreatorWizard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BookOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function EcoleAssignmentsPage() {
    const [isWizardOpen, setIsWizardOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" /> Devoirs & Exercices
                    </h1>
                    <p className="text-muted-foreground font-medium">Créez et gérez les travaux à réaliser par vos élèves.</p>
                </div>
                <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl h-12 px-6 gap-2 shadow-lg shadow-primary/20 font-bold hover:scale-105 transition-transform">
                            <Plus className="h-5 w-5" /> Créer un devoir
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-3xl">
                        <AssignmentCreatorWizard onComplete={() => setIsWizardOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for list - could add an AssignmentList component later */}
                {[1, 2, 3].map(i => (
                    <Card key={i} className="border-none shadow-lg rounded-3xl hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="h-2 bg-primary/20" />
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">Exercice {i}: Les Fractions</h3>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Mathématiques</p>
                                </div>
                                <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold">ACTIF</div>
                            </div>
                            <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
                                <span>Échéance: 15/02</span>
                                <span>12/24 rendus</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
