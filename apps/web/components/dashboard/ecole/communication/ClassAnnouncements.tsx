// apps/web/components/dashboard/ecole/communication/ClassAnnouncements.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Megaphone, Plus, Calendar, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ClassAnnouncements() {
    const mockAnnouncements = [
        { id: 1, title: 'Sortie scolaire au musée', date: 'Mercredi 25 mars', content: 'Prévoir un pique-nique et des chaussures de marche.', type: 'info' },
        { id: 2, title: 'Réunion parents-profs', date: 'Lundi 20 mars', content: 'Veuillez vous inscrire sur les créneaux horaires disponibles.', type: 'urgent' },
    ]

    return (
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Megaphone className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-heading text-xl">Annonces de classe</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl border-dashed">
                    <Plus className="h-4 w-4 mr-1" /> Publier
                </Button>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {mockAnnouncements.map(ann => (
                        <div key={ann.id} className="relative group p-4 rounded-2xl bg-accent/30 hover:bg-accent/50 transition-all border-l-4 border-primary">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{ann.title}</h4>
                                <Badge className={ann.type === 'urgent' ? 'bg-red-100 text-red-600 border-none' : 'bg-blue-100 text-blue-600 border-none'}>
                                    {ann.type === 'urgent' ? 'Urgent' : 'Info'}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{ann.content}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                <Calendar className="h-3 w-3" /> {ann.date}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
