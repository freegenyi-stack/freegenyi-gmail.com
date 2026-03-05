'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const subjects = [
    { value: 'MATH', label: 'Mathématiques' },
    { value: 'FRENCH', label: 'Français' },
    { value: 'ENGLISH', label: 'Anglais' },
    { value: 'SCIENCE', label: 'Sciences' },
    { value: 'HISTORY', label: 'Histoire' },
    { value: 'GEOGRAPHY', label: 'Géographie' }
];

const difficulties = [
    { value: 'EASY', label: 'Facile', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HARD', label: 'Difficile', color: 'bg-orange-100 text-orange-800' },
    { value: 'EXPERT', label: 'Expert', color: 'bg-red-100 text-red-800' }
];

export function ExerciseGenerator() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        difficulty: 'MEDIUM',
        level: '',
        numberOfQuestions: 10
    });

    const handleGenerate = async () => {
        if (!formData.subject || !formData.level) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner une matière et un niveau',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/exercises/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Erreur lors de la génération');

            const data = await response.json();
            setGenerated(true);

            toast({
                title: 'Exercices générés !',
                description: `${formData.numberOfQuestions} exercices ont été créés avec succès.`
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de générer les exercices. Veuillez réessayer.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        toast({
            title: 'Téléchargement en cours',
            description: 'Votre PDF sera prêt dans quelques instants...'
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle>Générateur d'exercices</CardTitle>
                </div>
                <CardDescription>
                    Créez des exercices personnalisés adaptés au niveau de votre enfant
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Subject Selection */}
                <div className="space-y-2">
                    <Label htmlFor="subject">Matière</Label>
                    <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Sélectionnez une matière" />
                        </SelectTrigger>
                        <SelectContent>
                            {subjects.map((subject) => (
                                <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Level Input */}
                <div className="space-y-2">
                    <Label htmlFor="level">Niveau (ex: CE1, 6ème, etc.)</Label>
                    <Input
                        id="level"
                        placeholder="Entrez le niveau"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    />
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-2">
                    <Label>Difficulté</Label>
                    <div className="flex flex-wrap gap-2">
                        {difficulties.map((diff) => (
                            <Badge
                                key={diff.value}
                                variant={formData.difficulty === diff.value ? 'default' : 'outline'}
                                className={`cursor-pointer ${formData.difficulty === diff.value ? diff.color : ''
                                    }`}
                                onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                            >
                                {diff.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Nombre de questions</Label>
                        <span className="text-sm font-medium">{formData.numberOfQuestions}</span>
                    </div>
                    <Slider
                        value={[formData.numberOfQuestions]}
                        onValueChange={([value]) => setFormData({ ...formData, numberOfQuestions: value })}
                        min={5}
                        max={50}
                        step={5}
                        className="w-full"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Génération...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Générer
                            </>
                        )}
                    </Button>

                    {generated && (
                        <Button
                            variant="outline"
                            onClick={handleDownloadPDF}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                    )}
                </div>

                {/* AI Recommendation */}
                {formData.subject && formData.level && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Recommandation IA :</strong> Pour {formData.level} en {
                                subjects.find(s => s.value === formData.subject)?.label
                            }, nous suggérons de commencer par la difficulté {
                                difficulties.find(d => d.value === 'MEDIUM')?.label
                            }.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
