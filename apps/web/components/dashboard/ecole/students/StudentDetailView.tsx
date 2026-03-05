// apps/web/components/dashboard/ecole/students/StudentDetailView.tsx
'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStudents } from '@/components/dashboard/ecole/hooks/useStudents'
import { useGrades } from '@/components/dashboard/ecole/hooks/useGrades'
import { useAttendance } from '@/components/dashboard/ecole/hooks/useAttendance'
import { GradeChart } from '@/components/dashboard/ecole/grades/GradeChart'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Phone, Calendar as CalendarIcon, MapPin } from 'lucide-react'

export function StudentDetailView() {
    const { id } = useParams()
    const { students } = useStudents()
    const { grades } = useGrades()
    const { attendance } = useAttendance()

    const student = students.find(s => s.id === id)
    if (!student) return <div className="p-8 text-center text-muted-foreground">Élève non trouvé</div>

    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    const studentGrades = grades.filter(g => g.studentId === id)
    const studentAttendance = attendance.filter(a => a.studentId === id)

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-none bg-accent/20">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <h2 className="font-heading text-3xl font-bold">{student.firstName} {student.lastName}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {student.parentEmail}</span>
                            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {student.parentPhone || 'Non renseigné'}</span>
                            <span className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {new Date(student.birthDate).toLocaleDateString()}</span>
                            {student.address && <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {student.address}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="grades" className="w-full">
                <TabsList className="bg-accent/30 p-1 h-12 rounded-2xl w-full max-w-md">
                    <TabsTrigger value="grades" className="rounded-xl flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">Notes</TabsTrigger>
                    <TabsTrigger value="attendance" className="rounded-xl flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">Présences</TabsTrigger>
                    <TabsTrigger value="assignments" className="rounded-xl flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">Devoirs</TabsTrigger>
                </TabsList>
                <TabsContent value="grades" className="mt-8">
                    <Card className="border-none bg-background shadow-sm p-6 rounded-3xl">
                        <h3 className="font-heading text-xl font-bold mb-6">Évolution des notes</h3>
                        <GradeChart data={studentGrades} />
                    </Card>
                </TabsContent>
                <TabsContent value="attendance" className="mt-8">
                    <div className="p-8 text-center text-muted-foreground bg-accent/5 rounded-3xl border-2 border-dashed">
                        Tableau des présences à venir
                    </div>
                </TabsContent>
                <TabsContent value="assignments" className="mt-8">
                    <div className="p-8 text-center text-muted-foreground bg-accent/5 rounded-3xl border-2 border-dashed">
                        Liste des devoirs rendus à venir
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
