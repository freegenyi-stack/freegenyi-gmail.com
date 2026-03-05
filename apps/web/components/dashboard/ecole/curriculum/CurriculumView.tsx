// apps/web/components/dashboard/ecole/curriculum/CurriculumView.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookMarked, ChevronRight } from 'lucide-react'

export function CurriculumView() {
    const competencies = [
        { name: 'Fractions et nombres décimaux', progress: 65, color: 'bg-primary' },
        { name: 'Géométrie plane et tracés', progress: 40, color: 'bg-yellow-500' },
        { name: 'Grammaire : les compléments', progress: 80, color: 'bg-green-500' },
        { name: 'Histoire : les Temps Modernes', progress: 25, color: 'bg-orange-500' },
    ]

    return (
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <BookMarked className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-heading text-xl">Suivi du programme</CardTitle>
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Automne 2025</span>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {competencies.map(c => (
                    <div key={c.name} className="group cursor-pointer">
                        <div className="flex justify-between text-sm mb-2 group-hover:translate-x-1 transition-transform">
                            <span className="font-bold flex items-center gap-2">
                                {c.name}
                            </span>
                            <span className="font-heading font-black text-primary">{c.progress}%</span>
                        </div>
                        <div className="relative h-2.5 w-full bg-accent rounded-full overflow-hidden">
                            <div
                                className={`h-full ${c.color} transition-all duration-1000 ease-out rounded-full`}
                                style={{ width: `${c.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
                <div className="pt-4 border-t border-muted/20">
                    <button className="w-full text-xs font-bold text-muted-foreground hover:text-primary flex items-center justify-center gap-1 group transition-colors">
                        Voir tout le programme <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
