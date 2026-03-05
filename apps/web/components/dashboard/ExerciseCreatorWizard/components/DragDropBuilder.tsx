"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DragDropBuilderProps {
    value: any
    onChange: (value: any) => void
}

export function DragDropBuilder({ value, onChange }: DragDropBuilderProps) {
    const [leftItems, setLeftItems] = useState<string[]>(value.leftItems || ["", ""])
    const [rightItems, setRightItems] = useState<string[]>(value.rightItems || ["", ""])
    const [pairs, setPairs] = useState<[number, number][]>(value.pairs || [])

    const updateLeftItem = (index: number, text: string) => {
        const newLeft = [...leftItems]
        newLeft[index] = text
        setLeftItems(newLeft)
        onChange({ ...value, leftItems: newLeft, rightItems, pairs })
    }

    const updateRightItem = (index: number, text: string) => {
        const newRight = [...rightItems]
        newRight[index] = text
        setRightItems(newRight)
        onChange({ ...value, leftItems, rightItems: newRight, pairs })
    }

    const addLeft = () => {
        setLeftItems([...leftItems, ""])
    }

    const addRight = () => {
        setRightItems([...rightItems, ""])
    }

    const removeLeft = (index: number) => {
        const newLeft = leftItems.filter((_, i) => i !== index)
        setLeftItems(newLeft)
        // Supprimer les paires impliquant cet index
        const newPairs = pairs.filter(([l, r]) => l !== index).map(([l, r]) => [
            l > index ? l - 1 : l,
            r
        ] as [number, number])
        setPairs(newPairs)
        onChange({ ...value, leftItems: newLeft, rightItems, pairs: newPairs })
    }

    const removeRight = (index: number) => {
        const newRight = rightItems.filter((_, i) => i !== index)
        setRightItems(newRight)
        const newPairs = pairs.filter(([l, r]) => r !== index).map(([l, r]) => [
            l,
            r > index ? r - 1 : r
        ] as [number, number])
        setPairs(newPairs)
        onChange({ ...value, leftItems, rightItems: newRight, pairs: newPairs })
    }

    const addPair = (leftIndex: number, rightIndex: number) => {
        if (!pairs.some(([l, r]) => l === leftIndex && r === rightIndex)) {
            const newPairs: [number, number][] = [...pairs, [leftIndex, rightIndex]]
            setPairs(newPairs)
            onChange({ ...value, leftItems, rightItems, pairs: newPairs })
        }
    }

    const removePair = (index: number) => {
        const newPairs = pairs.filter((_, i) => i !== index)
        setPairs(newPairs)
        onChange({ ...value, leftItems, rightItems, pairs: newPairs })
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">lments  associer (gauche)</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addLeft}>
                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {leftItems.map((item, index) => (
                            <div key={`left-${index}`} className="flex items-center gap-2">
                                <Badge variant="outline" className="w-8 justify-center">{index + 1}</Badge>
                                <Input
                                    value={item}
                                    onChange={(e) => updateLeftItem(index, e.target.value)}
                                    placeholder={`lment ${index + 1}`}
                                    className="flex-1"
                                />
                                {leftItems.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeLeft(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Correspondances (droite)</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addRight}>
                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {rightItems.map((item, index) => (
                            <div key={`right-${index}`} className="flex items-center gap-2">
                                <Badge variant="outline" className="w-8 justify-center">{String.fromCharCode(65 + index)}</Badge>
                                <Input
                                    value={item}
                                    onChange={(e) => updateRightItem(index, e.target.value)}
                                    placeholder={`Correspondance ${String.fromCharCode(65 + index)}`}
                                    className="flex-1"
                                />
                                {rightItems.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeRight(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Zone d'association */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Associations correctes</Label>
                <Card>
                    <CardContent className="p-4 space-y-3">
                        {pairs.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-2">
                                Clique sur les flches pour associer les lments
                            </p>
                        ) : (
                            pairs.map((pair, index) => (
                                <div key={index} className="flex items-center justify-between bg-accent/20 p-2 rounded-lg">
                                    <span className="text-sm">
                                        <Badge variant="outline" className="mr-2">{pair[0] + 1}</Badge>
                                        {leftItems[pair[0]] || "?"}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        <Badge variant="outline" className="mr-2">{String.fromCharCode(65 + pair[1])}</Badge>
                                        {rightItems[pair[1]] || "?"}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => removePair(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                    {leftItems.map((left, lIdx) => left && rightItems.map((right, rIdx) => right && (
                        <Button
                            key={`${lIdx}-${rIdx}`}
                            variant="outline"
                            size="sm"
                            className={cn(
                                "justify-between text-xs",
                                pairs.some(([l, r]) => l === lIdx && r === rIdx) && "bg-primary/10 border-primary"
                            )}
                            onClick={() => addPair(lIdx, rIdx)}
                            disabled={pairs.some(([l, r]) => l === lIdx || r === rIdx)}
                        >
                            <span>{left.substring(0, 15)}{left.length > 15 ? "" : ""}</span>
                            <ArrowRight className="h-3 w-3 mx-1" />
                            <span>{right.substring(0, 15)}{right.length > 15 ? "" : ""}</span>
                        </Button>
                    )))}
                </div>
            </div>
        </div>
    )
}
