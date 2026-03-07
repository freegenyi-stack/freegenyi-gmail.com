'use client';

import { useEffect } from 'react';
import { pusherClient, getNotificationChannel, EVENTS } from '@/lib/pusher';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { Notification } from '@/store/useNotificationStore';

export function useRealtime(userId: string | null) {
    const addNotification = useNotificationStore(state => state.addNotification);

    useEffect(() => {
        if (!userId) return;

        const channel = pusherClient.subscribe(getNotificationChannel(userId));

        channel.bind(EVENTS.NOTIFICATION, (data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
            addNotification(data);

            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(data.title, {
                    body: data.message,
                    icon: '/logo.png',
                    badge: '/badge.png'
                });
            }
        });

        channel.bind(EVENTS.MESSAGE, (data: any) => {
            addNotification({
                type: 'MESSAGE',
                priority: 'MEDIUM',
                title: 'Nouveau message',
                message: `${data.senderName}: ${data.preview}`,
                actionUrl: `/dashboard/messages/${data.conversationId}`
            });
        });

        channel.bind(EVENTS.PROGRESS_UPDATE, (data: any) => {
            addNotification({
                type: 'PROGRESS',
                priority: 'LOW',
                title: 'Progression mise à jour',
                message: data.message,
                data: data
            });
        });

        channel.bind(EVENTS.ACHIEVEMENT_UNLOCKED, (data: any) => {
            addNotification({
                type: 'ACHIEVEMENT',
                priority: 'HIGH',
                title: '🎉 Nouveau badge débloqué !',
                message: data.achievementName,
                data: data
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [userId, addNotification]);

    // Request notification permission logic - should ideally be called on user interaction
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            // We just check permission here, don't force request on mount as it's often blocked
            console.log("🔔 Desktop notifications are available but permission is not yet granted.");
        }
    }, []);
}
