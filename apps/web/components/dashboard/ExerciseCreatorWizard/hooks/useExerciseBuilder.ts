"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export interface ExerciseData {
    id: string
    title: string
    instruction: string
    subject: string
    difficulty: "easy" | "medium" | "hard"
    type: string
    content: any
    createdAt: Date
    updatedAt: Date
}

export function useExerciseBuilder(initialData?: Partial<ExerciseData>) {
    const [data, setData] = useState<Partial<ExerciseData>>({
        id: uuidv4(),
        title: "",
        instruction: "",
        subject: "",
        difficulty: "medium",
        type: "qcm",
        content: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        ...initialData
    })

    const [currentStep, setCurrentStep] = useState(1)

    const updateData = (newData: Partial<ExerciseData>) => {
        setData(prev => ({
            ...prev,
            ...newData,
            updatedAt: new Date()
        }))
    }

    const reset = () => {
        setData({
            id: uuidv4(),
            title: "",
            instruction: "",
            subject: "",
            difficulty: "medium",
            type: "qcm",
            content: {},
            createdAt: new Date(),
            updatedAt: new Date()
        })
        setCurrentStep(1)
    }

    // Sauvegarde auto dans localStorage
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (data.id) {
                localStorage.setItem(`exercise-draft-${data.id}`, JSON.stringify(data))
            }
        }, 1000)
        return () => clearTimeout(timeout)
    }, [data])

    return {
        data,
        updateData,
        currentStep,
        setCurrentStep,
        reset
    }
}
