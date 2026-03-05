"use client"

import { exerciseTypes } from "./ExerciseTypeConfig"

interface Step2ContentProps {
    data: any
    updateData: (newData: any) => void
}

export function Step2Content({ data, updateData }: Step2ContentProps) {
    const currentType = exerciseTypes.find(t => t.id === data.type) || exerciseTypes[0]
    const Component = currentType.component

    const handleContentChange = (newContent: any) => {
        updateData({ content: newContent })
    }

    return (
        <div className="space-y-4">
            <div className="mb-2">
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">{currentType.icon}</span>
                    {currentType.label} \u2013 {currentType.description}
                </h3>
            </div>
            <Component
                value={data.content || currentType.defaultData}
                onChange={handleContentChange}
            />
        </div>
    )
}
