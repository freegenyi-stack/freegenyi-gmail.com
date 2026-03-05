"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Share2, ClipboardList } from "lucide-react"

export function ReportBuilder() {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = () => {
        setIsGenerating(true)
        setTimeout(() => setIsGenerating(false), 2000)
    }

    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Générateur de Rapports
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Rapport mensuel : Janvier</p>
                            <p className="text-xs text-muted-foreground">Prêt pour téléchargement</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                            <Download className="h-3 w-3 mr-2" /> PDF
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                            <Share2 className="h-3 w-3 mr-2" /> Envoyer
                        </Button>
                    </div>
                </div>

                <Button
                    className="w-full h-11 font-bold"
                    variant="premium"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? "Génération en cours..." : "Générer un nouveau rapport"}
                </Button>
            </CardContent>
        </Card>
    )
}
