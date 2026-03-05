
import { DonorList } from '@/components/dashboard/ong/donors/DonorList'
import { DonorSegmentChart } from '@/components/dashboard/ong/donors/DonorSegmentChart'
import { DonationHistoryChart } from '@/components/dashboard/ong/donors/DonationHistoryChart'

export default function DonorsPage() {
    const mockSegments = [
        { name: 'Fondations', value: 45 },
        { name: 'Entreprises', value: 30 },
        { name: 'Individus', value: 25 },
    ]

    const mockHistory = [
        { month: 'Jan', amount: 12000 },
        { month: 'Fév', amount: 19000 },
        { month: 'Mar', amount: 15000 },
    ]

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-2xl font-bold">Gestion des donateurs</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-medium mb-2">Segmentation</h2>
                    <DonorSegmentChart data={mockSegments} />
                </div>
                <div>
                    <h2 className="text-lg font-medium mb-2">Historique des dons</h2>
                    <DonationHistoryChart data={mockHistory} />
                </div>
            </div>
            <DonorList />
        </div>
    )
}
