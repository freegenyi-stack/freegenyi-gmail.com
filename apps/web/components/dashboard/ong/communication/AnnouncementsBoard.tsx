
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Megaphone } from 'lucide-react'

export function AnnouncementsBoard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-lg">Annonces</CardTitle>
                <Button variant="outline" size="sm">Nouvelle annonce</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="border-l-4 border-primary pl-3">
                    <p className="text-sm font-medium">Rapport annuel disponible</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                </div>
                <div className="border-l-4 border-secondary pl-3">
                    <p className="text-sm font-medium">Collecte de fonds dimanche</p>
                    <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
                </div>
            </CardContent>
        </Card>
    )
}
