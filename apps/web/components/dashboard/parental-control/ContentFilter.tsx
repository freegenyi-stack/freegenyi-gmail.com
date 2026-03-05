"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ShieldAlert, BookOpen, Music, Play } from "lucide-react"

export function ContentFilter({ onUpdate }: { onUpdate: (filters: any) => void }) {
    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Filtrage de contenu
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen className="h-4 w-4" /></div>
                        <div>
                            <p className="text-sm font-medium">Contenu éducatif uniquement</p>
                            <p className="text-xs text-muted-foreground">Bloque les jeux non-pédagogiques</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Music className="h-4 w-4" /></div>
                        <div>
                            <p className="text-sm font-medium">Musique relaxante</p>
                            <p className="text-xs text-muted-foreground">Active l'ambiance sonore de travail</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Play className="h-4 w-4" /></div>
                        <div>
                            <p className="text-sm font-medium">Auto-play vidéo</p>
                            <p className="text-xs text-muted-foreground">Lancer la prochaine leçon automatiquement</p>
                        </div>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    )
}
