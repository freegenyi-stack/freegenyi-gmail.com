
import { BudgetOverview } from '@/components/dashboard/ong/finances/BudgetOverview'
import { ApprovalWorkflow } from '@/components/dashboard/ong/finances/ApprovalWorkflow'

export default function FinancesPage() {
    const mockExpenses = [
        { id: 'e1', description: 'Fournitures scolaires', amount: 450, date: new Date(), status: 'pending' },
        { id: 'e2', description: 'Transport bénévole', amount: 120, date: new Date(), status: 'pending' },
    ]

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-2xl font-bold">Gestion Financière</h1>
            <BudgetOverview />
            <ApprovalWorkflow expenses={mockExpenses} />
        </div>
    )
}
