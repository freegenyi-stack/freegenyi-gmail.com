import { create } from 'zustand';
import { ExerciseType } from '@/lib/exercises/ExerciseTypeConfig';

interface ExerciseData {
    title: string;
    description: string;
    type: ExerciseType;
    level: string;
    content: any;
    destinations: string[]; // IDs of children/students
}

interface ExerciseBuilderState {
    step: 1 | 2 | 3;
    data: ExerciseData;
    isSubmitting: boolean;
    setStep: (step: 1 | 2 | 3) => void;
    updateData: (newData: Partial<ExerciseData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    submit: () => Promise<void>;
}

const initialData: ExerciseData = {
    title: '',
    description: '',
    type: 'QCM',
    level: 'CP',
    content: null,
    destinations: [],
};

export const useExerciseBuilder = create<ExerciseBuilderState>((set, get) => ({
    step: 1,
    data: initialData,
    isSubmitting: false,

    setStep: (step) => set({ step }),

    updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
    })),

    nextStep: () => set((state) => ({
        step: Math.min(state.step + 1, 3) as 1 | 2 | 3
    })),

    prevStep: () => set((state) => ({
        step: Math.max(state.step - 1, 1) as 1 | 2 | 3
    })),

    reset: () => set({
        step: 1,
        data: initialData,
        isSubmitting: false
    }),

    submit: async () => {
        set({ isSubmitting: true });
        try {
            // Mock API call
            console.log('Submitting exercise:', get().data);
            await new Promise(resolve => setTimeout(resolve, 1500));
            // router.push('/teacher/exercises');
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            set({ isSubmitting: false });
        }
    },
}));
