
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
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function ProgramCreateWizard() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [budget, setBudget] = useState(0)
    const [scope, setScope] = useState<'local' | 'regional' | 'national' | 'international'>('local')
    const [objectives, setObjectives] = useState<{ description: string; target: number; unit: string }[]>([
        { description: '', target: 0, unit: '' }
    ])

    const addObjective = () => {
        setObjectives([...objectives, { description: '', target: 0, unit: '' }])
    }

    const updateObjective = (index: number, field: string, value: any) => {
        const newObjectives = [...objectives]
        newObjectives[index] = { ...newObjectives[index], [field]: value }
        setObjectives(newObjectives)
    }

    const removeObjective = (index: number) => {
        setObjectives(objectives.filter((_, i) => i !== index))
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Créer un nouveau programme</CardTitle>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nom du programme</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date de début</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, 'dd/MM/yyyy') : 'Sélectionner'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={fr} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Date de fin (optionnelle)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, 'dd/MM/yyyy') : 'Sélectionner'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={fr} disabled={d => startDate ? d < startDate : false} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Budget prévisionnel (€)</Label>
                                <Input type="number" value={budget} onChange={e => setBudget(+e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Portée</Label>
                                <Select value={scope} onValueChange={(v: any) => setScope(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="local">Locale</SelectItem>
                                        <SelectItem value="regional">Régionale</SelectItem>
                                        <SelectItem value="national">Nationale</SelectItem>
                                        <SelectItem value="international">Internationale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Objectifs du programme</Label>
                            <Button variant="outline" size="sm" onClick={addObjective}>
                                <Plus className="h-4 w-4 mr-1" /> Ajouter
                            </Button>
                        </div>
                        {objectives.map((obj, index) => (
                            <div key={index} className="border rounded-lg p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Objectif {index + 1}</span>
                                    {objectives.length > 1 && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeObjective(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    placeholder="Description (ex: Former 100 enseignants)"
                                    value={obj.description}
                                    onChange={e => updateObjective(index, 'description', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Valeur cible"
                                        value={obj.target || ''}
                                        onChange={e => updateObjective(index, 'target', +e.target.value)}
                                    />
                                    <Input
                                        placeholder="Unité (ex: enseignants)"
                                        value={obj.unit}
                                        onChange={e => updateObjective(index, 'unit', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-4">
                        <p className="text-muted-foreground">Récapitulatif – dernières étapes (localisation, alignement ODD, équipe)</p>
                        <div className="bg-accent/20 p-4 rounded-lg">
                            <p><strong>{name}</strong> • Budget {budget.toLocaleString()} €</p>
                            <p className="text-sm">{description}</p>
                            <p className="text-sm mt-2">{objectives.length} objectifs définis</p>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Précédent</Button>}
                {step < 3 ? (
                    <Button onClick={() => setStep(s => s + 1)} className="ml-auto">Suivant</Button>
                ) : (
                    <Button variant="premium" className="ml-auto">Créer le programme</Button>
                )}
            </CardFooter>
        </Card>
    )
}
