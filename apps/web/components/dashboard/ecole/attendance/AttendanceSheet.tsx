// apps/web/components/dashboard/ecole/attendance/AttendanceSheet.tsx
'use client'

import { useState } from 'react'
import { useStudents } from '@/components/dashboard/ecole/hooks/useStudents'
import { useAttendance } from '@/components/dashboard/ecole/hooks/useAttendance'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar as CalendarIcon, Save, Check, X, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AttendanceSheet() {
    const { students } = useStudents()
    const { attendance } = useAttendance()
    const [date, setDate] = useState(new Date())
    const activeStudents = students.filter(s => s.status === 'active')

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="font-heading text-2xl font-bold flex items-center gap-3">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                        Appel du {format(date, 'EEEE d MMMM', { locale: fr })}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">Cochez les absences et retards de vos élèves.</p>
                </div>
                <Button variant="premium" size="lg" className="rounded-2xl shadow-lg shadow-primary/20 h-12 px-8">
                    <Save className="h-4 w-4 mr-2" /> Enregistrer l'appel
                </Button>
            </div>

            <div className="border-none shadow-xl rounded-3xl overflow-hidden bg-background">
                <Table>
                    <TableHeader className="bg-accent/50">
                        <TableRow className="hover:bg-transparent border-b border-muted">
                            <TableHead className="font-heading font-bold text-sm h-14">Élève</TableHead>
                            <TableHead className="w-[100px] text-center font-heading font-bold h-14">Présent</TableHead>
                            <TableHead className="w-[100px] text-center font-heading font-bold h-14">Retard</TableHead>
                            <TableHead className="w-[100px] text-center font-heading font-bold h-14">Absent</TableHead>
                            <TableHead className="min-w-[150px] font-heading font-bold h-14">Action / Note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeStudents.map(student => (
                            <TableRow key={student.id} className="hover:bg-accent/20 transition-colors border-b border-muted/50">
                                <TableCell className="font-bold py-4">
                                    <div className="flex flex-col">
                                        <span>{student.firstName} {student.lastName}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Code: {student.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-100">
                                        <Check className="h-4 w-4" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox className="h-6 w-6 rounded-lg border-2 border-yellow-200 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox className="h-6 w-6 rounded-lg border-2 border-red-200 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" className="text-xs font-bold rounded-lg text-muted-foreground hover:text-primary">
                                        <Badge variant="outline" className="text-[10px] bg-background">Justifier</Badge>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
