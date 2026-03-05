"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Swords } from "lucide-react"

export function WeeklyChallengeBuilder() {
    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Swords className="h-5 w-5 text-primary" />
                    Défi de la semaine
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 flex flex-col items-center text-center gap-2">
                    <Calendar className="h-8 w-8 text-primary/40" />
                    <div>
                        <p className="text-sm font-bold">Aucun défi actif</p>
                        <p className="text-xs text-muted-foreground">Créez un défi personnalisé pour motiver vos enfants.</p>
                    </div>
                    <Button size="sm" variant="premium" className="mt-2">
                        <Plus className="h-3 w-3 mr-1" /> Nouveau défi
                    </Button>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Modèles rapides</p>
                    <div className="grid grid-cols-1 gap-2">
                        {["Marathon des Maths", "Champion d'Orthographe", "Explorateur de Sciences"].map((template, i) => (
                            <Button key={i} variant="outline" className="justify-start h-10 text-xs font-medium bg-white/50">
                                {template}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
