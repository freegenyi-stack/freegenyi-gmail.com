// apps/web/components/dashboard/charts/types.ts

export type ChartView =
    | "weekly"
    | "subject-time"
    | "skills"
    | "long-progress"
    | "comparison"
    | "activity-types"
    | "global-score"

export interface WeeklyDataPoint {
    day: string          // "Lun", "Mar"...
    minutes: number
    exercises: number
}

export interface SubjectTimeData {
    subject: string
    time: number         // minutes
    fill?: string
}

export interface SkillData {
    subject: string
    value: number        // maîtrise en %
    fullMark?: number
}

export interface LongProgressData {
    week: string         // "S12", "S13"...
    minutes: number
    score?: number
}

export interface ChildComparisonData {
    childName: string
    [subject: string]: number | string
}

export interface ActivityTypeData {
    type: string
    count: number
    week?: string
}

export interface GlobalScoreData {
    current: number
    target: number
    unit: string
}
