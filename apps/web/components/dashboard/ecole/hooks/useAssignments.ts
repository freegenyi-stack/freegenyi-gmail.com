// apps/web/components/dashboard/ecole/hooks/useAssignments.ts
import { useEffect, useState } from 'react'
import type { Assignment, Submission } from '../types'

const mockAssignments: Assignment[] = [
    { id: 'a1', title: 'Fractions simples', description: 'Exercices sur les fractions', subject: 'maths', dueDate: new Date('2026-03-20'), maxScore: 100, createdAt: new Date() },
    { id: 'a2', title: 'Dictée de mots', description: 'Liste de mots à apprendre', subject: 'francais', dueDate: new Date('2026-03-22'), maxScore: 50, createdAt: new Date() },
]

const mockSubmissions: Submission[] = [
    { id: 'sub1', assignmentId: 'a1', studentId: 's1', submittedAt: new Date('2026-03-19'), content: 'Fichier PDF', status: 'submitted' },
    { id: 'sub2', assignmentId: 'a1', studentId: 's2', submittedAt: new Date('2026-03-18'), content: 'Photo', status: 'graded', score: 85, feedback: 'Très bien' },
]

export function useAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setAssignments(mockAssignments)
            setSubmissions(mockSubmissions)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])
    return { assignments, submissions, loading }
}
