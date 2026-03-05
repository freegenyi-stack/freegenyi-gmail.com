
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target } from 'lucide-react'

export function OutcomeIndicators({ indicators }: { indicators: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Indicateurs de résultat
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {indicators.map(ind => {
                    const progress = ((ind.currentValue - ind.baselineValue) / (ind.targetValue - ind.baselineValue)) * 100
                    return (
                        <div key={ind.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{ind.name}</span>
                                <span>{ind.currentValue} / {ind.targetValue} {ind.measurementUnit}</span>
                            </div>
                            <Progress value={Math.min(100, progress)} className="h-2" />
                            <p className="text-xs text-muted-foreground">Base {ind.baselineValue} ({ind.baselineYear})</p>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
