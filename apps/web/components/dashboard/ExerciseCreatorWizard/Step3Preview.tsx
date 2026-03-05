"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExportPDFButton } from "@/components/dashboard/ExportPDFButton"
import { SendToChildButton } from "./SendToChildButton"
import { exerciseTypes } from "./ExerciseTypeConfig"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, Smartphone, Edit } from "lucide-react"

interface Step3PreviewProps {
    data: any
    onEdit: (step: number) => void
}

export function Step3Preview({ data, onEdit }: Step3PreviewProps) {
    const currentType = exerciseTypes.find(t => t.id === data.type) || exerciseTypes[0]

    const difficultyLabel = {
        easy: "\ud83c\udf31 Facile",
        medium: "\ud83c\udf3f Moyen",
        hard: "\ud83c\udf33 Difficile"
    }

    const subjectLabel: Record<string, string> = {
        maths: "Mathmatiques",
        francais: "Franais",
        sciences: "Sciences",
        histoire: "Histoire",
        geographie: "Gographie",
        anglais: "Anglais"
    }

    return (
        <div className="space-y-5">
            {/* En-tte de l'exercice */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-accent/10">
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-primary">
                                {data.title || "Exercice sans titre"}
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                {data.instruction || "Aucune consigne fournie."}
                            </p>
                        </div>
                        <Badge variant="premium" className="text-sm py-1 px-3">
                            {difficultyLabel[data.difficulty as keyof typeof difficultyLabel]}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="secondary" className="gap-1">
                            <span className="text-lg">{currentType.icon}</span>
                            {currentType.label}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                            {subjectLabel[data.subject] || data.subject}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                            Cr le {format(new Date(data.createdAt || Date.now()), "dd MMM yyyy", { locale: fr })}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier les infos
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier le contenu
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Aperu du contenu */}
            <Card>
                <CardContent className="p-5 space-y-3">
                    <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                        <span className="text-primary">\ud83d\udccb</span> Contenu de l'exercice
                    </h3>

                    {/* Prvisualisation spcifique selon le type */}
                    {data.type === "qcm" && data.content && (
                        <div className="space-y-3">
                            <p className="font-medium">{data.content.question}</p>
                            <div className="space-y-2">
                                {data.content.options?.map((opt: string, idx: number) => opt && (
                                    <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                                        <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {opt}
                                        {data.content.correctAnswers?.includes(idx) && (
                                            <Badge variant="success" className="ml-auto">Bonne rponse</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.type === "text" && data.content && (
                        <div className="p-3 bg-accent/20 rounded-lg">
                            <p className="text-sm leading-relaxed">
                                {data.content.text?.split(/[\[\]]/).map((part: string, i: number) => {
                                    if (i % 2 === 1) {
                                        return (
                                            <span key={i} className="inline-block bg-primary/10 border-b-2 border-primary px-1 mx-0.5 rounded">
                                                {part}
                                            </span>
                                        )
                                    }
                                    return <span key={i}>{part}</span>
                                })}
                            </p>
                        </div>
                    )}

                    {data.type === "dragdrop" && data.content && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">associer</h4>
                                {data.content.leftItems?.map((item: string, idx: number) => item && (
                                    <div key={idx} className="p-2 bg-accent/20 rounded-lg text-sm">
                                        {idx + 1}. {item}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Correspondances</h4>
                                {data.content.rightItems?.map((item: string, idx: number) => item && (
                                    <div key={idx} className="p-2 bg-accent/20 rounded-lg text-sm">
                                        {String.fromCharCode(65 + idx)}. {item}
                                    </div>
                                ))}
                            </div>
                            {data.content.pairs?.length > 0 && (
                                <div className="col-span-2 mt-2">
                                    <h4 className="text-sm font-medium mb-2">Associations correctes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.content.pairs.map(([l, r]: [number, number], i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {l + 1} \u2192 {String.fromCharCode(65 + r)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {data.type === "drawing" && data.content?.canvasData && (
                        <div className="border rounded-lg p-2 bg-white">
                            <img src={data.content.canvasData} alt="Dessin" className="max-w-full h-auto" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions d'export et d'envoi */}
            <Card className="bg-accent/5 border-dashed">
                <CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                        <h4 className="font-medium text-sm">Prt  tre partag ?</h4>
                        <p className="text-xs text-muted-foreground">
                            Exporte au format PDF ou envoie directement sur l'application mobile de ton enfant.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ExportPDFButton
                            data={[
                                { subject: data.title, progress: 100, lastActivity: " faire" }
                            ]}
                            title={`Exercice: ${data.title}`}
                            filename={`FreeGeny_exercice_${data.id}.pdf`}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            PDF
                        </ExportPDFButton>
                        <SendToChildButton
                            exerciseId={data.id}
                            exerciseTitle={data.title}
                        >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Envoyer
                        </SendToChildButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
