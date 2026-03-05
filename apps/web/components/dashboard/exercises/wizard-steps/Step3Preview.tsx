'use client';

import { useExerciseBuilder } from '@/hooks/useExerciseBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock students data
const MOCK_STUDENTS = [
    { id: '1', name: 'Amadou', level: 'CP', avatar: '/avatars/boy-1.png' },
    { id: '2', name: 'Fatou', level: 'CP', avatar: '/avatars/girl-1.png' },
    { id: '3', name: 'Moussa', level: 'CP', avatar: '/avatars/boy-2.png' },
];

export default function Step3Preview() {
    const { data, updateData } = useExerciseBuilder();

    const toggleStudent = (id: string) => {
        const current = data.destinations || [];
        if (current.includes(id)) {
            updateData({ destinations: current.filter(sId => sId !== id) });
        } else {
            updateData({ destinations: [...current, id] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{data.title || "Sans titre"}</h3>
                        <p className="text-gray-500">{data.description || "Aucune description"}</p>
                    </div>
                    <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full">
                        {data.level}
                    </Badge>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-dashed text-center">
                    <p className="text-gray-400 font-medium italic">
                        Aperçu de l'exercice dynamique {data.type}...
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Envoyer à qui ?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_STUDENTS.map((student) => {
                        const isSelected = data.destinations?.includes(student.id);
                        return (
                            <button
                                key={student.id}
                                type="button"
                                onClick={() => toggleStudent(student.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-gray-100 hover:border-primary/30 bg-white"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={student.avatar} alt={student.name} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-sm">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.level}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
