"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle2, ChevronRight } from "lucide-react"

export function SubscriptionStatus() {
    return (
        <Card className="shadow-md border-primary/5 overflow-hidden">
            <div className="h-1 bg-gradient-premium" />
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Mon Abonnement
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Plan actuel</p>
                        <p className="font-heading font-bold text-lg">Premium Annuel</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Actif</Badge>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span>Accès illimité aux 35 langues</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span>Support prioritaire 24/7</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition mt-2 text-sm font-medium">
                    Détails de facturation
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
            </CardContent>
        </Card>
    )
}
