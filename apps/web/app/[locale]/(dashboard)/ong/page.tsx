
'use client'

import { ImpactStatsGrid } from '@/components/dashboard/ong/overview/ImpactStatsGrid'
import { RevenueVsBudgetChart } from '@/components/dashboard/ong/overview/RevenueVsBudgetChart'
import { BeneficiariesOverTime } from '@/components/dashboard/ong/overview/BeneficiariesOverTime'
import { TopProgramsCards } from '@/components/dashboard/ong/overview/TopProgramsCards'
import { RecentDonationsFeed } from '@/components/dashboard/ong/overview/RecentDonationsFeed'

// Mock data (since hooks are separate, we can use them or mock here for the dashboard view which aggregates)
const mockStats = {
    totalBeneficiaries: 1247,
    totalDonations: 195500,
    totalVolunteerHours: 77,
    programsActive: 2
}

const mockBudgetData = [
    { program: 'Éducation', budget: 250000, revenue: 150000 },
    { program: 'Eau', budget: 500000, revenue: 25000 }
]

const mockBeneficiariesData = [
    { month: 'Jan', count: 850 },
    { month: 'Fév', count: 920 },
    { month: 'Mar', count: 1050 },
]

const mockPrograms = [
    { name: 'Éducation pour tous', budgetUtilization: 35, beneficiaries: 847 },
    { name: 'Eau potable', budgetUtilization: 42, beneficiaries: 400 },
]

const mockDonations = [
    { donorName: 'Fondation Bienveillance', amount: 50000, date: new Date('2025-03-10'), program: 'Éducation' },
    { donorName: 'Entreprise Solidaire SA', amount: 5000, date: new Date('2025-02-28'), program: 'Eau' },
]

export default function OngDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="font-heading text-3xl font-bold">Tableau de bord ONG</h1>
            <ImpactStatsGrid stats={mockStats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="font-heading text-xl">Budget vs Revenus</h2>
                    <RevenueVsBudgetChart data={mockBudgetData} />
                </div>
                <div className="space-y-4">
                    <h2 className="font-heading text-xl">Évolution des bénéficiaires</h2>
                    <BeneficiariesOverTime data={mockBeneficiariesData} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="font-heading text-xl mb-4">Programmes principaux</h2>
                    <TopProgramsCards programs={mockPrograms} />
                </div>
                <div>
                    <RecentDonationsFeed donations={mockDonations} />
                </div>
            </div>
        </div>
    )
}
