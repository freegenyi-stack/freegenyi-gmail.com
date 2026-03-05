"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface TextGapBuilderProps {
    value: any
    onChange: (value: any) => void
}

export function TextGapBuilder({ value, onChange }: TextGapBuilderProps) {
    const [text, setText] = useState(value.text || "")

    const handleTextChange = (newText: string) => {
        setText(newText)
        // Analyse simple : dtecte les mots entre crochets [mot] comme des trous
        const gapRegex = /\[(.*?)\]/g
        const matches = [...newText.matchAll(gapRegex)]
        const gaps = matches.map((match, index) => ({
            id: `gap-${index}`,
            placeholder: match[1],
            answer: ""
        }))
        onChange({ ...value, text: newText, gaps })
    }

    const handleAnswerChange = (index: number, answer: string) => {
        const newGaps = [...(value.gaps || [])]
        newGaps[index] = { ...newGaps[index], answer }
        onChange({ ...value, gaps: newGaps })
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="gap-text" className="text-sm font-medium">
                    Texte avec trous
                </Label>
                <Textarea
                    id="gap-text"
                    placeholder="cris ton texte. Utilise [crochets] pour marquer les trous. Ex: La capitale de la France est [Paris]."
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    rows={5}
                    className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    Les mots entre crochets [ ] deviendront des champs  remplir.
                </p>
            </div>

            {value.gaps && value.gaps.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Rponses attendues</Label>
                    <div className="space-y-2">
                        {value.gaps.map((gap: any, index: number) => (
                            <div key={gap.id} className="flex items-center gap-2">
                                <Badge variant="outline" className="w-24 justify-center">
                                    Trou {index + 1}
                                </Badge>
                                <Input
                                    placeholder={`Rponse pour "${gap.placeholder}"`}
                                    value={gap.answer || ""}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {value.text && (
                <div className="mt-4 p-4 bg-accent/20 rounded-xl border">
                    <p className="text-sm font-medium mb-2">\ud83d\udc40 Aperu</p>
                    <div className="text-sm">
                        {value.text.split(/[\[\]]/).map((part: string, i: number) => {
                            // Les parties impaires sont entre crochets
                            if (i % 2 === 1) {
                                return (
                                    <span key={i} className="inline-block bg-primary/10 border-b-2 border-primary px-1 mx-0.5 rounded">
                                        {part}
                                    </span>
                                )
                            }
                            return <span key={i}>{part}</span>
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
