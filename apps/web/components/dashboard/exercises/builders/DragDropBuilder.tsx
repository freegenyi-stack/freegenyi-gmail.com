'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, ArrowRight } from 'lucide-react';

interface DragDropPair {
    id: string;
    source: string;
    target: string;
}

interface DragDropContent {
    pairs: DragDropPair[];
}

export default function DragDropBuilder({
    data,
    onChange
}: {
    data: DragDropContent,
    onChange: (data: DragDropContent) => void
}) {
    const handleAddPair = () => {
        const newPair: DragDropPair = {
            id: Math.random().toString(36).substr(2, 9),
            source: '',
            target: '',
        };
        onChange({ ...data, pairs: [...(data.pairs || []), newPair] });
    };

    const handleRemovePair = (id: string) => {
        onChange({ ...data, pairs: data.pairs.filter(p => p.id !== id) });
    };

    const handleUpdatePair = (id: string, field: 'source' | 'target', value: string) => {
        onChange({
            ...data,
            pairs: data.pairs.map(p => p.id === id ? { ...p, [field]: value } : p)
        });
    };

    return (
        <div className="space-y-6">
            <Label>Paires d'association</Label>
            <div className="space-y-4">
                {data.pairs?.map((pair, index) => (
                    <div key={pair.id} className="flex gap-2 items-center">
                        <Input
                            placeholder="Élément A"
                            value={pair.source}
                            onChange={(e) => handleUpdatePair(pair.id, 'source', e.target.value)}
                        />
                        <ArrowRight className="text-gray-400 shrink-0" />
                        <Input
                            placeholder="Élément B"
                            value={pair.target}
                            onChange={(e) => handleUpdatePair(pair.id, 'target', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePair(pair.id)}
                        >
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={handleAddPair}
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une paire
                </Button>
            </div>
        </div>
    );
}
