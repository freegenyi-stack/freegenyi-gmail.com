'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExerciseBuilder } from '@/hooks/useExerciseBuilder';
import { EXERCISE_TYPES } from '@/lib/exercises/ExerciseTypeConfig';
import { cn } from '@/lib/utils';

export default function Step1Basics() {
    const { data, updateData } = useExerciseBuilder();

    const levels = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-bold">Titre de l'exercice</Label>
                    <Input
                        id="title"
                        placeholder="Ex: Les additions posées"
                        className="text-lg h-12"
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-bold">Description (optionnel)</Label>
                    <Textarea
                        id="description"
                        placeholder="Courte description de l'objectif pédagogique..."
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-base font-bold">Niveau scolaire</Label>
                        <Select value={data.level} onValueChange={(level) => updateData({ level })}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Choisir le niveau" />
                            </SelectTrigger>
                            <SelectContent>
                                {levels.map(level => (
                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-base font-bold text-gray-900">Type d'exercice</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXERCISE_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = data.type === type.id;
                        return (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => updateData({ type: type.id, content: {} })}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                        : "border-gray-100 hover:border-primary/30 hover:bg-gray-50 bg-white"
                                )}
                            >
                                <div className={cn("p-3 rounded-xl", type.bgColor, type.color)}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{type.label}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                        {type.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
