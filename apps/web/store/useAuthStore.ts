import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'PARENT' | 'TEACHER' | 'NGO' | 'ORGANIZATION';

interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    roles: UserRole[];
}

interface AuthState {
    user: User | null;
    activeRole: UserRole | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setActiveRole: (role: UserRole) => void;
    logout: () => void;
    hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            activeRole: null,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                activeRole: user?.roles[0] || null
            }),

            setActiveRole: (role) => {
                const { user } = get();
                if (user?.roles.includes(role)) {
                    set({ activeRole: role });
                }
            },

            logout: () => set({
                user: null,
                activeRole: null,
                isAuthenticated: false
            }),

            hasRole: (role) => {
                const { user } = get();
                return user?.roles.includes(role) || false;
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
