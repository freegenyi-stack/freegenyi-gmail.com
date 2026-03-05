
import { Card, CardContent } from '@/components/ui/card'
import { Users, Heart, Clock, TrendingUp } from 'lucide-react'

interface Props {
    stats: {
        totalBeneficiaries: number
        totalDonations: number
        totalVolunteerHours: number
        programsActive: number
    }
}

export function ImpactStatsGrid({ stats }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="h-5 w-5" />} label="Bénéficiaires" value={stats.totalBeneficiaries.toLocaleString()} />
            <StatCard icon={<Heart className="h-5 w-5" />} label="Dons totaux (€)" value={stats.totalDonations.toLocaleString()} />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Heures bénévolat" value={stats.totalVolunteerHours.toLocaleString()} />
            <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Programmes actifs" value={stats.programsActive} />
        </div>
    )
}

function StatCard({ icon, label, value }: any) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-heading font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
