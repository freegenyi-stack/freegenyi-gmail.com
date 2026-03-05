// apps/web/components/dashboard/ecole/settings/ClassSettings.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Save, Info } from 'lucide-react'

export function ClassSettings() {
    return (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
            <CardHeader className="bg-primary/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <SettingsIcon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-heading text-2xl font-bold">Paramètres de la classe</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-bold ml-1">Nom de la classe</Label>
                        <Input id="className" defaultValue="CM1" className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="level" className="text-sm font-bold ml-1">Niveau</Label>
                        <Input id="level" defaultValue="CM1" className="rounded-xl h-12" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-bold ml-1">Année scolaire</Label>
                    <Input id="year" defaultValue="2025-2026" className="rounded-xl h-12" />
                </div>

                <div className="p-4 bg-accent/30 rounded-2xl flex gap-3 items-start">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Ces informations sont utilisées pour générer les bulletins et configurer l'accès des parents au portail de la classe.
                    </p>
                </div>

                <Button variant="premium" className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20">
                    <Save className="h-5 w-5 mr-2" /> Enregistrer les modifications
                </Button>
            </CardContent>
        </Card>
    )
}
