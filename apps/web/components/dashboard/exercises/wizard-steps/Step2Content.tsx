'use client';

import { useExerciseBuilder } from '@/hooks/useExerciseBuilder';
import QCMBuilder from '../builders/QCMBuilder';
import TextGapBuilder from '../builders/TextGapBuilder';
import DragDropBuilder from '../builders/DragDropBuilder';
import DrawingBuilder from '../builders/DrawingBuilder';

export default function Step2Content() {
    const { data, updateData } = useExerciseBuilder();

    const renderBuilder = () => {
        const props = {
            data: data.content || {},
            onChange: (content: any) => updateData({ content })
        };

        switch (data.type) {
            case 'QCM':
                return <QCMBuilder {...props} data={props.data as any} />;
            case 'TEXT_GAP':
                return <TextGapBuilder {...props} data={props.data as any} />;
            case 'DRAG_DROP':
                return <DragDropBuilder {...props} data={props.data as any} />;
            case 'DRAWING':
                return <DrawingBuilder {...props} data={props.data as any} />;
            default:
                return <div className="p-8 text-center text-gray-500">Choisissez un type d'exercice pour commencer.</div>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Contenu de l'exercice - {data.type}</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm min-h-[400px]">
                {renderBuilder()}
            </div>
        </div>
    );
}
