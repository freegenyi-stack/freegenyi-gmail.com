export type UserRole = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION';

export interface DashboardUser {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    image?: string;
}

export interface StudentProgress {
    subject: string;
    score: number;
    date: string;
}

export interface Student {
    id: string;
    name: string;
    level: string;
    avatar?: string;
    progress: StudentProgress[];
}
