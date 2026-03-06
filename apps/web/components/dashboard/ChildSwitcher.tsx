"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, Star, Clock, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export interface Child {
    id: string
    name: string
    age: number
    avatar?: string
    initials: string
    level?: string
    points?: number
    lastActive?: Date
    isPremium?: boolean
}

interface ChildSwitcherProps {
    profiles: Child[]
    activeChildId?: string
    onSwitch: (childId: string) => void
    onAddChild: () => void
    className?: string
}

export function ChildSwitcher({
    profiles,
    activeChildId,
    onSwitch,
    onAddChild,
    className
}: ChildSwitcherProps) {
    const t = useTranslations("dashboard.childSwitcher")
    const active = profiles.find(c => c.id === activeChildId) || profiles[0]

    const formatLastActive = (date?: Date) => {
        if (!date) return t("never")
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        if (days === 0) return t("today")
        if (days === 1) return t("yesterday")
        return t("daysAgo", { days })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "group flex items-center gap-4 h-14 ps-1 pe-5 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow-sm transition-all hover:shadow-md tour-child-switcher",
                        className
                    )}
                >
                    <div className="relative">
                        <Avatar className="h-11 w-11 border-2 border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
                            <AvatarImage src={active?.avatar} />
                            <AvatarFallback className="bg-gradient-premium text-white font-heading text-lg">
                                {active?.initials}
                            </AvatarFallback>
                        </Avatar>
                        {active?.isPremium && (
                            <div className="absolute -top-1 end-0 bg-yellow-400 text-[10px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-yellow-200">
                                ⭐
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start leading-tight">
                        <span className="font-heading text-base font-bold text-primary flex items-center gap-2">
                            {active?.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70 flex items-center gap-1">
                            {formatLastActive(active?.lastActive)}
                        </span>
                    </div>

                    <div className="ms-2 w-7 h-7 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ChevronDown className="h-4 w-4 text-primary" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 p-2">
                <DropdownMenuLabel className="font-heading text-sm text-muted-foreground px-2">
                    {t("title")}
                </DropdownMenuLabel>
                {profiles.map(child => (
                    <DropdownMenuItem
                        key={child.id}
                        onClick={() => onSwitch(child.id)}
                        className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors",
                            child.id === activeChildId && "bg-accent/40"
                        )}
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={child.avatar} />
                            <AvatarFallback className={cn(
                                "bg-accent text-primary",
                                child.id === activeChildId && "bg-gradient-premium text-white"
                            )}>
                                {child.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{child.name}</span>
                                {child.id === activeChildId && (
                                    <Badge variant="secondary" className="text-[10px] h-5">{t("active")}</Badge>
                                )}
                            </div>
                            <span className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{t("age", { age: child.age })}</span>
                                {child.level && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5">
                                            <Star className="h-3 w-3" /> {t("level", { level: child.level })}
                                        </span>
                                    </>
                                )}
                                {child.points !== undefined && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5">
                                            <Award className="h-3 w-3" /> {t("points", { points: child.points })}
                                        </span>
                                    </>
                                )}
                            </span>
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onAddChild}
                    className="flex items-center gap-3 p-3 cursor-pointer text-primary hover:text-primary-foreground hover:bg-primary/10 rounded-lg"
                >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{t("addChild")}</span>
                        <span className="text-xs text-muted-foreground">{t("newProfile")}</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
