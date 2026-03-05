"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Zap } from "lucide-react"

interface Reward {
    id: string
    name: string
    description: string
    cost: number
    icon: string
    category: "time" | "content" | "physical"
}

interface RewardsStoreProps {
    userPoints: number
    onRedeem: (reward: Reward) => void
}

const DEFAULT_REWARDS: Reward[] = [
    { id: "r1", name: "15 min de temps libre", description: "Ajoute 15 minutes à la session actuelle", cost: 100, icon: "⏳", category: "time" },
    { id: "r2", name: "Nouveau thème Avatar", description: "Débloque le thème Espace", cost: 250, icon: "👨‍🚀", category: "content" },
    { id: "r3", name: "Coloriage Spécial", description: "Un dessin unique à imprimer", cost: 50, icon: "🎨", category: "content" },
]

export function RewardsStore({ userPoints, onRedeem }: RewardsStoreProps) {
    return (
        <Card className="w-full h-full shadow-md border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Boutique de Récmpenses
                </CardTitle>
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full text-xs font-bold">
                    <Zap className="h-3 w-3 fill-current" />
                    {userPoints} pts
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                        {DEFAULT_REWARDS.map((reward) => (
                            <div key={reward.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition shadow-sm">
                                <span className="text-2xl">{reward.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{reward.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{reward.description}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant={userPoints >= reward.cost ? "premium" : "outline"}
                                    disabled={userPoints < reward.cost}
                                    onClick={() => onRedeem(reward)}
                                >
                                    {reward.cost} pts
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
