"use client"

import { useEffect, useState } from 'react'
import type { Donor, Donation } from '../types'

const mockDonors: Donor[] = [
    { id: 'd1', type: 'foundation', name: 'Fondation Bienveillance', contactPerson: 'Marie Dupont', email: 'contact@bienveillance.org', phone: '+33123456789', taxReceiptEligible: true, communicationPreferences: { email: true, newsletter: true, annualReport: true }, firstDonationDate: new Date('2023-01-15'), totalDonations: 150000, lastDonationDate: new Date('2025-03-10'), donorSegment: 'major', tags: ['éducation', 'récurrent'] },
    { id: 'd2', type: 'corporate', name: 'Entreprise Solidaire SA', contactPerson: 'Jean Martin', email: 'jean.martin@entreprise-solidaire.fr', taxReceiptEligible: true, communicationPreferences: { email: true, newsletter: false, annualReport: true }, firstDonationDate: new Date('2024-05-20'), totalDonations: 45000, lastDonationDate: new Date('2025-02-28'), donorSegment: 'recurring', tags: ['sponsoring', 'mécénat'] },
    { id: 'd3', type: 'individual', name: 'Claire Dubois', email: 'claire.dubois@email.com', taxReceiptEligible: true, communicationPreferences: { email: true, newsletter: true, annualReport: false }, firstDonationDate: new Date('2025-01-10'), totalDonations: 500, lastDonationDate: new Date('2025-03-05'), donorSegment: 'occasional', tags: ['nouveau'] }
]

const mockDonations: Donation[] = [
    { id: 'don1', donorId: 'd1', amount: 50000, currency: 'EUR', date: new Date('2025-03-10'), paymentMethod: 'bank_transfer', designationCredit: [{ programId: 'p1', amount: 30000 }, { programId: 'p2', amount: 20000 }], recurring: false, taxReceiptIssued: true },
    { id: 'don2', donorId: 'd2', amount: 5000, currency: 'EUR', date: new Date('2025-02-28'), paymentMethod: 'bank_transfer', designationCredit: [{ programId: 'p1', amount: 5000 }], recurring: true, recurringFrequency: 'monthly', taxReceiptIssued: true }
]

export function useDonors() {
    const [donors, setDonors] = useState<Donor[]>([])
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setDonors(mockDonors)
            setDonations(mockDonations)
            setLoading(false)
        }, 700)
    }, [])
    return { donors, donations, loading }
}
