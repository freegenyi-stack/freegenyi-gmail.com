
'use client'

import { usePrograms } from '../hooks/usePrograms'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ProgramList() {
    const { programs, loading } = usePrograms()

    if (loading) return <div>Chargement...</div>

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="font-heading text-2xl">Programmes</h2>
                <Button variant="premium">Nouveau programme</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs.map(p => {
                    const utilization = (p.actualSpent / p.budget) * 100
                    return (
                        <Card key={p.id} className="hover:shadow-md transition">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-heading font-semibold text-lg">{p.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                                    </div>
                                    <Badge variant={p.status === 'active' ? 'success' : 'secondary'}>{p.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="text-muted-foreground">Budget:</span> {p.budget.toLocaleString()} €</div>
                                    <div><span className="text-muted-foreground">Objectifs:</span> {p.objectives.length}</div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs">
                                        <span>Utilisation budget</span>
                                        <span>{utilization.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={utilization} className="h-2 mt-1" />
                                </div>
                                <div className="flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/ong/programmes/${p.id}`}>Détails</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
