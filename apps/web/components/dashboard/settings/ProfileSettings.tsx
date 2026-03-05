"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
    id: string
    name: string
    email?: string
    avatar?: string
    role: "parent" | "child"
    age?: number
    level?: string
    schoolLevel?: string
}

interface ProfileSettingsProps {
    parentProfile: Profile
    childrenProfiles: Profile[]
    onUpdateParent: (data: Partial<Profile>) => void
    onUpdateChild: (childId: string, data: Partial<Profile>) => void
    onAddChild: () => void
    className?: string
}

export function ProfileSettings({
    parentProfile,
    childrenProfiles,
    onUpdateParent,
    onUpdateChild,
    onAddChild,
    className
}: ProfileSettingsProps) {
    const [activeTab, setActiveTab] = useState("parent")

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Paramètres du profil
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="parent">Profil parent</TabsTrigger>
                        <TabsTrigger value="children">Enfants</TabsTrigger>
                    </TabsList>

                    <TabsContent value="parent" className="mt-4 space-y-4">
                        <ParentProfileForm profile={parentProfile} onUpdate={onUpdateParent} />
                    </TabsContent>

                    <TabsContent value="children" className="mt-4 space-y-6">
                        {childrenProfiles.map((child) => (
                            <ChildProfileForm
                                key={child.id}
                                profile={child}
                                onUpdate={(data) => onUpdateChild(child.id, data)}
                            />
                        ))}
                        <Button variant="outline" className="w-full" onClick={onAddChild}>
                            + Ajouter un enfant
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function ParentProfileForm({ profile, onUpdate }: { profile: Profile; onUpdate: (data: Partial<Profile>) => void }) {
    const [form, setForm] = useState({
        name: profile.name,
        email: profile.email || ""
    })

    const handleSave = () => {
        onUpdate(form)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-gradient-premium text-white text-xl">
                        {profile.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer photo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="parent-name">Nom complet</Label>
                    <Input
                        id="parent-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="parent-email">Email</Label>
                    <Input
                        id="parent-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>
            </div>

            <Button variant="premium" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
            </Button>
        </div>
    )
}

function ChildProfileForm({ profile, onUpdate }: { profile: Profile; onUpdate: (data: Partial<Profile>) => void }) {
    const [form, setForm] = useState({
        name: profile.name,
        age: profile.age || 6,
        level: profile.level || "",
        schoolLevel: profile.schoolLevel || ""
    })

    const handleSave = () => {
        onUpdate(form)
    }

    return (
        <div className="border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-accent text-primary text-lg">
                        {profile.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-heading font-semibold">{profile.name}</h3>
                    <p className="text-xs text-muted-foreground">Modifier les informations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                    <Label htmlFor={`child-name-${profile.id}`}>Prénom</Label>
                    <Input
                        id={`child-name-${profile.id}`}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`child-age-${profile.id}`}>Âge</Label>
                    <Input
                        id={`child-age-${profile.id}`}
                        type="number"
                        min={3}
                        max={18}
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 6 })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`child-level-${profile.id}`}>Niveau</Label>
                    <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                        <SelectTrigger id={`child-level-${profile.id}`}>
                            <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="debutant">Débutant</SelectItem>
                            <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                            <SelectItem value="confirme">Confirmé</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`child-school-${profile.id}`}>Niveau scolaire</Label>
                <Select value={form.schoolLevel} onValueChange={(v) => setForm({ ...form, schoolLevel: v })}>
                    <SelectTrigger id={`child-school-${profile.id}`}>
                        <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cp">CP (6-7 ans)</SelectItem>
                        <SelectItem value="ce1">CE1 (7-8 ans)</SelectItem>
                        <SelectItem value="ce2">CE2 (8-9 ans)</SelectItem>
                        <SelectItem value="cm1">CM1 (9-10 ans)</SelectItem>
                        <SelectItem value="cm2">CM2 (10-11 ans)</SelectItem>
                        <SelectItem value="6eme">6ème (11-12 ans)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end">
                <Button size="sm" variant="premium" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                </Button>
            </div>
        </div>
    )
}
