'use client';

import { useBudget } from '../hooks/useBudget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function BudgetOverview() {
    const { grants, expenses, loading } = useBudget()
    if (loading) return <div>Chargement...</div>

    const totalGrantAmount = grants.reduce((sum, g) => sum + g.amount, 0)
    const totalReceived = grants.reduce((sum, g) => sum + g.amountReceived, 0)
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    const utilization = totalReceived > 0 ? (totalSpent / totalReceived) * 100 : 0

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-heading text-lg">Vue d'ensemble budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total subventions</p>
                            <p className="text-2xl font-heading font-bold">{totalGrantAmount.toLocaleString()} €</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reçu</p>
                            <p className="text-2xl font-heading font-bold">{totalReceived.toLocaleString()} €</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dépensé</p>
                            <p className="text-2xl font-heading font-bold">{totalSpent.toLocaleString()} €</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm">
                            <span>Taux d'utilisation</span>
                            <span>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2 mt-1" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
