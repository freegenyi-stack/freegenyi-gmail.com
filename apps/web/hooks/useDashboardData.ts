'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/store/useAuthStore';

interface DashboardData {
    stats: any;
    recentActivity: any[];
    quickActions: any[];
}

async function fetchDashboardData(role: UserRole): Promise<DashboardData> {
    const response = await fetch(`/api/dashboard/${role.toLowerCase()}`);
    if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
    }
    return response.json();
}

export function useDashboardData() {
    const activeRole = useAuthStore(state => state.activeRole);
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['dashboard', activeRole],
        queryFn: () => fetchDashboardData(activeRole!),
        enabled: !!activeRole,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', activeRole] });
    };

    return {
        ...query,
        refresh
    };
}

// Hook for updating dashboard data
export function useUpdateDashboard() {
    const queryClient = useQueryClient();
    const activeRole = useAuthStore(state => state.activeRole);

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`/api/dashboard/${activeRole?.toLowerCase()}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', activeRole] });
        }
    });
}
