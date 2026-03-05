// app/[locale]/(dashboard)/ecole/communication/page.tsx
'use client'

import { ClassAnnouncements } from '@/components/dashboard/ecole/communication/ClassAnnouncements'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MessageSquare, Send } from 'lucide-react'

export default function EcoleCommunicationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-primary" /> Communication
                    </h1>
                    <p className="text-muted-foreground font-medium">Gérez les annonces et échangez avec les parents.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ClassAnnouncements />
                </div>
                <div>
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                            <CardTitle className="font-heading text-xl font-bold flex items-center gap-2">
                                <Send className="h-5 w-5 text-primary" /> Envoi Rapide
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">Envoyez une notification push à tous les parents d'élèves de cette classe.</p>
                            <textarea
                                className="w-full h-32 p-4 rounded-2xl border bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none"
                                placeholder="Votre message urgent..."
                            />
                            <button className="w-full bg-primary text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Envoyer l'alerte
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
