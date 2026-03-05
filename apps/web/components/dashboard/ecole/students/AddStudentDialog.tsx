// apps/web/components/dashboard/ecole/students/AddStudentDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

export function AddStudentDialog() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Ici logique d'ajout
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" className="rounded-2xl">
                    <UserPlus className="h-4 w-4 mr-2" /> Ajouter un élève
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">Nouvel élève</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstname" className="text-sm font-semibold">Prénom</Label>
                            <Input id="firstname" className="rounded-xl" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname" className="text-sm font-semibold">Nom</Label>
                            <Input id="lastname" className="rounded-xl" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email du parent</Label>
                        <Input id="email" type="email" className="rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">Téléphone (optionnel)</Label>
                        <Input id="phone" type="tel" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthdate" className="text-sm font-semibold">Date de naissance</Label>
                        <Input id="birthdate" type="date" className="rounded-xl" required />
                    </div>
                    <Button type="submit" variant="premium" className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20">
                        Créer le profil
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
