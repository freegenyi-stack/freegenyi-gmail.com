"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Award } from "lucide-react"

interface BadgeData {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
    rarity: "common" | "rare" | "epic" | "legendary"
    progress?: number
}

interface BadgeCollectionProps {
    badges?: BadgeData[]
}

const DEFAULT_BADGES: BadgeData[] = [
    { id: "1", name: "Explorateur", description: "A complété son premier exercice", icon: "🚀", unlocked: true, rarity: "common" },
    { id: "2", name: "Mathématicien", description: "10 exercices de maths réussis", icon: "📐", unlocked: true, rarity: "rare" },
    { id: "3", name: "Assidu", description: "S'est connecté 5 jours d'affilée", icon: "📅", unlocked: false, rarity: "epic", progress: 60 },
    { id: "4", name: "Champion", description: "A gagné 1000 points", icon: "🏆", unlocked: false, rarity: "legendary", progress: 85 },
]

export function BadgeCollection({ badges = DEFAULT_BADGES }: BadgeCollectionProps) {
    return (
        <Card className="w-full h-full shadow-md border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Collection de Badges
                </CardTitle>
                <Badge variant="outline">{badges.filter(b => b.unlocked).length} / {badges.length}</Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all hover:scale-105 ${badge.unlocked
                                    ? "bg-gradient-premium/5 border-primary/20"
                                    : "bg-muted/50 grayscale opacity-60"
                                }`}
                        >
                            <span className="text-3xl mb-1">{badge.icon}</span>
                            <p className="text-xs font-bold leading-tight">{badge.name}</p>
                            {!badge.unlocked && badge.progress !== undefined && (
                                <Progress value={badge.progress} className="h-1 w-full" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
