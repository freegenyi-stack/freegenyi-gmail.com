
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function RecentDonationsFeed({ donations }: { donations: { donorName: string; amount: number; date: Date; program?: string }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg">Dons récents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {donations.map((d, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                            <p className="font-medium text-sm">{d.donorName}</p>
                            <p className="text-xs text-muted-foreground">{d.program && `pour ${d.program} • `}{format(d.date, 'dd MMM', { locale: fr })}</p>
                        </div>
                        <span className="font-heading font-semibold">{d.amount.toLocaleString()} €</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
