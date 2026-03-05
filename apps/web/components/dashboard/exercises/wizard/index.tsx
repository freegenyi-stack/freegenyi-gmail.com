'use client';

import { useExerciseBuilder } from '@/hooks/useExerciseBuilder';
import Step1Basics from '../wizard-steps/Step1Basics';
import Step2Content from '../wizard-steps/Step2Content';
import Step3Preview from '../wizard-steps/Step3Preview';
import SendToChildButton from '../wizard-steps/SendToChildButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExerciseWizard({ onClose }: { onClose: () => void }) {
    const { step, nextStep, prevStep, reset, data } = useExerciseBuilder();

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Basics />;
            case 2: return <Step2Content />;
            case 3: return <Step3Preview />;
            default: return null;
        }
    };

    const isStep1Valid = data.title.length > 0;
    const isStep2Valid = data.content && Object.keys(data.content).length > 0;

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-white border-b">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Nouvel Exercice
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Assistant de création pédagogique</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { reset(); onClose(); }} className="rounded-full hover:bg-gray-100">
                    <X className="h-6 w-6 text-gray-400" />
                </Button>
            </div>

            {/* Stepper */}
            <div className="px-8 mt-8">
                <div className="flex items-center gap-4 max-w-md mx-auto">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 flex flex-col gap-2">
                            <div className={cn(
                                "h-2 rounded-full transition-all duration-500",
                                step >= s ? "bg-primary" : "bg-gray-200"
                            )} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest text-center",
                                step >= s ? "text-primary" : "text-gray-400"
                            )}>
                                Étape {s}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">
                <div className="max-w-3xl mx-auto">
                    {renderStep()}
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white border-t flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="font-bold text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Retour
                </Button>

                <div className="flex items-center gap-4">
                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                            className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all font-bold"
                        >
                            Suivant <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <SendToChildButton />
                    )}
                </div>
            </div>
        </div>
    );
}
