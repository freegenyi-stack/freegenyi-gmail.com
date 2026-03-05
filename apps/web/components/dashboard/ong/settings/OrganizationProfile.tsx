
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function OrganizationProfile() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading text-lg">Profil de l'organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nom légal</Label>
                        <Input defaultValue="FreeGeny ONG" />
                    </div>
                    <div className="space-y-2">
                        <Label>Numéro d'enregistrement</Label>
                        <Input defaultValue="W123456789" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Mission</Label>
                    <Textarea defaultValue="Rendre l'éducation accessible à tous" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Site web</Label>
                        <Input defaultValue="https://freegeny.org" />
                    </div>
                    <div className="space-y-2">
                        <Label>Début exercice fiscal</Label>
                        <Input defaultValue="01-01" />
                    </div>
                </div>
                <Button variant="premium">Enregistrer</Button>
            </CardContent>
        </Card>
    )
}
