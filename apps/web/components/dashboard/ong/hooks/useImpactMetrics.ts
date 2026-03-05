"use client"

import { useEffect, useState } from 'react'

interface ImpactSummary {
    totalBeneficiaries: number
    totalPrograms: number
    totalDonations: number
    totalVolunteerHours: number
    programsCompleted: number
    avgDonationSize: number
    donorRetentionRate: number
}

const mockImpact: ImpactSummary = {
    totalBeneficiaries: 1247,
    totalPrograms: 2,
    totalDonations: 195500,
    totalVolunteerHours: 77,
    programsCompleted: 0,
    avgDonationSize: 65167,
    donorRetentionRate: 67
}

export function useImpactMetrics() {
    const [metrics, setMetrics] = useState<ImpactSummary | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setMetrics(mockImpact)
            setLoading(false)
        }, 500)
    }, [])
    return { metrics, loading }
}
