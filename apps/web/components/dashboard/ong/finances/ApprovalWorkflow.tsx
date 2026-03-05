
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export function ApprovalWorkflow({ expenses }: { expenses: any[] }) {
    const pending = expenses.filter(e => e.status === 'pending')
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg">Approbations en attente ({pending.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {pending.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune dépense en attente</p>
                ) : (
                    pending.map(e => (
                        <div key={e.id} className="flex items-center justify-between border p-3 rounded-lg">
                            <div>
                                <p className="font-medium text-sm">{e.description}</p>
                                <p className="text-xs text-muted-foreground">{e.amount.toLocaleString()} € • {e.date.toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600"><CheckCircle className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><XCircle className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
