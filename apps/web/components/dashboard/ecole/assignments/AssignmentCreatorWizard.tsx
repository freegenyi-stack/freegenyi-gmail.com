// apps/web/components/dashboard/ecole/assignments/AssignmentCreatorWizard.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ChevronLeft, ChevronRight, Check, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function AssignmentCreatorWizard() {
    const [step, setStep] = useState(1)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [subject, setSubject] = useState('')
    const [dueDate, setDueDate] = useState<Date>()
    const [maxScore, setMaxScore] = useState(100)

    const next = () => setStep(s => s + 1)
    const prev = () => setStep(s => s - 1)

    const steps = [
        { number: 1, label: 'Détails' },
        { number: 2, label: 'Documents' },
        { number: 3, label: 'Confirmation' }
    ]

    return (
        <Card className="w-full max-w-2xl mx-auto border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <CardTitle className="font-heading text-2xl font-bold">Créer un devoir</CardTitle>
                    <div className="flex gap-2">
                        {steps.map(s => (
                            <div
                                key={s.number}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    step === s.number ? "bg-primary w-8" : step > s.number ? "bg-primary/40" : "bg-muted"
                                )}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    {steps.map(s => (
                        <span key={s.number} className={cn(step === s.number && "text-primary")}>{s.label}</span>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Titre du devoir</Label>
                            <Input
                                placeholder="Ex: Fractions simples"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="rounded-xl h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Description / Consignes</Label>
                            <Textarea
                                placeholder="Décrivez ce que les élèves doivent faire..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                className="rounded-xl resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Matière</Label>
                                <Select value={subject} onValueChange={setSubject}>
                                    <SelectTrigger className="rounded-xl h-11">
                                        <SelectValue placeholder="Choisir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="maths">Mathématiques</SelectItem>
                                        <SelectItem value="francais">Français</SelectItem>
                                        <SelectItem value="sciences">Sciences</SelectItem>
                                        <SelectItem value="histoire">Histoire</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Note maximale</Label>
                                <Input
                                    type="number"
                                    value={maxScore}
                                    onChange={e => setMaxScore(+e.target.value)}
                                    className="rounded-xl h-11"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Date de rendu</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full h-11 justify-start text-left rounded-xl font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                        {dueDate ? format(dueDate, 'PPP', { locale: fr }) : <span className="text-muted-foreground">Sélectionner une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dueDate}
                                        onSelect={setDueDate}
                                        locale={fr}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-heading text-xl font-bold">Pièces jointes</p>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Ajoutez des documents, des images ou des liens pour aider les élèves à réaliser ce devoir.
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-2xl border-dashed border-2 h-24 w-full max-w-md">
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-bold text-primary">Cliquer pour télécharger</span>
                                <span className="text-xs text-muted-foreground">PDF, DOCX, PNG (max 10MB)</span>
                            </div>
                        </Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <Badge className="bg-primary/20 text-primary hover:bg-primary/20 rounded-lg">{subject || 'Matière'}</Badge>
                                    <h3 className="font-heading text-2xl font-bold">{title || 'Sans titre'}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Note Max</p>
                                    <p className="text-xl font-bold text-primary">{maxScore} pts</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 line-clamp-3 italic">
                                {description || 'Aucune description fournie.'}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold bg-background p-3 rounded-2xl shadow-sm inline-flex">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                À rendre le {dueDate ? format(dueDate, 'dd/MM/yyyy') : '--/--/----'}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-2xl text-xs">
                            <Check className="h-4 w-4 flex-shrink-0" />
                            Ce devoir sera visible par tous les élèves de la classe dès sa publication.
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between p-8 pt-4">
                {step > 1 ? (
                    <Button variant="ghost" onClick={prev} className="rounded-xl h-11 px-6">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Précédent
                    </Button>
                ) : (
                    <div />
                )}
                {step < 3 ? (
                    <Button onClick={next} className="rounded-xl h-11 px-8">
                        Suivant
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="premium" className="rounded-xl h-11 px-10 font-bold shadow-lg shadow-primary/20">
                        Publier le devoir
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
