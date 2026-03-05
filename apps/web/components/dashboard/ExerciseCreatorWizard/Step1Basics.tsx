"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { exerciseTypes } from "./ExerciseTypeConfig"

interface Step1BasicsProps {
    data: any
    updateData: (newData: any) => void
}

export function Step1Basics({ data, updateData }: Step1BasicsProps) {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                    Titre de l'exercice <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    placeholder="Ex: Addition niveau 1"
                    value={data.title || ""}
                    onChange={(e) => updateData({ title: e.target.value })}
                    className="focus-visible:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="instruction" className="text-sm font-medium">
                    Consigne
                </Label>
                <Textarea
                    id="instruction"
                    placeholder="Explique  l'enfant ce qu'il doit faire..."
                    value={data.instruction || ""}
                    onChange={(e) => updateData({ instruction: e.target.value })}
                    rows={3}
                    className="resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                        Matire
                    </Label>
                    <Select
                        value={data.subject}
                        onValueChange={(v) => updateData({ subject: v })}
                    >
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Slectionne" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="maths">\ud83e\uddee Mathmatiques</SelectItem>
                            <SelectItem value="francais">\ud83d\udcd6 Franais</SelectItem>
                            <SelectItem value="sciences">\ud83d\udd2c Sciences</SelectItem>
                            <SelectItem value="histoire">\ud83c\udfdb\ufe0f Histoire</SelectItem>
                            <SelectItem value="geographie">\ud83c\udf0d Gographie</SelectItem>
                            <SelectItem value="anglais">\ud83c\uddec\udde7 Anglais</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-sm font-medium">
                        Difficult
                    </Label>
                    <Select
                        value={data.difficulty}
                        onValueChange={(v: "easy" | "medium" | "hard") => updateData({ difficulty: v })}
                    >
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">\ud83c\udf31 Facile</SelectItem>
                            <SelectItem value="medium">\ud83c\udf3f Moyen</SelectItem>
                            <SelectItem value="hard">\ud83c\udf33 Difficile</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-medium">
                    Type d'exercice <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                    value={data.type}
                    onValueChange={(v) => updateData({ type: v })}
                    className="grid grid-cols-2 gap-3"
                >
                    {exerciseTypes.map((type) => (
                        <div key={type.id} className="relative">
                            <RadioGroupItem
                                value={type.id}
                                id={type.id}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={type.id}
                                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition"
                            >
                                <span className="text-3xl mb-2">{type.icon}</span>
                                <span className="font-medium text-sm">{type.label}</span>
                                <span className="text-xs text-muted-foreground text-center mt-1">
                                    {type.description}
                                </span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    )
}
