"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Clock, Calendar } from "lucide-react"

interface TimeLimitSchedulerProps {
    childName: string
    onSave: (limits: any) => void
}

export function TimeLimitScheduler({ childName, onSave }: TimeLimitSchedulerProps) {
    return (
        <Card className="shadow-md border-primary/5">
            <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Limites de temps : {childName}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Temps quotidien max</Label>
                        <span className="font-bold text-primary">60 min</span>
                    </div>
                    <Slider defaultValue={[60]} max={180} step={15} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Semaine</p>
                        <p className="font-bold">45 min / j</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Weekend</p>
                        <p className="font-bold">120 min / j</p>
                    </div>
                </div>

                <Button className="w-full" variant="premium">Enregistrer les limites</Button>
            </CardContent>
        </Card>
    )
}
