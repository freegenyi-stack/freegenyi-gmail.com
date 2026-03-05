"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ShieldX } from "lucide-react"

export function AccountDeletion({ onConfirm }: { onConfirm: (password: string) => void }) {
    const [password, setPassword] = useState("")

    return (
        <Card className="border-destructive/20 shadow-md">
            <CardHeader>
                <div className="flex items-center gap-2 text-destructive mb-1">
                    <ShieldX className="h-5 w-5" />
                    <CardTitle className="text-xl font-heading">Zone de danger</CardTitle>
                </div>
                <CardDescription>
                    La suppression de votre compte est irréversible. Toutes les données de vos enfants seront perdues.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/10 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive-foreground leading-relaxed">
                        Pour confirmer, veuillez saisir votre mot de passe.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="delete-pwd">Mot de passe</Label>
                    <Input
                        id="delete-pwd"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Saisissez votre mot de passe"
                    />
                </div>
                <Button
                    variant="destructive"
                    className="w-full h-11 font-bold"
                    disabled={!password}
                    onClick={() => onConfirm(password)}
                >
                    Supprimer définitivement mon compte
                </Button>
            </CardContent>
        </Card>
    )
}
