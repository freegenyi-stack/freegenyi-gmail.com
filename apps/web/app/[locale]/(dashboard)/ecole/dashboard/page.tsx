// app/[locale]/(dashboard)/ecole/dashboard/page.tsx
import { ClassStatsGrid } from '@/components/dashboard/ecole/overview/ClassStatsGrid'
import { RecentActivityFeed } from '@/components/dashboard/ecole/overview/RecentActivityFeed'
import { AlertsCard } from '@/components/dashboard/ecole/overview/AlertsCard'
import { ClassProgressChart } from '@/components/dashboard/ecole/overview/ClassProgressChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Users, BookOpen, GraduationCap, Calendar, MessageSquare, Settings } from 'lucide-react'

export default function EcoleDashboardPage() {
    const mockStats = { studentCount: 24, assignmentsDue: 3, avgGrade: 78, absentToday: 2 }
    const mockActivities = [
        { id: '1', type: 'submission', title: 'Léo Martin a rendu son devoir', description: 'Fractions simples', timestamp: new Date() },
        { id: '2', type: 'grade', title: 'Note de dictée enregistrée', description: 'Classe: CM1', timestamp: new Date(Date.now() - 3600000) },
        { id: '3', type: 'attendance', title: 'Appel terminé', description: '2 absents aujourd\'hui', timestamp: new Date(Date.now() - 7200000) },
    ]
    const mockChartData = [
        { subject: 'Maths', average: 75 },
        { subject: 'Français', average: 82 },
        { subject: 'Sciences', average: 68 },
        { subject: 'Histoire', average: 90 },
        { subject: 'Anglais', average: 85 },
    ]

    return (
        <div className="space-y-8 animate-reveal">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="font-heading text-4xl font-black tracking-tight flex items-center gap-3">
                        Espace Enseignant <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground font-medium">Gérez votre classe CM1 et suivez la progression de vos élèves.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Session Active</span>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white/50 border border-slate-200 p-1 rounded-2xl h-auto overflow-x-auto flex-nowrap w-full justify-start md:justify-center gap-2">
                    <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <Calendar className="h-4 w-4" /> Vue d'ensemble
                    </TabsTrigger>
                    <TabsTrigger value="students" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <Users className="h-4 w-4" /> Élèves
                    </TabsTrigger>
                    <TabsTrigger value="curriculum" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <BookOpen className="h-4 w-4" /> Cours & Supports
                    </TabsTrigger>
                    <TabsTrigger value="grades" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <GraduationCap className="h-4 w-4" /> Évaluations
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <MessageSquare className="h-4 w-4" /> Messages
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2">
                        <Settings className="h-4 w-4" /> Paramètres
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                    <ClassStatsGrid stats={mockStats} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <RecentActivityFeed activities={mockActivities as any} />
                            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                                <CardHeader className="bg-primary/5 pb-2">
                                    <CardTitle className="font-heading text-xl font-bold">Moyennes par matière</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ClassProgressChart data={mockChartData} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-8">
                            <AlertsCard />
                            <div className="p-6 rounded-3xl bg-gradient-premium shadow-lg text-white">
                                <h3 className="font-heading font-bold text-lg mb-2">Conseil du jour</h3>
                                <p className="text-sm opacity-90 leading-relaxed italic">
                                    "La motivation est le premier moteur de l'apprentissage. N'oubliez pas de féliciter les efforts, même minimes."
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="students" className="animate-reveal">
                    <Card className="rounded-3xl border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>Liste des Élèves (CM1)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic text-center py-20">Chargement de la liste des élèves...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="curriculum">
                    <Card className="rounded-3xl border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>Supports Pédagogiques</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic text-center py-20">Chargement de la bibliothèque de ressources...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
