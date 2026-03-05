'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react';

interface TextGapContent {
    text: string;
}

export default function TextGapBuilder({
    data,
    onChange
}: {
    data: TextGapContent,
    onChange: (data: TextGapContent) => void
}) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="text-content">Texte de l'exercice</Label>
                <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 mb-4 text-sm text-blue-800">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>
                        Encadrez les mots à deviner avec des crochets.
                        Exemple : Le petit chat mange une **[croquette]**.
                    </p>
                </div>
                <Textarea
                    id="text-content"
                    placeholder="Tapez votre texte ici..."
                    className="min-h-[200px]"
                    value={data.text || ''}
                    onChange={(e) => onChange({ ...data, text: e.target.value })}
                />
            </div>

            {data.text && (
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                    <p className="text-xs uppercase font-bold mb-2">Aperçu rapide</p>
                    <div className="text-gray-800 leading-relaxed">
                        {data.text.split(/(\[.*?\])/).map((part, i) => (
                            part.startsWith('[') && part.endsWith(']') ? (
                                <span key={i} className="mx-1 px-2 py-0.5 bg-primary/20 text-primary rounded font-bold">
                                    {part.slice(1, -1)}
                                </span>
                            ) : part
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
