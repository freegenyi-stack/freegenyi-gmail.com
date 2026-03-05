// apps/web/components/dashboard/ecole/assignments/AssignmentList.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAssignments } from '../hooks/useAssignments'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BookOpen, Calendar, ChevronRight } from 'lucide-react'

export function AssignmentList() {
    const { assignments } = useAssignments()

    return (
        <div className="space-y-4">
            {assignments.map(a => (
                <Card key={a.id} className="hover:shadow-md transition-all duration-200 border-none bg-accent/20 group cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-heading font-bold text-base group-hover:text-primary transition-colors">
                                    {a.title}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                    <Badge variant="outline" className="capitalize text-[10px] h-5 rounded-md bg-background/50 border-none px-2">
                                        {a.subject}
                                    </Badge>
                                    <span className="flex items-center gap-1 italic">
                                        <Calendar className="h-3 w-3" />
                                        À rendre le {format(new Date(a.dueDate), 'dd MMMM', { locale: fr })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Max</p>
                                <p className="font-bold text-primary">{a.maxScore} pts</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </CardContent>
                </Card>
            ))}
            {assignments.length === 0 && (
                <div className="text-center py-12 bg-accent/10 rounded-3xl border-2 border-dashed">
                    <p className="text-muted-foreground">Aucun devoir créé pour le moment.</p>
                </div>
            )}
        </div>
    )
}
