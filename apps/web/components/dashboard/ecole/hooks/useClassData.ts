// apps/web/components/dashboard/ecole/hooks/useClassData.ts
import { useEffect, useState } from 'react'
import type { Class } from '../types'

const mockClass: Class = {
    id: 'cl1',
    name: 'CM1',
    level: 'CM1',
    academicYear: '2025-2026',
    mainTeacherId: 't1',
    studentCount: 24
}

export function useClassData(classId?: string) {
    const [data, setData] = useState<Class | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockClass)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])
    return { data, loading }
}
