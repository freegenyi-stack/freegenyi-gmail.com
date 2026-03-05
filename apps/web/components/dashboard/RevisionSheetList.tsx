"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, ChevronDown, ChevronUp } from "lucide-react";

interface Evaluation {
    evaluation_id: string;
    type: string;
    duration: string;
    total_score: string;
    questions: {
        q_id: string;
        type: string;
        points: number;
        enonce: string;
        correct?: string;
    }[];
}

interface Props { childId: string }

const TYPE_COLOR: Record<string, string> = {
    '🟡 Flash': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    '🟠 Formative': 'bg-orange-100 text-orange-700 border-orange-200',
    '🔴 Sommative': 'bg-red-100 text-red-700 border-red-200',
    '🟢 Diagnostic': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export function RevisionSheetList({ childId }: Props) {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEval, setOpenEval] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/curriculum/dz/1ap/ar?dataType=evaluations')
            .then(r => r.json())
            .then(data => {
                setEvaluations(data.evaluations || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
    );

    if (evaluations.length === 0) return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucune fiche de révision disponible pour l&apos;instant.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-extrabold text-slate-900">📋 Révisions & Évaluations</h2>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">
                    <span className="font-bold text-blue-600">{evaluations.length}</span> évaluations formatives disponibles
                </p>
            </div>

            <div className="space-y-3">
                {evaluations.map((ev, idx) => {
                    const isOpen = openEval === ev.evaluation_id + idx;
                    const typeLabel = ev.type || '🟡 Flash';
                    const colorClass = TYPE_COLOR[typeLabel] || 'bg-slate-100 text-slate-600 border-slate-200';

                    return (
                        <div key={`${ev.evaluation_id}-${idx}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenEval(isOpen ? null : ev.evaluation_id + idx)}
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 font-extrabold text-orange-600">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-extrabold text-slate-900">Évaluation n°{idx + 1}</div>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                                            {typeLabel}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">{ev.duration}</span>
                                        <span className="text-xs font-bold text-emerald-600">{ev.total_score}</span>
                                        <Badge variant="secondary" className="text-xs">{ev.questions?.length || 0} questions</Badge>
                                    </div>
                                </div>
                                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                            </button>

                            {isOpen && ev.questions && ev.questions.length > 0 && (
                                <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-2">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Questions</p>
                                    {ev.questions.map((q, qi) => (
                                        <div key={`${q.q_id}-${qi}`} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100">
                                            <span className="text-xs font-extrabold text-slate-400 w-6 shrink-0 mt-0.5">{qi + 1}.</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-800" dir="rtl">{q.enonce}</p>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 shrink-0">{q.points}pts</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
