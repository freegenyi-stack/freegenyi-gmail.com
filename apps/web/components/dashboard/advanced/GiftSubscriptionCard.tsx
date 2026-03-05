"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gift, Send } from "lucide-react"

export function GiftSubscriptionCard() {
    return (
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10">
                <Gift className="h-24 w-24 rotate-12" />
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Offrir FreeGeny Premium
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xs text-white/80 leading-relaxed">
                    Partagez la magie de l'apprentissage ! Offrez 1, 3 ou 12 mois de Premium à un proche.
                </p>
                <div className="flex gap-2">
                    <Input
                        placeholder="Email du bénéficiaire"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9 text-xs"
                    />
                    <Button size="sm" className="bg-white text-indigo-700 hover:bg-white/90 h-9 font-bold px-4">
                        <Send className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
