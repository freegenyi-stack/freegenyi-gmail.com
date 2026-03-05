
'use client'

import { useDonors } from '../hooks/useDonors'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function DonorList() {
    const { donors, loading } = useDonors()
    if (loading) return <div>Chargement...</div>
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Donateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total dons</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Dernier don</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {donors.map(d => (
                    <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline">
                                {d.type === 'foundation' && 'Fondation'}
                                {d.type === 'corporate' && 'Entreprise'}
                                {d.type === 'individual' && 'Individu'}
                                {d.type === 'government' && 'Gouvernement'}
                            </Badge>
                        </TableCell>
                        <TableCell>{d.totalDonations.toLocaleString()} €</TableCell>
                        <TableCell>
                            <Badge variant={
                                d.donorSegment === 'major' ? 'premium' :
                                    d.donorSegment === 'recurring' ? 'success' :
                                        d.donorSegment === 'lapsed' ? 'destructive' : 'secondary'
                            }>
                                {d.donorSegment}
                            </Badge>
                        </TableCell>
                        <TableCell>{d.lastDonationDate?.toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
