import { create } from 'zustand';

export type NotificationType = 'MESSAGE' | 'PROGRESS' | 'ACHIEVEMENT' | 'SYSTEM' | 'REMINDER';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    actionUrl?: string;
    createdAt: Date;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isOpen: boolean;

    addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isOpen: false,

    addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random()}`,
            isRead: false,
            createdAt: new Date()
        };

        return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        };
    }),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
    })),

    removeNotification: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification && !notification.isRead
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount
        };
    }),

    clearAll: () => set({ notifications: [], unreadCount: 0 }),

    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

    setOpen: (open) => set({ isOpen: open })
}));
