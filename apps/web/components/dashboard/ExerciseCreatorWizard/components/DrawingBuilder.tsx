"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Pencil, Eraser, Square, Circle, Undo, Redo, Trash2 } from "lucide-react"

interface DrawingBuilderProps {
    value: any
    onChange: (value: any) => void
}

export function DrawingBuilder({ value, onChange }: DrawingBuilderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [tool, setTool] = useState<"pen" | "eraser" | "rectangle" | "circle">("pen")
    const [color, setColor] = useState("#000000")
    const [brushSize, setBrushSize] = useState(5)
    const [history, setHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // Initialisation du canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Fond blanc
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Restaurer depuis l'historique
        if (historyIndex >= 0 && history[historyIndex]) {
            const img = new Image()
            img.src = history[historyIndex]
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
            }
        }
    }, [history, historyIndex])

    const saveState = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL()
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(dataUrl)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)

        // Sauvegarder dans le parent
        onChange({ ...value, canvasData: dataUrl })
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)

        if (tool === "pen") {
            ctx.strokeStyle = color
            ctx.lineWidth = brushSize
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
        } else if (tool === "eraser") {
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = brushSize * 1.5
        }
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (tool === "pen" || tool === "eraser") {
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false)
            saveState()
        }
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        saveState()
    }

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
                <ToggleGroup type="single" value={tool} onValueChange={(v: any) => v && setTool(v)}>
                    <ToggleGroupItem value="pen" aria-label="Crayon">
                        <Pencil className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="eraser" aria-label="Gomme">
                        <Eraser className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="rectangle" aria-label="Rectangle" disabled>
                        <Square className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="circle" aria-label="Cercle" disabled>
                        <Circle className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>

                <div className="flex items-center gap-2">
                    <Label htmlFor="color" className="sr-only">Couleur</Label>
                    <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded border"
                    />
                </div>

                <div className="flex items-center gap-2 w-32">
                    <Label htmlFor="brush-size" className="text-xs">Taille</Label>
                    <Slider
                        id="brush-size"
                        min={1}
                        max={20}
                        step={1}
                        value={[brushSize]}
                        onValueChange={(v) => setBrushSize(v[0])}
                    />
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
                        <Redo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={clearCanvas}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="border rounded-xl overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={300}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-auto cursor-crosshair"
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Laisse l'enfant dessiner librement. Tu peux aussi importer une image de fond (bientt).
            </p>
        </div>
    )
}
