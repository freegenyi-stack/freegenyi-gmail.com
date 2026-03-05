'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingContent {
    prompt: string;
    backgroundImage?: string;
}

export default function DrawingBuilder({
    data,
    onChange
}: {
    data: DrawingContent,
    onChange: (data: DrawingContent) => void
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="drawing-prompt">Consigne de dessin</Label>
                <Textarea
                    id="drawing-prompt"
                    placeholder="Ex: Dessine un soleil avec des lunettes de soleil."
                    className="min-h-[100px]"
                    value={data.prompt || ''}
                    onChange={(e) => onChange({ ...data, prompt: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Image de fond (optionnel)</Label>
                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-sm">Glissez une image ou cliquez pour télécharger</p>
                    <p className="text-xs mt-1">Sert de base au dessin de l'élève</p>
                    <Button variant="outline" size="sm" className="mt-4" type="button">
                        Parcourir...
                    </Button>
                </div>
            </div>
        </div>
    );
}
