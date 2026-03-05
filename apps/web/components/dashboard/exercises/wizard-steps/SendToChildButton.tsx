'use client';

import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';
import { useExerciseBuilder } from '@/hooks/useExerciseBuilder';
import { useState } from 'react';

export default function SendToChildButton() {
    const { submit, isSubmitting, data } = useExerciseBuilder();
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        if (data.destinations.length === 0) {
            alert("Veuillez sélectionner au moins un destinataire.");
            return;
        }
        await submit();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    if (sent) {
        return (
            <Button disabled className="bg-green-600 text-white gap-2 h-12 px-8 rounded-full">
                <CheckCircle2 className="h-5 w-5" /> Envoyé !
            </Button>
        );
    }

    return (
        <Button
            onClick={handleSend}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all font-bold"
        >
            {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Send className="h-5 w-5" />
            )}
            Envoyer à l'élève
        </Button>
    );
}
