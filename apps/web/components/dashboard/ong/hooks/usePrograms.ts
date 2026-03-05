"use client"

import { useEffect, useState } from 'react'
import type { Program, Objective, OutcomeIndicator } from '../types'

const mockObjectives: Objective[] = [
    { id: 'obj1', programId: 'p1', description: 'Former 100 enseignants', startDate: new Date('2025-01-01'), targetValue: 100, currentValue: 45, unit: 'enseignants', status: 'in_progress' },
    { id: 'obj2', programId: 'p1', description: 'Distribuer 500 kits scolaires', startDate: new Date('2025-02-01'), targetValue: 500, currentValue: 230, unit: 'kits', status: 'in_progress' },
]

const mockIndicators: OutcomeIndicator[] = [
    { id: 'ind1', programId: 'p1', name: 'Taux de réussite scolaire', description: 'Pourcentage d\'élèves réussissant l\'examen', baselineValue: 45, baselineYear: 2023, targetValue: 75, targetYear: 2026, currentValue: 62, measurementUnit: '%', dataSource: 'Ministère Éducation', collectionFrequency: 'annual' }
]

const mockPrograms: Program[] = [
    {
        id: 'p1',
        name: 'Éducation pour tous',
        description: 'Programme de soutien scolaire en zones rurales',
        startDate: new Date('2025-01-01'),
        status: 'active',
        budget: 250000,
        budgetCurrency: 'EUR',
        actualSpent: 87500,
        objectives: mockObjectives,
        scope: 'national',
        managerId: 'u1',
        location: ['Région A', 'Région B'],
        sdgAlignment: ['SDG4']
    },
    {
        id: 'p2',
        name: 'Eau potable',
        description: 'Construction de puits et formation à l\'hygiène',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-12-31'),
        status: 'active',
        budget: 500000,
        budgetCurrency: 'EUR',
        actualSpent: 210000,
        objectives: [],
        scope: 'regional',
        managerId: 'u2',
        location: ['Région C'],
        sdgAlignment: ['SDG6']
    }
]

export function usePrograms() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setPrograms(mockPrograms)
            setLoading(false)
        }, 600)
    }, [])
    return { programs, loading }
}
