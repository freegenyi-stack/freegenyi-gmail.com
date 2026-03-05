"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings2, GripVertical, CheckCircle2, Lock } from "lucide-react"

export function LearningPathCustomizer() {
    const MODULES = [
        { id: "m1", title: "Nombres et calculs", level: "CE1", status: "completed" },
        { id: "m2", title: "Géométrie de base", level: "CE1", status: "locked" },
        { id: "m3", title: "Grammaire : Le verbe", level: "CE1", status: "available" },
    ]

    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Personnaliser le parcours
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {MODULES.map((module) => (
                    <div key={module.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm transition-all hover:border-primary/30">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="flex-1">
                            <p className="text-xs font-bold leading-tight">{module.title}</p>
                            <p className="text-[10px] text-muted-foreground">{module.level}</p>
                        </div>
                        {module.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {module.status === "locked" && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <Button variant="ghost" size="sm" className="h-7 text-[10px]">Ajuster</Button>
                    </div>
                ))}
                <Button variant="outline" className="w-full text-xs h-9 mt-2">Réinitialiser le parcours</Button>
            </CardContent>
        </Card>
    )
}
