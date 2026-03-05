"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NotificationsPanel({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const [notifications, setNotifications] = useState([
        { id: "1", text: "Amine a terminé son exercice de maths", time: "Il y a 5 min", unread: true },
        { id: "2", text: "Nouveau badge débloqué !", time: "Il y a 1h", unread: true },
        { id: "3", text: "Votre abonnement expire bientôt", time: "Hier", unread: false },
    ])

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"
                    className="group relative h-8 w-8 rounded-xl p-0 overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-amber-100 bg-amber-50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent">
                    <Bell className="h-4 w-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] p-2">
                <div className="flex items-center justify-between px-2 py-2 border-b mb-1">
                    <h4 className="font-heading font-bold text-sm">Notifications</h4>
                    {unreadCount > 0 && <Badge variant="secondary" className="text-[10px]">{unreadCount} nouvelles</Badge>}
                </div>
                {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 focus:bg-accent/50">
                        <div className="flex items-center gap-2 w-full">
                            {n.unread && <Circle className="h-2 w-2 fill-primary text-primary" />}
                            <p className="text-xs font-medium flex-1 leading-tight">{n.text}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-4">{n.time}</span>
                    </DropdownMenuItem>
                ))}
                <div className="p-2 border-t mt-1">
                    <Button variant="ghost" className="w-full h-8 text-xs font-semibold">Toutes les notifications</Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
