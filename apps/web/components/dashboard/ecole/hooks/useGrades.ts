// apps/web/components/dashboard/ecole/hooks/useGrades.ts
import { useEffect, useState } from 'react'
import type { Grade } from '../types'

const mockGrades: Grade[] = [
    { id: 'g1', studentId: 's1', subject: 'maths', score: 85, maxScore: 100, date: new Date('2026-03-10') },
    { id: 'g2', studentId: 's1', subject: 'francais', score: 78, maxScore: 100, date: new Date('2026-03-12') },
    { id: 'g3', studentId: 's2', subject: 'maths', score: 92, maxScore: 100, date: new Date('2026-03-10') },
    { id: 'g4', studentId: 's2', subject: 'francais', score: 88, maxScore: 100, date: new Date('2026-03-12') },
]

export function useGrades() {
    const [grades, setGrades] = useState<Grade[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setGrades(mockGrades)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])
    return { grades, loading }
}
