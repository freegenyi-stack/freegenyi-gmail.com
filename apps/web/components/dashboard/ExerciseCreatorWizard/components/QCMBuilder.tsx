"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface QCMBuilderProps {
    value: any
    onChange: (value: any) => void
}

export function QCMBuilder({ value, onChange }: QCMBuilderProps) {
    const [multipleCorrect, setMultipleCorrect] = useState(value.multipleCorrect || false)

    const handleQuestionChange = (question: string) => {
        onChange({ ...value, question })
    }

    const handleOptionChange = (index: number, text: string) => {
        const newOptions = [...(value.options || [])]
        newOptions[index] = text
        onChange({ ...value, options: newOptions })
    }

    const addOption = () => {
        const newOptions = [...(value.options || []), ""]
        onChange({ ...value, options: newOptions })
    }

    const removeOption = (index: number) => {
        const newOptions = value.options.filter((_: any, i: number) => i !== index)
        let newCorrectAnswers = value.correctAnswers?.filter((ans: number) => ans !== index)
        // Re-indexer les rponses correctes si on supprime avant
        newCorrectAnswers = newCorrectAnswers?.map((ans: number) => ans > index ? ans - 1 : ans)
        onChange({
            ...value,
            options: newOptions,
            correctAnswers: newCorrectAnswers
        })
    }

    const handleCorrectChange = (index: number, checked: boolean) => {
        let newCorrectAnswers = [...(value.correctAnswers || [])]
        if (multipleCorrect) {
            if (checked) {
                newCorrectAnswers.push(index)
            } else {
                newCorrectAnswers = newCorrectAnswers.filter((i: number) => i !== index)
            }
        } else {
            newCorrectAnswers = checked ? [index] : []
        }
        onChange({ ...value, correctAnswers: newCorrectAnswers })
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="qcm-question" className="text-sm font-medium">
                    Question
                </Label>
                <Textarea
                    id="qcm-question"
                    placeholder="Saisis ta question..."
                    value={value.question || ""}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    rows={2}
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Options de rponse</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="multiple-correct"
                                checked={multipleCorrect}
                                onCheckedChange={(checked) => {
                                    setMultipleCorrect(!!checked)
                                    // Reset correct answers si on change le mode
                                    onChange({ ...value, multipleCorrect: !!checked, correctAnswers: [] })
                                }}
                            />
                            <Label htmlFor="multiple-correct" className="text-xs cursor-pointer">
                                Plusieurs rponses possibles
                            </Label>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addOption}>
                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {value.options?.map((option: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 group">
                            <div className="flex items-center justify-center w-6 text-muted-foreground">
                                <GripVertical className="h-4 w-4 opacity-30 group-hover:opacity-100" />
                            </div>
                            <div className="flex items-center space-x-2">
                                {multipleCorrect ? (
                                    <Checkbox
                                        id={`opt-${index}`}
                                        checked={value.correctAnswers?.includes(index) || false}
                                        onCheckedChange={(checked) => handleCorrectChange(index, !!checked)}
                                    />
                                ) : (
                                    <RadioGroup
                                        value={value.correctAnswers?.[0]?.toString()}
                                        onValueChange={(v) => handleCorrectChange(parseInt(v), true)}
                                    >
                                        <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                                    </RadioGroup>
                                )}
                            </div>
                            <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1"
                            />
                            {value.options.length > 2 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeOption(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Prvisualisation en direct */}
            {value.question && value.options?.some((o: string) => o.trim() !== "") && (
                <div className="mt-4 p-4 bg-accent/20 rounded-xl border">
                    <p className="text-sm font-medium mb-3">\ud83d\udc40 Aperu</p>
                    <p className="text-sm mb-3">{value.question}</p>
                    <div className="space-y-2">
                        {value.options.map((opt: string, idx: number) => opt && (
                            <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-background rounded-md">
                                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
