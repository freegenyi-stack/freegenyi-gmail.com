"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationPreferencesProps {
    initialPreferences?: {
        email: {
            weeklyReport: boolean
            achievement: boolean
            reminder: boolean
            promo: boolean
        }
        push: {
            activity: boolean
            achievement: boolean
            reminder: boolean
            message: boolean
        }
        inApp: {
            all: boolean
            sound: boolean
        }
    }
    onSave: (preferences: any) => void
    className?: string
}

const defaultPreferences = {
    email: {
        weeklyReport: true,
        achievement: true,
        reminder: true,
        promo: false
    },
    push: {
        activity: true,
        achievement: true,
        reminder: true,
        message: true
    },
    inApp: {
        all: true,
        sound: true
    }
}

export function NotificationPreferences({
    initialPreferences = defaultPreferences,
    onSave,
    className
}: NotificationPreferencesProps) {
    const [prefs, setPrefs] = useState(initialPreferences)
    const [isSaving, setIsSaving] = useState(false)

    const updateEmail = (key: keyof typeof prefs.email, value: boolean) => {
        setPrefs({
            ...prefs,
            email: { ...prefs.email, [key]: value }
        })
    }

    const updatePush = (key: keyof typeof prefs.push, value: boolean) => {
        setPrefs({
            ...prefs,
            push: { ...prefs.push, [key]: value }
        })
    }

    const updateInApp = (key: keyof typeof prefs.inApp, value: boolean) => {
        setPrefs({
            ...prefs,
            inApp: { ...prefs.inApp, [key]: value }
        })
    }

    const handleSave = () => {
        setIsSaving(true)
        // Simuler un appel API
        setTimeout(() => {
            onSave(prefs)
            setIsSaving(false)
        }, 500)
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Préférences de notification
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-heading font-semibold text-base">Notifications email</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-weekly" className="text-sm cursor-pointer">
                                Rapport hebdomadaire
                            </Label>
                            <Switch
                                id="email-weekly"
                                checked={prefs.email.weeklyReport}
                                onCheckedChange={(v) => updateEmail("weeklyReport", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-achievement" className="text-sm cursor-pointer">
                                Badge / Succès débloqué
                            </Label>
                            <Switch
                                id="email-achievement"
                                checked={prefs.email.achievement}
                                onCheckedChange={(v) => updateEmail("achievement", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-reminder" className="text-sm cursor-pointer">
                                Rappels (devoirs, défis)
                            </Label>
                            <Switch
                                id="email-reminder"
                                checked={prefs.email.reminder}
                                onCheckedChange={(v) => updateEmail("reminder", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-promo" className="text-sm cursor-pointer">
                                Offres et actualités
                            </Label>
                            <Switch
                                id="email-promo"
                                checked={prefs.email.promo}
                                onCheckedChange={(v) => updateEmail("promo", v)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Push mobile */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-heading font-semibold text-base">Notifications push (mobile)</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-activity" className="text-sm cursor-pointer">
                                Activité récente de l'enfant
                            </Label>
                            <Switch
                                id="push-activity"
                                checked={prefs.push.activity}
                                onCheckedChange={(v) => updatePush("activity", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-achievement" className="text-sm cursor-pointer">
                                Succès / badge
                            </Label>
                            <Switch
                                id="push-achievement"
                                checked={prefs.push.achievement}
                                onCheckedChange={(v) => updatePush("achievement", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-reminder" className="text-sm cursor-pointer">
                                Rappels
                            </Label>
                            <Switch
                                id="push-reminder"
                                checked={prefs.push.reminder}
                                onCheckedChange={(v) => updatePush("reminder", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-message" className="text-sm cursor-pointer">
                                Messages reçus
                            </Label>
                            <Switch
                                id="push-message"
                                checked={prefs.push.message}
                                onCheckedChange={(v) => updatePush("message", v)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* In-app */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-heading font-semibold text-base">Notifications dans l'application</h3>
                    </div>
                    <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="inapp-all" className="text-sm cursor-pointer">
                                Activer toutes les notifications
                            </Label>
                            <Switch
                                id="inapp-all"
                                checked={prefs.inApp.all}
                                onCheckedChange={(v) => updateInApp("all", v)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="inapp-sound" className="text-sm cursor-pointer">
                                Son d'alerte
                            </Label>
                            <Switch
                                id="inapp-sound"
                                checked={prefs.inApp.sound}
                                onCheckedChange={(v) => updateInApp("sound", v)}
                                disabled={!prefs.inApp.all}
                            />
                        </div>
                    </div>
                </div>

                <Button
                    variant="premium"
                    className="w-full mt-4"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
                </Button>
            </CardContent>
        </Card>
    )
}
