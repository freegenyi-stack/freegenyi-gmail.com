// apps/web/components/dashboard/ecole/grades/Gradebook.tsx
'use client'

import { useStudents } from '@/components/dashboard/ecole/hooks/useStudents'
import { useAssignments } from '@/components/dashboard/ecole/hooks/useAssignments'
import { useGrades } from '@/components/dashboard/ecole/hooks/useGrades'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table'
import { Badge } from '@/components/ui/badge'

export function Gradebook() {
    const { students } = useStudents()
    const { assignments } = useAssignments()
    const { grades } = useGrades()

    const activeStudents = students.filter(s => s.status === 'active')

    return (
        <div className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-accent/50">
                        <TableRow className="hover:bg-transparent border-b border-muted">
                            <TableHead className="font-heading font-bold text-sm h-14">Élève</TableHead>
                            {assignments.map(a => (
                                <TableHead key={a.id} className="min-w-[120px] font-heading font-bold text-sm h-14 text-center">
                                    {a.title}
                                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">/{a.maxScore}</p>
                                </TableHead>
                            ))}
                            <TableHead className="font-heading font-bold text-sm h-14 text-right pr-6">Moyenne</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeStudents.map(student => {
                            const studentGrades = grades.filter(g => g.studentId === student.id)
                            const avg = studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / (studentGrades.length || 1)

                            return (
                                <TableRow key={student.id} className="hover:bg-accent/20 transition-colors border-b border-muted/50">
                                    <TableCell className="font-bold h-14 py-4 truncate max-w-[180px]">
                                        {student.firstName} {student.lastName}
                                    </TableCell>
                                    {assignments.map(a => {
                                        const grade = studentGrades.find(g => g.assignmentId === a.id)
                                        return (
                                            <TableCell key={a.id} className="text-center font-medium">
                                                {grade ? (
                                                    <span className={grade.score / grade.maxScore >= 0.7 ? "text-primary" : "text-destructive"}>
                                                        {grade.score}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/30 italic text-xs">N/A</span>
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                    <TableCell className="text-right pr-6">
                                        <Badge
                                            variant="outline"
                                            className={`font-bold rounded-lg border-none shadow-sm ${avg >= 75 ? "bg-primary/20 text-primary" : avg >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {avg.toFixed(1)}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
