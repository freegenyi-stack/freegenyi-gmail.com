import { z } from 'zod';

// Enums
export const UserRoleSchema = z.enum(['PARENT', 'TEACHER', 'NGO', 'ORGANIZATION']);
export const DifficultyLevelSchema = z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']);
export const ExerciseTypeSchema = z.enum(['MATH', 'FRENCH', 'ENGLISH', 'SCIENCE', 'HISTORY', 'GEOGRAPHY']);

// Exercise Generation
export const ExerciseGenerationSchema = z.object({
    subject: ExerciseTypeSchema,
    difficulty: DifficultyLevelSchema,
    level: z.string().min(1, 'Le niveau est requis'),
    numberOfQuestions: z.number().min(1).max(50),
    topics: z.array(z.string()).optional(),
    includeImages: z.boolean().default(false),
    language: z.string().default('fr')
});

// Student Progress
export const ProgressUpdateSchema = z.object({
    studentId: z.string().cuid(),
    subject: z.string(),
    topic: z.string().optional(),
    score: z.number().min(0).max(20),
    maxScore: z.number().default(20),
    exerciseCount: z.number().default(1)
});

// Message
export const MessageSchema = z.object({
    receiverId: z.string().cuid(),
    content: z.string().min(1, 'Le message ne peut pas être vide').max(5000),
    type: z.enum(['TEXT', 'AUDIO', 'VIDEO', 'FILE']).default('TEXT'),
    attachments: z.array(z.object({
        url: z.string().url(),
        name: z.string(),
        size: z.number(),
        type: z.string()
    })).optional()
});

// Calendar Event
export const CalendarEventSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().optional(),
    type: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    allDay: z.boolean().default(false),
    location: z.string().optional(),
    color: z.string().optional()
});

// Class Management
export const ClassSchema = z.object({
    name: z.string().min(1, 'Le nom de la classe est requis'),
    level: z.string().min(1, 'Le niveau est requis'),
    schoolId: z.string().cuid().optional()
});

// Beneficiary (NGO)
export const BeneficiarySchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    type: z.string(),
    region: z.string(),
    status: z.enum(['active', 'inactive', 'pending']).default('active')
});

// Report Generation
export const ReportGenerationSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    type: z.string(),
    format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
    dateRange: z.object({
        start: z.date(),
        end: z.date()
    }),
    includeCharts: z.boolean().default(true),
    metrics: z.array(z.string())
});

// User Management (Admin)
export const UserManagementSchema = z.object({
    email: z.string().email('Email invalide'),
    name: z.string().min(1, 'Le nom est requis'),
    roles: z.array(UserRoleSchema).min(1, 'Au moins un rôle est requis'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').optional()
});

// File Upload
export const FileUploadSchema = z.object({
    file: z.instanceof(File),
    type: z.enum(['image', 'video', 'document', 'audio']),
    maxSize: z.number().default(10 * 1024 * 1024) // 10MB
});

// Notification
export const NotificationSchema = z.object({
    userId: z.string().cuid(),
    type: z.enum(['MESSAGE', 'PROGRESS', 'ACHIEVEMENT', 'SYSTEM', 'REMINDER']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    title: z.string().min(1),
    message: z.string().min(1),
    actionUrl: z.string().url().optional(),
    data: z.any().optional()
});

// Dashboard Filters
export const DashboardFiltersSchema = z.object({
    subject: z.string().optional(),
    difficulty: DifficultyLevelSchema.optional(),
    dateRange: z.object({
        start: z.date(),
        end: z.date()
    }).optional(),
    search: z.string().optional()
});

export type ExerciseGeneration = z.infer<typeof ExerciseGenerationSchema>;
export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;
export type MessageInput = z.infer<typeof MessageSchema>;
export type CalendarEventInput = z.infer<typeof CalendarEventSchema>;
export type ClassInput = z.infer<typeof ClassSchema>;
export type BeneficiaryInput = z.infer<typeof BeneficiarySchema>;
export type ReportGeneration = z.infer<typeof ReportGenerationSchema>;
export type UserManagement = z.infer<typeof UserManagementSchema>;
export type NotificationInput = z.infer<typeof NotificationSchema>;
export type DashboardFilters = z.infer<typeof DashboardFiltersSchema>;
