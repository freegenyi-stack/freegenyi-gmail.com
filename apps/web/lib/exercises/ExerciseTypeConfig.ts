import { LucideIcon, HelpCircle, LayoutList, GripVertical, Pencil } from 'lucide-react';

export type ExerciseType = 'QCM' | 'TEXT_GAP' | 'DRAG_DROP' | 'DRAWING';

export interface ExerciseTypeOption {
    id: ExerciseType;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export const EXERCISE_TYPES: ExerciseTypeOption[] = [
    {
        id: 'QCM',
        label: 'Questionnaire (QCM)',
        description: 'Questions à choix multiples avec une ou plusieurs réponses correctes.',
        icon: HelpCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        id: 'TEXT_GAP',
        label: 'Texte à trous',
        description: 'Compléter un texte en remplissant les mots manquants.',
        icon: LayoutList,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    {
        id: 'DRAG_DROP',
        label: 'Glisser-Déposer',
        description: 'Associer des éléments entre eux par glisser-déposer.',
        icon: GripVertical,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        id: 'DRAWING',
        label: 'Dessin Libre',
        description: 'Répondre en dessinant ou en annotant une image.',
        icon: Pencil,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    },
];
