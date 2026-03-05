// apps/web/components/dashboard/ecole/students/StudentCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Calendar } from 'lucide-react'
import type { Student } from '../types'

export function StudentCard({ student }: { student: Student }) {
    const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    return (
        <Card className="hover:shadow-md transition-all duration-200 group overflow-hidden border-none bg-accent/30">
            <CardContent className="p-4 flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="font-heading font-bold text-base truncate group-hover:text-primary transition-colors">
                            {student.firstName} {student.lastName}
                        </p>
                        <Badge
                            variant={student.status === 'active' ? 'default' : 'secondary'}
                            className={`rounded-full px-2 py-0 text-[10px] uppercase tracking-wider ${student.status === 'active' ? 'bg-primary/20 text-primary' : ''}`}
                        >
                            {student.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                        <Mail className="h-3 w-3 flex-shrink-0" /> {student.parentEmail}
                    </p>
                    {student.parentPhone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" /> {student.parentPhone}
                        </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 flex items-center gap-2 pt-1 border-t border-muted-foreground/10 mt-2">
                        <Calendar className="h-3 w-3" /> Inscrit le {new Date(student.enrollmentDate).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
