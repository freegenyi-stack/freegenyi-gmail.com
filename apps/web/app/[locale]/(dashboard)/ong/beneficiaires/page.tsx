
import { BeneficiaryList } from '@/components/dashboard/ong/beneficiaries/BeneficiaryList'
import { BeneficiaryDemographics } from '@/components/dashboard/ong/beneficiaries/BeneficiaryDemographics'

export default function BeneficiariesPage() {
    const mockDemo = [
        { group: 'Enfants', count: 120 },
        { group: 'Ados', count: 80 },
        { group: 'Adultes', count: 40 },
    ]

    return (
        <div className="space-y-6">
            <h1 className="font-heading text-2xl font-bold">Bénéficiaires</h1>
            <div>
                <h2 className="text-lg font-medium mb-2">Démographie</h2>
                <BeneficiaryDemographics data={mockDemo} />
            </div>
            <BeneficiaryList />
        </div>
    )
}
