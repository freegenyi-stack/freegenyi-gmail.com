'use client';

import { useBeneficiaries } from '../hooks/useBeneficiaries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function BeneficiaryList() {
    const { beneficiaries, loading } = useBeneficiaries()
    if (loading) return <div>Chargement...</div>
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Programmes</TableHead>
                    <TableHead>Statut</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {beneficiaries.map(b => (
                    <TableRow key={b.id}>
                        <TableCell>{b.firstName} {b.lastName}</TableCell>
                        <TableCell>{b.birthDate ? new Date().getFullYear() - b.birthDate.getFullYear() : '-'} ans</TableCell>
                        <TableCell>{b.gender === 'female' ? 'F' : b.gender === 'male' ? 'M' : 'Autre'}</TableCell>
                        <TableCell>{b.programs.length}</TableCell>
                        <TableCell>
                            <Badge variant={b.status === 'active' ? 'success' : 'secondary'}>
                                {b.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
