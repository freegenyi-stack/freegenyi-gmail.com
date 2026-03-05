"use client"

import { useState } from "react"
import { AlertCircle, X, CheckCircle, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Announcement {
    title: string
    message: string
    type?: "info" | "success" | "warning" | "event"
    actions?: { label: string; onClick: () => void }[]
}

export function AnnouncementBanner({ title, message, type = "info", actions }: Announcement) {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    const styles = {
        info: "bg-blue-600 text-white",
        success: "bg-green-600 text-white",
        warning: "bg-orange-500 text-white",
        event: "bg-gradient-premium text-white"
    }

    const icons = {
        info: <Info className="h-5 w-5" />,
        success: <CheckCircle className="h-5 w-5" />,
        warning: <AlertCircle className="h-5 w-5" />,
        event: <Star className="h-5 w-5" />
    }

    return (
        <div className={`${styles[type]} px-4 py-3 shadow-lg relative animate-in slide-in-from-top duration-500`}>
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        {icons[type]}
                    </div>
                    <div>
                        <p className="font-heading font-bold text-sm leading-tight">{title}</p>
                        <p className="text-xs opacity-90">{message}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 pr-8">
                    {actions?.map((action, i) => (
                        <Button
                            key={i}
                            variant="secondary"
                            size="sm"
                            className="bg-white text-primary border-none hover:bg-white/90 font-bold h-8 px-4 text-xs"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
