"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { CalendarIcon, Send, Smartphone, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Child {
    id: string
    name: string
    initials: string
}

interface SendToChildButtonProps {
    children?: Child[] // si non fourni, envoi  l'enfant actif
    exerciseId: string
    exerciseTitle?: string
    onSent?: (result: { childIds: string[], scheduledFor?: Date }) => void
    className?: string
}

export function SendToChildButton({
    children = [],
    exerciseId,
    exerciseTitle,
    onSent,
    className
}: SendToChildButtonProps) {
    const [open, setOpen] = useState(false)
    const [schedule, setSchedule] = useState<"now" | "later">("now")
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>("12:00")
    const [selectedChildren, setSelectedChildren] = useState<string[]>([])

    // Si aucun enfant n'est pass, on considre qu'on envoie  l'enfant actif (mock)
    const childList = children.length > 0 ? children : [
        { id: "child1", name: "Lo", initials: "L" },
        { id: "child2", name: "Emma", initials: "E" }
    ]

    const handleSelectAll = () => {
        if (selectedChildren.length === childList.length) {
            setSelectedChildren([])
        } else {
            setSelectedChildren(childList.map(c => c.id))
        }
    }

    const handleSend = () => {
        const scheduledDateTime = schedule === "later" && date
            ? new Date(`${format(date, "yyyy-MM-dd")}T${time}:00`)
            : undefined

        // Ici tu appellerais ton API
        console.log("Envoi exercice", exerciseId, "aux enfants", selectedChildren, scheduledDateTime)

        onSent?.({ childIds: selectedChildren, scheduledFor: scheduledDateTime })
        setOpen(false)

        // Reset
        setSchedule("now")
        setDate(undefined)
        setTime("12:00")
        setSelectedChildren([])
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" size="sm" className={className}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Envoyer sur mobile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Envoyer l'exercice
                    </DialogTitle>
                    <DialogDescription>
                        {exerciseTitle && <span className="font-medium">"{exerciseTitle}"</span>} sera envoy sur l'application mobile.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-5">
                    {/* Slection des enfants */}
                    {childList.length > 1 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Envoyer
                                </Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="h-7 px-2 text-xs"
                                >
                                    {selectedChildren.length === childList.length ? "Tout dslectionner" : "Tout slectionner"}
                                </Button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                                {childList.map(child => (
                                    <div key={child.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`child-${child.id}`}
                                            checked={selectedChildren.includes(child.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedChildren([...selectedChildren, child.id])
                                                } else {
                                                    setSelectedChildren(selectedChildren.filter(id => id !== child.id))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`child-${child.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                                                {child.initials}
                                            </div>
                                            {child.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quand envoi */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Quand ?
                        </Label>
                        <RadioGroup value={schedule} onValueChange={(v: "now" | "later") => setSchedule(v)} className="gap-3">
                            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/20 transition">
                                <RadioGroupItem value="now" id="now" />
                                <Label htmlFor="now" className="flex-1 cursor-pointer">
                                    <span className="font-medium">Maintenant</span>
                                    <p className="text-xs text-muted-foreground">L'enfant recevra une notification immdiate</p>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/20 transition">
                                <RadioGroupItem value="later" id="later" />
                                <Label htmlFor="later" className="flex-1 cursor-pointer">
                                    <span className="font-medium">Planifier</span>
                                    <p className="text-xs text-muted-foreground">Choisis une date et une heure</p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {schedule === "later" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "dd/MM/yyyy") : "Choisir"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            locale={fr}
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Heure</Label>
                                <Select value={time} onValueChange={setTime}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Heure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 24 }).map((_, i) => {
                                            const hour = i.toString().padStart(2, "0")
                                            return (
                                                <SelectItem key={i} value={`${hour}:00`}>
                                                    {hour}:00
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="premium"
                        onClick={handleSend}
                        disabled={
                            (childList.length > 1 && selectedChildren.length === 0) ||
                            (schedule === "later" && !date)
                        }
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {schedule === "now" ? "Envoyer maintenant" : "Planifier l'envoi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
