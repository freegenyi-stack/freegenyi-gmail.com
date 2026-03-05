// apps/web/components/dashboard/ecole/types.ts

export type Student = {
    id: string
    firstName: string
    lastName: string
    birthDate: Date
    parentEmail: string
    parentPhone?: string
    address?: string
    enrollmentDate: Date
    status: 'active' | 'inactive'
    photo?: string
}

export type Assignment = {
    id: string
    title: string
    description: string
    subject: string
    dueDate: Date
    maxScore: number
    attachments?: string[]
    createdAt: Date
}

export type Submission = {
    id: string
    assignmentId: string
    studentId: string
    submittedAt: Date
    content?: string
    attachments?: string[]
    score?: number
    feedback?: string
    status: 'submitted' | 'graded' | 'late'
}

export type Grade = {
    id: string
    studentId: string
    assignmentId?: string
    subject: string
    score: number
    maxScore: number
    date: Date
    comment?: string
}

export type Attendance = {
    id: string
    studentId: string
    date: Date
    status: 'present' | 'absent' | 'late' | 'excused'
    reason?: string
}

export type Class = {
    id: string
    name: string
    level: string
    academicYear: string
    mainTeacherId: string
    studentCount: number
}

export type Announcement = {
    id: string
    title: string
    content: string
    date: Date
    target: 'class' | 'parents'
    attachments?: string[]
}
