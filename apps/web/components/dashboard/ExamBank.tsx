"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Exam {
    id: string;
    title?: string;
    title_fr?: string;
    type?: string;
    trimester?: string;
    duration?: number;
    total_score?: number;
    questions?: { id: string; points: number; statement: string; type: string }[];
}

interface Props { childId: string }

const TRIMESTER_LABELS: Record<string, string> = {
    semestre1: '📘 1er Trimestre',
    semestre2: '📗 2ème Trimestre',
    semestre3: '📙 3ème Trimestre',
};

const MOCK_EXAMS: Exam[] = [
    {
        id: 'exam_t1_mid', title: 'اختبار منتصف الفصل الأول', title_fr: 'Examen mi-trimestre 1',
        type: 'Intermédiaire', trimester: 'semestre1', duration: 45, total_score: 20,
        questions: [
            { id: 'q1', points: 5, statement: 'اكتب الأحرف التالية: م - ب - ر', type: 'writing' },
            { id: 'q2', points: 5, statement: 'أكمل الكلمات: أ..، ب..', type: 'fill_blank' },
            { id: 'q3', points: 10, statement: 'قراءة الجملة: أنا أحمد', type: 'reading' },
        ]
    },
    {
        id: 'exam_t1_final', title: 'اختبار نهاية الفصل الأول', title_fr: 'Examen de fin de trimestre 1',
        type: 'Final', trimester: 'semestre1', duration: 60, total_score: 20,
        questions: [
            { id: 'q1', points: 8, statement: 'اقرأ النص وأجب عن الأسئلة', type: 'comprehension' },
            { id: 'q2', points: 6, statement: 'اكتب الكلمات التالية من الإملاء', type: 'dictation' },
            { id: 'q3', points: 6, statement: 'أعبّر شفهياً عن نفسي', type: 'oral' },
        ]
    },
];

export function ExamBank({ childId }: Props) {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [openExam, setOpenExam] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/curriculum/dz/1ap/ar?dataType=exams`)
            .then(r => r.json())
            .then(data => {
                const fetched = data.exams || [];
                setExams(fetched.length > 0 ? fetched : MOCK_EXAMS);
                setLoading(false);
            })
            .catch(() => { setExams(MOCK_EXAMS); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
    );

    const grouped = {
        semestre1: exams.filter(e => e.trimester === 'semestre1' || !e.trimester).slice(0, 5),
        semestre2: exams.filter(e => e.trimester === 'semestre2').slice(0, 5),
        semestre3: exams.filter(e => e.trimester === 'semestre3').slice(0, 3),
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-xl font-extrabold text-slate-900">📝 Examens — Langue Arabe 1AP</h2>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">
                    Programme officiel algérien · {exams.length} examens disponibles
                </p>
            </div>

            {(Object.entries(grouped) as [string, Exam[]][]).map(([sem, semExams]) => {
                if (!semExams.length && sem !== 'semestre1') return null;
                const displayExams = semExams.length > 0 ? semExams : MOCK_EXAMS.filter(e => e.trimester === sem);
                return (
                    <div key={sem} className="space-y-3">
                        <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider px-1">
                            {TRIMESTER_LABELS[sem]}
                        </h3>
                        {(displayExams.length > 0 ? displayExams : MOCK_EXAMS.filter(e => e.trimester === sem || (!e.trimester && sem === 'semestre1'))).map(exam => {
                            const isOpen = openExam === exam.id;
                            return (
                                <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <button
                                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                                        onClick={() => setOpenExam(isOpen ? null : exam.id)}
                                    >
                                        <div className="p-2.5 bg-red-100 rounded-xl shrink-0">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-extrabold text-slate-900" dir="rtl">{exam.title}</div>
                                            <div className="text-sm text-slate-500 mt-0.5 font-medium">{exam.title_fr}</div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {exam.type && <Badge variant="secondary" className="text-xs">{exam.type}</Badge>}
                                                {exam.duration && (
                                                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                                        <Clock className="w-3 h-3" /> {exam.duration} min
                                                    </span>
                                                )}
                                                <span className="text-xs font-bold text-emerald-600">/ {exam.total_score || 20} pts</span>
                                            </div>
                                        </div>
                                        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                                    </button>

                                    {isOpen && exam.questions && exam.questions.length > 0 && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Questions</p>
                                            {exam.questions.map((q, qi) => (
                                                <div key={q.id || qi} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100">
                                                    <span className="text-xs font-extrabold text-slate-400 w-6 shrink-0 mt-0.5">{qi + 1}.</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800" dir="rtl">{q.statement}</p>
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
                );
            })}
        </div>
    );
}
