'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, CheckCircle2 } from 'lucide-react';

interface QCMOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface QCMContent {
    question: string;
    options: QCMOption[];
}

export default function QCMBuilder({
    data,
    onChange
}: {
    data: QCMContent,
    onChange: (data: QCMContent) => void
}) {
    const handleAddOption = () => {
        const newOption: QCMOption = {
            id: Math.random().toString(36).substr(2, 9),
            text: '',
            isCorrect: false,
        };
        onChange({ ...data, options: [...data.options, newOption] });
    };

    const handleRemoveOption = (id: string) => {
        onChange({ ...data, options: data.options.filter(o => o.id !== id) });
    };

    const handleUpdateOption = (id: string, text: string) => {
        onChange({
            ...data,
            options: data.options.map(o => o.id === id ? { ...o, text } : o)
        });
    };

    const handleToggleCorrect = (id: string) => {
        onChange({
            ...data,
            options: data.options.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o)
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                    id="question"
                    placeholder="Ex: Quelle est la capitale de la France ?"
                    value={data.question || ''}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
            </div>

            <div className="space-y-4">
                <Label>Options de réponse</Label>
                {data.options?.map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center">
                        <Button
                            type="button"
                            variant={option.isCorrect ? "default" : "outline"}
                            size="icon"
                            className={option.isCorrect ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => handleToggleCorrect(option.id)}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(option.id)}
                        >
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={handleAddOption}
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une option
                </Button>
            </div>
        </div>
    );
}
