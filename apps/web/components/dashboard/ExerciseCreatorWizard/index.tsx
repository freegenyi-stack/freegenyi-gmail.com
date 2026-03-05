"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react"
import { useExerciseBuilder } from "./hooks/useExerciseBuilder"
import { Step1Basics } from "./Step1Basics"
import { Step2Content } from "./Step2Content"
import { Step3Preview } from "./Step3Preview"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ExerciseCreatorWizardProps {
    initialData?: any
    onSave?: (data: any) => void
    onCancel?: () => void
}

export function ExerciseCreatorWizard({
    initialData,
    onSave,
    onCancel
}: ExerciseCreatorWizardProps) {
    const { data, updateData, currentStep, setCurrentStep } = useExerciseBuilder(initialData)
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const nextStep = () => setCurrentStep(s => Math.min(s + 1, 3))
    const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Simule un appel API
            await new Promise(resolve => setTimeout(resolve, 1000))
            onSave?.(data)
            // Redirection vers la liste des exercices
            router.push("/dashboard/exercices")
        } catch (error) {
            console.error("Erreur sauvegarde:", error)
        } finally {
            setIsSaving(false)
        }
    }

    // Validation du formulaire
    const isStep1Valid = () => {
        return data.title?.trim() !== "" && data.type && data.subject
    }

    const isStep2Valid = () => {
        // Validation minimale : le contenu doit exister
        return data.content && Object.keys(data.content).length > 0
    }

    const canProceed = () => {
        if (currentStep === 1) return isStep1Valid()
        if (currentStep === 2) return isStep2Valid()
        return true
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/10">
            <CardHeader className="border-b">
                <CardTitle className="font-heading text-2xl flex items-center gap-2">
                    <span className="text-primary">\u2728</span>
                    Crer un exercice personnalis
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
                <Tabs value={`step-${currentStep}`} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger
                            value="step-1"
                            disabled={currentStep < 1}
                            className="data-[state=active]:border-primary"
                        >
                            1. Informations
                        </TabsTrigger>
                        <TabsTrigger
                            value="step-2"
                            disabled={currentStep < 2}
                            className="data-[state=active]:border-primary"
                        >
                            2. Contenu
                        </TabsTrigger>
                        <TabsTrigger
                            value="step-3"
                            disabled={currentStep < 3}
                            className="data-[state=active]:border-primary"
                        >
                            3. Aperu & envoi
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="step-1" className="mt-0">
                        <Step1Basics data={data} updateData={updateData} />
                    </TabsContent>

                    <TabsContent value="step-2" className="mt-0">
                        <Step2Content data={data} updateData={updateData} />
                    </TabsContent>

                    <TabsContent value="step-3" className="mt-0">
                        <Step3Preview data={data} onEdit={setCurrentStep} />
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
                <div>
                    {currentStep > 1 ? (
                        <Button variant="outline" onClick={prevStep} disabled={isSaving}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Prcdent
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={onCancel || (() => router.back())} disabled={isSaving}>
                            <X className="h-4 w-4 mr-1" /> Annuler
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    {currentStep < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={!canProceed() || isSaving}
                            className="bg-gradient-premium hover:opacity-90"
                        >
                            Suivant <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-gradient-premium hover:opacity-90"
                        >
                            {isSaving ? (
                                <>Sauvegarde...</>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-1" /> Publier l'exercice
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
