"use client"

import { useEffect, useState } from 'react'
import type { Expense, Grant } from '../types'

const mockGrants: Grant[] = [
    { id: 'g1', donorId: 'd1', name: 'Subvention Éducation', description: 'Soutien au programme éducatif', amount: 200000, currency: 'EUR', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), reportingDates: [new Date('2025-06-30'), new Date('2025-12-31')], restrictions: 'Exclusivement pour activités éducatives', amountReceived: 150000, amountUsed: 87500, programIds: ['p1'], status: 'active', attachments: [] },
    { id: 'g2', donorId: 'd2', name: 'Fonds Eau', description: 'Construction de puits', amount: 50000, currency: 'EUR', startDate: new Date('2025-02-01'), endDate: new Date('2025-08-31'), reportingDates: [new Date('2025-05-31')], restrictions: '', amountReceived: 25000, amountUsed: 12000, programIds: ['p2'], status: 'active', attachments: [] }
]

const mockExpenses: Expense[] = [
    { id: 'e1', programId: 'p1', grantId: 'g1', amount: 15000, currency: 'EUR', date: new Date('2025-02-15'), category: 'personnel', description: 'Salaires enseignants', status: 'approved', approvedBy: 'u1', approvalDate: new Date('2025-02-20') },
    { id: 'e2', programId: 'p1', grantId: 'g1', amount: 5000, currency: 'EUR', date: new Date('2025-02-20'), category: 'equipment', description: 'Achat de manuels', status: 'approved', approvedBy: 'u1', approvalDate: new Date('2025-02-25') },
    { id: 'e3', programId: 'p2', grantId: 'g2', amount: 8000, currency: 'EUR', date: new Date('2025-03-01'), category: 'program_activities', description: 'Matériaux construction', status: 'pending' }
]

export function useBudget() {
    const [grants, setGrants] = useState<Grant[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setGrants(mockGrants)
            setExpenses(mockExpenses)
            setLoading(false)
        }, 600)
    }, [])
    return { grants, expenses, loading }
}
