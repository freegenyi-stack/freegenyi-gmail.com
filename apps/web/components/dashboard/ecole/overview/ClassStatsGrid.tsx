// apps/web/components/dashboard/ecole/overview/ClassStatsGrid.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Users, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react'

interface Props {
    stats: {
        studentCount: number
        assignmentsDue: number
        avgGrade: number
        absentToday: number
    }
}

export function ClassStatsGrid({ stats }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="h-5 w-5" />} label="Élèves" value={stats.studentCount} />
            <StatCard icon={<BookOpen className="h-5 w-5" />} label="Devoirs à rendre" value={stats.assignmentsDue} />
            <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Moyenne générale" value={`${stats.avgGrade}%`} />
            <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Absents aujourd'hui" value={stats.absentToday} />
        </div>
    )
}

function StatCard({ icon, label, value }: any) {
    return (
        <Card className="hover:shadow-sm transition-shadow duration-200">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <p className="text-2xl font-heading font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
