
export type Organization = {
    id: string
    name: string
    legalName: string
    registrationNumber: string
    taxId: string
    address: string
    website: string
    mission: string
    vision: string
    fiscalYearStart: string // MM-DD
    logo?: string
}

export type Program = {
    id: string
    name: string
    description: string
    startDate: Date
    endDate?: Date
    status: 'active' | 'completed' | 'planned' | 'suspended'
    budget: number
    budgetCurrency: string
    actualSpent: number
    objectives: Objective[]
    scope: 'local' | 'regional' | 'national' | 'international'
    managerId: string
    location: string[]
    sdgAlignment: string[] // Objectifs de Développement Durable
}

export type Objective = {
    id: string
    programId: string
    description: string
    startDate: Date
    endDate?: Date
    targetValue: number
    currentValue: number
    unit: string
    status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
}

export type OutcomeIndicator = {
    id: string
    programId: string
    name: string
    description: string
    baselineValue: number
    baselineYear: number
    targetValue: number
    targetYear: number
    currentValue: number
    measurementUnit: string
    dataSource: string
    collectionFrequency: 'monthly' | 'quarterly' | 'annual'
}

export type Beneficiary = {
    id: string
    firstName: string
    lastName: string
    birthDate?: Date
    gender: 'male' | 'female' | 'other' | 'not_specified'
    contactInfo?: {
        email?: string
        phone?: string
        address?: string
    }
    registrationDate: Date
    programs: string[] // programIds
    demographics: {
        ageGroup?: string
        incomeLevel?: string
        educationLevel?: string
        employmentStatus?: string
        disability?: boolean
    }
    status: 'active' | 'inactive' | 'graduated'
    consentGiven: boolean
}

export type Donor = {
    id: string
    type: 'individual' | 'corporate' | 'foundation' | 'government'
    name: string
    contactPerson?: string
    email: string
    phone?: string
    address?: string
    website?: string
    taxReceiptEligible: boolean
    communicationPreferences: {
        email: boolean
        newsletter: boolean
        annualReport: boolean
    }
    firstDonationDate?: Date
    totalDonations: number
    lastDonationDate?: Date
    donorSegment: 'major' | 'recurring' | 'occasional' | 'lapsed' | 'prospect'
    tags: string[]
}

export type Donation = {
    id: string
    donorId: string
    amount: number
    currency: string
    date: Date
    paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'check' | 'crypto'
    designationCredit?: {
        programId?: string
        objectiveId?: string
        amount: number
    }[]
    recurring: boolean
    recurringFrequency?: 'monthly' | 'quarterly' | 'annual'
    taxReceiptIssued: boolean
    notes?: string
}

export type Grant = {
    id: string
    donorId: string
    name: string
    description: string
    amount: number
    currency: string
    startDate: Date
    endDate: Date
    reportingDates: Date[]
    restrictions: string
    matchingRequirement?: number
    amountReceived: number
    amountUsed: number
    programIds: string[]
    status: 'applied' | 'approved' | 'active' | 'completed' | 'rejected'
    attachments: string[]
}

export type Volunteer = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    skills: string[]
    availability: {
        weekdays?: boolean
        weekends?: boolean
        evenings?: boolean
        hoursPerWeek: number
    }
    programsAssigned: string[]
    totalHours: number
    lastActivity?: Date
    status: 'active' | 'inactive' | 'pending'
    emergencyContact?: string
}

export type Expense = {
    id: string
    programId?: string
    grantId?: string
    amount: number
    currency: string
    date: Date
    category: 'personnel' | 'operations' | 'program_activities' | 'equipment' | 'travel' | 'admin'
    description: string
    vendor?: string
    receipt?: string
    approvedBy?: string
    approvalDate?: Date
    status: 'pending' | 'approved' | 'rejected'
}

export type Stakeholder = {
    id: string
    type: 'board' | 'staff' | 'partner' | 'government' | 'community'
    name: string
    role?: string
    organization?: string
    email: string
    phone?: string
    communicationLog: {
        date: Date
        type: 'email' | 'call' | 'meeting'
        summary: string
    }[]
}
