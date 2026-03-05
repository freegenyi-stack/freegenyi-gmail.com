"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Globe, GraduationCap, BookOpen, Download, Search, ChevronRight } from "lucide-react"

interface Curriculum {
    id: string
    name: string
    country?: string
    region?: string
    level: string
    subjects: string[]
    description?: string
    skillsCount?: number
    official?: boolean
}

const nationalCurricula: Curriculum[] = [
    {
        id: "fr-cp",
        name: "Programme franais",
        country: "France",
        level: "CP (6-7 ans)",
        subjects: ["Franais", "Mathmatiques", "Sciences", "Histoire-Go", "Anglais"],
        description: "Programme officiel de l'ducation nationale franaise pour le cours prparatoire.",
        skillsCount: 124,
        official: true
    },
    {
        id: "fr-ce1",
        name: "Programme franais",
        country: "France",
        level: "CE1 (7-8 ans)",
        subjects: ["Franais", "Mathmatiques", "Sciences", "Histoire-Go", "Anglais"],
        description: "Programme officiel de l'ducation nationale franaise pour le cours lmentaire 1.",
        skillsCount: 156,
        official: true
    },
    {
        id: "qc-1",
        name: "Programme qubcois",
        country: "Canada",
        region: "Qubec",
        level: "1re anne",
        subjects: ["Franais", "Mathmatiques", "Univers social", "Sciences"],
        description: "Programme de formation de l'cole qubcoise - 1re anne du primaire.",
        skillsCount: 98,
        official: true
    },
    {
        id: "be-cp",
        name: "Programme belge",
        country: "Belgique",
        level: "1re primaire",
        subjects: ["Franais", "Mathmatiques", "veil", "Langues"],
        description: "Programme de la Fdration Wallonie-Bruxelles.",
        skillsCount: 112
    }
]

const internationalCurricula: Curriculum[] = [
    {
        id: "pisa",
        name: "PISA",
        level: "15 ans",
        subjects: ["Lecture", "Mathmatiques", "Sciences"],
        description: "Programme international pour le suivi des acquis des lves (OCDE).",
        skillsCount: 45
    },
    {
        id: "ib-pyp",
        name: "IB Primary Years",
        level: "3-12 ans",
        subjects: ["Langues", "Mathmatiques", "Sciences", "Sociaux", "Arts", "EPS"],
        description: "International Baccalaureate - Primary Years Programme.",
        skillsCount: 78
    },
    {
        id: "cambridge-1",
        name: "Cambridge Primary",
        level: "5-11 ans",
        subjects: ["English", "Mathematics", "Science"],
        description: "Cambridge Primary curriculum for English, Maths and Science.",
        skillsCount: 92
    },
    {
        id: "common-core",
        name: "Common Core",
        country: "USA",
        level: "Grade 1",
        subjects: ["ELA", "Mathematics"],
        description: "Common Core State Standards Initiative - Grade 1.",
        skillsCount: 67
    }
]

interface CurriculumDetailDialogProps {
    curriculum: Curriculum
    onAlign?: (id: string) => void
}

