"use client"

import { useEffect, useState } from 'react'
import type { Beneficiary } from '../types'

const mockBeneficiaries: Beneficiary[] = [
    { id: 'b1', firstName: 'Aminata', lastName: 'Diallo', birthDate: new Date('2010-03-12'), gender: 'female', registrationDate: new Date('2025-01-15'), programs: ['p1'], demographics: { ageGroup: '10-14', educationLevel: 'primary' }, status: 'active', consentGiven: true },
    { id: 'b2', firstName: 'Mamadou', lastName: 'Touré', birthDate: new Date('2008-07-22'), gender: 'male', registrationDate: new Date('2025-01-15'), programs: ['p1'], demographics: { ageGroup: '15-19', educationLevel: 'secondary' }, status: 'active', consentGiven: true },
    { id: 'b3', firstName: 'Fatoumata', lastName: 'Koné', birthDate: new Date('2012-11-05'), gender: 'female', registrationDate: new Date('2025-02-01'), programs: ['p1'], demographics: { ageGroup: '10-14', educationLevel: 'primary' }, status: 'active', consentGiven: true },
    { id: 'b4', firstName: 'Issa', lastName: 'Traoré', birthDate: new Date('2009-09-18'), gender: 'male', registrationDate: new Date('2025-02-01'), programs: ['p1'], demographics: { ageGroup: '15-19', educationLevel: 'secondary' }, status: 'inactive', consentGiven: true }
]

export function useBeneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setBeneficiaries(mockBeneficiaries)
            setLoading(false)
        }, 600)
    }, [])
    return { beneficiaries, loading }
}
