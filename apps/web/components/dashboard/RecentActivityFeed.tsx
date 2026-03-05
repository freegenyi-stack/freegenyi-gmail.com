"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
    BookOpen,
    Trophy,
    TrendingUp,
    Gift,
    Music,
    Calculator,
    Languages,
    FlaskConical,
    Palette
} from "lucide-react"

export interface Activity {
    id: string
    type: "exercise" | "badge" | "levelup" | "reward" | "course"
    title: string
    description?: string
    timestamp: Date
    subject?: string
    score?: number
    icon?: React.ReactNode
    metadata?: Record<string, any>
}

interface RecentActivityFeedProps {
    activities: Activity[]
    className?: string
    maxItems?: number
    showFilters?: boolean
}

const subjectIcons: Record<string, React.ReactNode> = {
    maths: <Calculator className="h-4 w-4" />,
    francais: <Languages className="h-4 w-4" />,
    sciences: <FlaskConical className="h-4 w-4" />,
    histoire: <BookOpen className="h-4 w-4" />,
    musique: <Music className="h-4 w-4" />,
    arts: <Palette className="h-4 w-4" />
}

const typeIcons: Record<string, React.ReactNode> = {
    exercise: "📝",
    badge: <Trophy className="h-4 w-4" />,
    levelup: <TrendingUp className="h-4 w-4" />,
    reward: <Gift className="h-4 w-4" />,
    course: <BookOpen className="h-4 w-4" />
}

const typeColors: Record<string, string> = {
    exercise: "bg-blue-100 text-blue-700",
    badge: "bg-yellow-100 text-yellow-700",
    levelup: "bg-green-100 text-green-700",
    reward: "bg-purple-100 text-purple-700",
    course: "bg-orange-100 text-orange-700"
}

export function RecentActivityFeed({
    activities,
    className,
    maxItems = 10,
    showFilters = true
}: RecentActivityFeedProps) {
    const [filterType, setFilterType] = useState<string>("all")

    const filteredActivities = activities
        .filter(a => filterType === "all" || a.type === filterType)
        .slice(0, maxItems)

    return (
        <Card className={cn("h-full flex flex-col", className)}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-heading">Activité récente</CardTitle>
                {showFilters && (
                    <Tabs value={filterType} onValueChange={setFilterType} className="w-auto">
                        <TabsList className="h-8">
                            <TabsTrigger value="all" className="text-xs px-3">Tout</TabsTrigger>
                            <TabsTrigger value="exercise" className="text-xs px-3">Exercices</TabsTrigger>
                            <TabsTrigger value="badge" className="text-xs px-3">Badges</TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-4">
                        {filteredActivities.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Aucune activité récente
                            </p>
                        ) : (
                            filteredActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 group hover:bg-accent/20 p-2 rounded-lg transition">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className={cn(typeColors[activity.type] || "bg-accent")}>
                                            {activity.icon || typeIcons[activity.type] || "📌"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            {activity.score !== undefined && (
                                                <Badge
                                                    variant={activity.score >= 80 ? "success" : activity.score >= 50 ? "warning" : "destructive"}
                                                    className="ml-2"
                                                >
                                                    {activity.score}%
                                                </Badge>
                                            )}
                                        </div>
                                        {activity.description && (
                                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: fr })}</span>
                                            {activity.subject && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        {subjectIcons[activity.subject.toLowerCase()]}
                                                        {activity.subject}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
