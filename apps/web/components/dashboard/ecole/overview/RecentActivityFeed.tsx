// apps/web/components/dashboard/ecole/overview/RecentActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Activity {
    id: string
    type: 'submission' | 'grade' | 'attendance' | 'announcement'
    title: string
    description?: string
    timestamp: Date
    studentName?: string
}

export function RecentActivityFeed({ activities }: { activities: Activity[] }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-heading text-lg">Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-4">
                        {activities.map((act) => (
                            <div key={act.id} className="flex items-start gap-3 group">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarFallback className="bg-primary/5 text-primary text-lg">
                                        {act.type === 'submission' ? '📝' : act.type === 'grade' ? '📊' : act.type === 'attendance' ? '👤' : '📢'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{act.title}</p>
                                    {act.description && <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>}
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1">
                                        {formatDistanceToNow(act.timestamp, { addSuffix: true, locale: fr })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
