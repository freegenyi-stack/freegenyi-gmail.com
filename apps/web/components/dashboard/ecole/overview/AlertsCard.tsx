// apps/web/components/dashboard/ecole/overview/AlertsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, XCircle } from 'lucide-react'

export function AlertsCard() {
    const alerts = [
        { icon: <Clock className="h-4 w-4 text-orange-500" />, message: '3 devoirs en retard', type: 'warning' },
        { icon: <XCircle className="h-4 w-4 text-red-500" />, message: '2 absences non justifiées', type: 'error' },
        { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, message: 'Fin du trimestre dans 5 jours', type: 'info' },
    ]
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg">Alertes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors">
                        <div className={`p-2 rounded-full bg-background border shadow-sm`}>
                            {alert.icon}
                        </div>
                        <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
