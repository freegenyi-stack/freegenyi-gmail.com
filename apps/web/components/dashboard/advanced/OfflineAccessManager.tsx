"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DownloadCloud, WifiOff, FileCheck } from "lucide-react"

export function OfflineAccessManager() {
    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <WifiOff className="h-5 w-5 text-primary" />
                    Accès Hors-ligne
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Contenu téléchargé</span>
                        <span className="font-bold">1.2 GB / 2 GB</span>
                    </div>
                    <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium">Programme Maths CE1</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Terminé</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <DownloadCloud className="h-4 w-4 text-blue-500 animate-pulse" />
                            <span className="text-xs font-medium">Français - Lecture</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">45%</span>
                    </div>
                </div>

                <Button className="w-full" variant="outline" size="sm">Gérer l'espace stockage</Button>
            </CardContent>
        </Card>
    )
}
