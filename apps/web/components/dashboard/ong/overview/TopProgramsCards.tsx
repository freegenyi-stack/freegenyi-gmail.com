
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function TopProgramsCards({ programs }: { programs: { name: string; budgetUtilization: number; beneficiaries: number }[] }) {
    return (
        <div className="space-y-3">
            {programs.map(p => (
                <Card key={p.name}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>Utilisation budget</span>
                            <span>{p.budgetUtilization}%</span>
                        </div>
                        <Progress value={p.budgetUtilization} className="h-2" />
                        <p className="text-xs text-muted-foreground">{p.beneficiaries} bénéficiaires</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
