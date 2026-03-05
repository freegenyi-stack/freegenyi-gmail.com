"use client"

import { useEffect, useState } from 'react'
import type { Volunteer } from '../types'

const mockVolunteers: Volunteer[] = [
    { id: 'v1', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@email.com', phone: '0612345678', skills: ['enseignement', 'animation'], availability: { weekdays: true, weekends: false, hoursPerWeek: 10 }, programsAssigned: ['p1'], totalHours: 45, lastActivity: new Date('2025-03-10'), status: 'active' },
    { id: 'v2', firstName: 'Thomas', lastName: 'Bernard', email: 'thomas.bernard@email.com', skills: ['construction', 'logistique'], availability: { weekends: true, hoursPerWeek: 8 }, programsAssigned: ['p2'], totalHours: 32, lastActivity: new Date('2025-03-08'), status: 'active' }
]

export function useVolunteers() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setVolunteers(mockVolunteers)
            setLoading(false)
        }, 600)
    }, [])
    return { volunteers, loading }
}
