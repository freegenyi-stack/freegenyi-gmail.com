import { create } from 'zustand';

interface DashboardFilters {
    subject?: string;
    difficulty?: string;
    dateRange?: { start: Date; end: Date };
    search?: string;
}

interface DashboardState {
    activeView: string;
    filters: DashboardFilters;
    selectedItems: string[];
    isLoading: boolean;

    setActiveView: (view: string) => void;
    setFilters: (filters: Partial<DashboardFilters>) => void;
    clearFilters: () => void;
    toggleSelectedItem: (id: string) => void;
    clearSelectedItems: () => void;
    setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    activeView: 'overview',
    filters: {},
    selectedItems: [],
    isLoading: false,

    setActiveView: (view) => set({ activeView: view }),

    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    clearFilters: () => set({ filters: {} }),

    toggleSelectedItem: (id) => set((state) => ({
        selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter(item => item !== id)
            : [...state.selectedItems, id]
    })),

    clearSelectedItems: () => set({ selectedItems: [] }),

    setLoading: (loading) => set({ isLoading: loading })
}));