function CurriculumDetailDialog({ curriculum, onAlign }: CurriculumDetailDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Voir dtails
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="font-heading text-xl flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {curriculum.name}
                        {curriculum.official && (
                            <Badge variant="success" className="ml-2">Officiel</Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {curriculum.country && `${curriculum.country} \u2022 `}{curriculum.level}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm">{curriculum.description}</p>
                    <div>
                        <h4 className="text-sm font-medium mb-2">Matires incluses</h4>
                        <div className="flex flex-wrap gap-2">
                            {curriculum.subjects.map((subject) => (
                                <Badge key={subject} variant="secondary">{subject}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Comptences rfrences</span>
                        <span className="font-semibold">{curriculum.skillsCount}</span>
                    </div>
                    <Progress value={65} className="h-2" indicatorClassName="bg-gradient-premium" />
                    <p className="text-xs text-muted-foreground">
                        Votre enfant matrise 65% des comptences de ce programme.
                    </p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Fermer
                    </Button>
                    <Button
                        variant="premium"
                        onClick={() => {
                            onAlign?.(curriculum.id)
                            setOpen(false)
                        }}
                    >
                        Aligner les activits
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function CurriculumHub() {
    const [activeTab, setActiveTab] = useState<"national" | "international">("national")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState<string>("all")

    const filterCurricula = (list: Curriculum[]) => {
        return list.filter(cur => {
            const matchesSearch = cur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cur.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cur.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesCountry = selectedCountry === "all" || cur.country === selectedCountry
            return matchesSearch && matchesCountry
        })
    }

    const countries = Array.from(new Set(nationalCurricula.map(c => c.country).filter(Boolean))) as string[]

    const filteredNational = filterCurricula(nationalCurricula)
    const filteredInternational = filterCurricula(internationalCurricula)

    const handleAlign = (curriculumId: string) => {
        console.log("Aligner sur le programme:", curriculumId)
        // Ici tu peux rediriger vers une page de recommandations ou ouvrir un modal
    }

    return (
        <Card className="w-full shadow-lg border-primary/10">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-heading text-2xl flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Programmes scolaires
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Aligne les activits sur les rfrentiels officiels, nationaux ou internationaux.
                        </CardDescription>
                    </div>
                    <Button variant="premium" size="sm" className="hidden sm:flex">
                        Comparer les programmes
                    </Button>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un programme, une matire..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {activeTab === "national" && (
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="all">Tous les pays</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="national" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            National
                        </TabsTrigger>
                        <TabsTrigger value="international" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            International
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="national" className="mt-0">
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-3">
                                {filteredNational.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Aucun programme national trouv.
                                    </p>
                                ) : (
                                    filteredNational.map((cur) => (
                                        <div
                                            key={cur.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:bg-accent/10 transition group"
                                        >
                                            <div className="space-y-1 mb-2 sm:mb-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-base">{cur.name}</span>
                                                    {cur.official && (
                                                        <Badge variant="success" className="text-[10px] h-5">Officiel</Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{cur.country}{cur.region && ` (${cur.region})`}</span>
                                                    <span>\u2022</span>
                                                    <span>{cur.level}</span>
                                                    <span>\u2022</span>
                                                    <span>{cur.subjects.length} matires</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {cur.subjects.slice(0, 3).map((s) => (
                                                        <Badge key={s} variant="outline" className="text-[10px]">
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                    {cur.subjects.length > 3 && (
                                                        <Badge variant="outline" className="text-[10px]">
                                                            +{cur.subjects.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                <CurriculumDetailDialog curriculum={cur} onAlign={handleAlign} />
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 group-hover:bg-primary/10"
                                                    onClick={() => handleAlign(cur.id)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="international" className="mt-0">
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-3">
                                {filteredInternational.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Aucun programme international trouv.
                                    </p>
                                ) : (
                                    filteredInternational.map((cur) => (
                                        <div
                                            key={cur.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:bg-accent/10 transition group"
                                        >
                                            <div className="space-y-1 mb-2 sm:mb-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-base">{cur.name}</span>
                                                    {cur.country && (
                                                        <Badge variant="secondary" className="text-[10px] h-5">{cur.country}</Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{cur.level}</span>
                                                    <span>\u2022</span>
                                                    <span>{cur.subjects.length} domaines</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {cur.subjects.slice(0, 3).map((s) => (
                                                        <Badge key={s} variant="outline" className="text-[10px]">
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                    {cur.subjects.length > 3 && (
                                                        <Badge variant="outline" className="text-[10px]">
                                                            +{cur.subjects.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                <CurriculumDetailDialog curriculum={cur} onAlign={handleAlign} />
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 group-hover:bg-primary/10"
                                                    onClick={() => handleAlign(cur.id)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end sm:hidden">
                    <Button variant="premium" className="w-full">
                        Comparer les programmes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
