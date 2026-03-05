
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'

export function PredictiveInsights() {
    const insights = [
        { icon: <TrendingUp className="h-4 w-4 text-green-600" />, text: 'Le programme Éducation devrait atteindre ses objectifs avec 2 mois d\'avance' },
        { icon: <AlertCircle className="h-4 w-4 text-orange-500" />, text: 'Baisse de 15% des dons récurrents prévue au T3 si aucune action' },
        { icon: <Sparkles className="h-4 w-4 text-primary" />, text: 'Opportunité de 50k€ identifiée auprès de la Fondation X' },
    ]
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Insights prédictifs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {insights.map((i, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                        {i.icon}
                        <span>{i.text}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
