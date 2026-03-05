// apps/web/components/dashboard/ecole/hooks/useAttendance.ts
import { useEffect, useState } from 'react'
import type { Attendance } from '../types'

const mockAttendance: Attendance[] = [
    { id: 'at1', studentId: 's1', date: new Date('2026-03-17'), status: 'present' },
    { id: 'at2', studentId: 's2', date: new Date('2026-03-17'), status: 'present' },
    { id: 'at3', studentId: 's3', date: new Date('2026-03-17'), status: 'absent', reason: 'Malade' },
]

export function useAttendance() {
    const [attendance, setAttendance] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setAttendance(mockAttendance)
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])
    return { attendance, loading }
}
