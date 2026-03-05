"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, Moon, VolumeX, MessageSquareX } from "lucide-react"

export function FocusModeSettings({ onUpdate }: { onUpdate: (settings: any) => void }) {
    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Mode Focus
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="mute-sound">Couper les sons système</Label>
                    </div>
                    <Switch id="mute-sound" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquareX className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="block-chat">Désactiver le chat</Label>
                    </div>
                    <Switch id="block-chat" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="dark-ambient">Ambiance sombre</Label>
                    </div>
                    <Switch id="dark-ambient" />
                </div>

                <Button className="w-full mt-2" variant="outline">Planifier le mode focus</Button>
            </CardContent>
        </Card>
    )
}
