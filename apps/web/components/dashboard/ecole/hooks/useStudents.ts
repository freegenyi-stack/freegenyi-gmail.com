// apps/web/components/dashboard/ecole/hooks/useStudents.ts
import { useEffect, useState } from 'react'
import type { Student } from '../types'

const mockStudents: Student[] = [
    { id: 's1', firstName: 'Léo', lastName: 'Martin', birthDate: new Date('2015-03-12'), parentEmail: 'parent.martin@exemple.com', enrollmentDate: new Date('2024-09-01'), status: 'active' },
    { id: 's2', firstName: 'Emma', lastName: 'Dubois', birthDate: new Date('2015-07-22'), parentEmail: 'parent.dubois@exemple.com', enrollmentDate: new Date('2024-09-01'), status: 'active' },
    { id: 's3', firstName: 'Noah', lastName: 'Bernard', birthDate: new Date('2015-01-05'), parentEmail: 'parent.bernard@exemple.com', enrollmentDate: new Date('2024-09-01'), status: 'active' },
    { id: 's4', firstName: 'Chloé', lastName: 'Petit', birthDate: new Date('2015-11-18'), parentEmail: 'parent.petit@exemple.com', enrollmentDate: new Date('2024-09-01'), status: 'inactive' },
]

export function useStudents() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStudents(mockStudents)
            setLoading(false)
        }, 600)
        return () => clearTimeout(timer)
    }, [])
    return { students, loading }
}
