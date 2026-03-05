import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from './useAuthStore';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
    icon: LucideIcon;
    label: string;
    href: string;
    badge?: number;
    children?: NavItem[];
}

interface SidebarState {
    isOpen: boolean;
    isMobileOpen: boolean;
    activeRole: UserRole | null;

    onOpen: () => void;
    onClose: () => void;
    toggle: () => void;
    toggleMobile: () => void;
    setActiveRole: (role: UserRole | null) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            isMobileOpen: false,
            activeRole: null,

            onOpen: () => set({ isOpen: true }),
            onClose: () => set({ isOpen: false }),
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
            setActiveRole: (role) => set({ activeRole: role })
        }),
        {
            name: 'sidebar-storage',
        }
    )
);
