"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Zap } from "lucide-react"

export function VoiceCommandShortcut() {
    return (
        <Card className="shadow-md border-primary/5 hover:border-primary/20 transition cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mic className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-sm">Commande Vocale</h3>
                    <p className="text-xs text-muted-foreground italic">"Dis: Montre-moi les progrès d'Amine"</p>
                </div>
                <div className="ml-auto">
                    <Zap className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
            </CardContent>
        </Card>
    )
}
