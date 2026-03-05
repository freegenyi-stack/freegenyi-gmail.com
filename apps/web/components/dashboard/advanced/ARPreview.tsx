"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Box, Play } from "lucide-react"

export function ARPreview() {
    return (
        <Card className="bg-black text-white border-none shadow-xl overflow-hidden min-h-[160px] relative flex items-center justify-center text-center">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center" />
            <div className="relative z-10 p-6 space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Box className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-sm">Réalité Augmentée</h3>
                    <p className="text-[10px] text-white/70">Visualisez les exercices en 3D dans votre salon</p>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 px-5 rounded-full text-[10px] font-bold">
                    <Play className="h-3 w-3 mr-1 fill-current" /> Lancer l'aperçu
                </Button>
            </div>
        </Card>
    )
}
