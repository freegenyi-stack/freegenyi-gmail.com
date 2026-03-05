// apps/web/components/dashboard/charts/views/GlobalScore.tsx
"use client"

import { ProgressRing } from "@/components/ui/ProgressRing"
import type { GlobalScoreData } from "../types"

interface Props {
    data: GlobalScoreData
}

export function GlobalScore({ data }: Props) {
    const percentage = Math.min(100, (data.current / data.target) * 100)

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <ProgressRing progress={percentage} size={180} strokeWidth={12}>
                <div className="text-center">
                    <span className="font-heading text-4xl font-bold text-primary">
                        {data.current.toLocaleString()}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                        / {data.target.toLocaleString()} {data.unit}
                    </span>
                </div>
            </ProgressRing>
            <p className="mt-4 text-sm text-muted-foreground">
                تم تحقيق الهدف بنسبة {Math.round(percentage)}%
            </p>
        </div>
    )
}
