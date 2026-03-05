// apps/web/components/dashboard/ecole/students/StudentList.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { StudentCard } from '@/components/dashboard/ecole/students/StudentCard'
import { AddStudentDialog } from '@/components/dashboard/ecole/students/AddStudentDialog'
import { useStudents } from '@/components/dashboard/ecole/hooks/useStudents'
import { Search } from 'lucide-react'

export function StudentList() {
    const { students, loading } = useStudents()
    const [search, setSearch] = useState('')
    const filtered = students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un élève..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 rounded-2xl"
                    />
                </div>
                <AddStudentDialog />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(student => (
                    <StudentCard key={student.id} student={student} />
                ))}
            </div>
        </div>
    )
}
