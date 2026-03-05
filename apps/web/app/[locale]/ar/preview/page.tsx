import fs from 'fs';
import path from 'path';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ArabicPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Paths to the refined curriculum files
    const curriculumPath = path.join(process.cwd(), '../../programs/ar/algeria/4_1ap/Matière_1_ اللغة العربية/algerie_1ap_arabe_curriculum.json');
    const evalsPath = path.join(process.cwd(), '../../programs/ar/algeria/4_1ap/Matière_1_ اللغة العربية/algerie_1ap_arabe_evaluations.json');
    const examsPath = path.join(process.cwd(), '../../programs/ar/algeria/4_1ap/Matière_1_ اللغة العربية/algerie_1ap_arabe_exams.json');

    let curriculumData = null;
    let evalsData = null;
    let examsData = null;

    try {
        curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
        evalsData = JSON.parse(fs.readFileSync(evalsPath, 'utf-8'));
        examsData = JSON.parse(fs.readFileSync(examsPath, 'utf-8'));
    } catch (error) {
        console.error("Error loading refined data:", error);
    }

    if (!curriculumData) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold text-red-500">Erreur de chargement</h1>
                <p>Impossible de charger les fichiers JSON raffinés.</p>
                <code className="block mt-4 text-xs italic">Vérifiez les chemins dans app/[locale]/ar/preview/page.tsx</code>
            </div>
        );
    }

    // Group maqaate by trimestre
    const maqaate = curriculumData.maqaate || [];
    const groupedMaqaate = maqaate.reduce((acc: any, maqta: any) => {
        const t = maqta.trimestre || 'Non défini';
        if (!acc[t]) acc[t] = [];
        acc[t].push(maqta);
        return acc;
    }, {});

    return (
        <div className="container py-10 space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        1AP - Algérie 🇩🇿
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">Mode Aperçu Premium (Données Réelles)</Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                    <span className="text-5xl">🌍</span> {curriculumData.metadata.subject_name_fr || "Langue Arabe"}
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl">
                    Aperçu des données raffinées et enrichies pour le dashboard FreeGeny Parents.
                </p>
            </header>

            <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
                    <TabsTrigger value="curriculum">Programme (Maqaate)</TabsTrigger>
                    <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                    <TabsTrigger value="exams">Examens Annuel</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="pt-6 space-y-10">
                    {Object.keys(groupedMaqaate).sort().map((tKey) => (
                        <section key={tKey} className="space-y-6">
                            <h2 className="text-2xl font-bold border-b pb-2 flex items-center gap-2 text-slate-800">
                                Trimestre {tKey} <Badge variant="secondary" className="font-normal">{groupedMaqaate[tKey].length} Séquences</Badge>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groupedMaqaate[tKey].map((maqta: any, mIdx: number) => (
                                    <Card key={mIdx} className="overflow-hidden border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                        <CardHeader className="bg-slate-50/50">
                                            <CardTitle className="text-lg flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span dir="rtl" className="font-bold text-xl mb-1">{maqta.titre}</span>
                                                    <span className="text-xs text-muted-foreground font-normal">{maqta.titre_fr}</span>
                                                </div>
                                                <Badge variant="outline" className="ml-2 font-mono">{maqta.maqta_id}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-5">
                                            {maqta.parent_tip_fr && (
                                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 leading-relaxed shadow-sm">
                                                    <strong className="block mb-1 text-blue-900">💡 Conseil Parent :</strong>
                                                    {maqta.parent_tip_fr}
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compétences visées</p>
                                                <ul className="text-sm space-y-2">
                                                    {(maqta.competences_visees || []).map((comp: string, cIdx: number) => (
                                                        <li key={cIdx} className="flex items-start gap-2 text-slate-600">
                                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 shrink-0" />
                                                            {comp}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {maqta.vocabulaire_cible && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vocabulaire Arabe</p>
                                                    <div className="flex flex-wrap gap-1.5" dir="rtl">
                                                        {maqta.vocabulaire_cible.map((word: string, wIdx: number) => (
                                                            <Badge key={wIdx} variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
                                                                {word}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ))}
                </TabsContent>

                <TabsContent value="evaluations" className="pt-6">
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8">
                        <h3 className="text-lg font-bold text-amber-800 mb-2">Structure des Évaluations (Refined)</h3>
                        <p className="text-amber-700 text-sm italic">
                            Les évaluations sont désormais structurées pour une gestion dynamique par le moteur d&apos;apprentissage FreeGeny.
                        </p>
                    </div>
                    <div className="grid gap-4">
                        {(evalsData?.evaluations || []).map((evalItem: any, idx: number) => (
                            <Card key={idx} className="border-slate-200 hover:border-primary/30 transition-colors">
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-slate-400 uppercase">{evalItem.type}</span>
                                            <Badge variant="outline" className="text-[10px] px-1 h-4">{evalItem.id}</Badge>
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-800" dir="rtl">{evalItem.titre}</h4>
                                        <div className="flex gap-4 mt-3">
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-400" /> {evalItem.questions?.length || 0} Questions
                                            </span>
                                            <span className="text-xs text-slate-500 italic">Prêt pour Mobile</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                            Qualité Validée
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="exams" className="pt-6">
                    <div className="space-y-12">
                        {['trimestre1', 'trimestre2', 'trimestre3'].map((tKey) => (
                            <div key={tKey} className="space-y-6">
                                <h3 className="text-2xl font-bold text-slate-800 border-l-4 border-primary pl-4 capitalize flex justify-between items-center">
                                    {tKey.replace('trimestre', 'Trimestre ')}
                                    <Badge variant="outline">Master Program</Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(examsData?.exams?.[tKey]?.midterm || []).map((exam: any, idx: number) => (
                                        <Card key={idx} className="border-slate-200 bg-white/50 backdrop-blur-sm overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="p-5 flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase">Composition Midterm</Badge>
                                                        <h5 dir="rtl" className="text-2xl font-bold">{exam.name}</h5>
                                                    </div>
                                                    <div className="bg-primary text-white p-2 rounded-lg text-center min-w-[60px]">
                                                        <span className="text-lg font-bold block">{exam.total_score}</span>
                                                        <span className="text-[8px] uppercase">Points</span>
                                                    </div>
                                                </div>
                                                <div className="px-5 pb-5">
                                                    <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 text-sm text-orange-900 leading-relaxed italic">
                                                        <strong className="block mb-1 not-italic">🎯 Conseil Support Parent :</strong>
                                                        &ldquo;{exam.parent_exam_tip_fr}&rdquo;
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
