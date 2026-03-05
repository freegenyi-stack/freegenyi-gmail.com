import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1';

// Server-side Pusher instance
export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: PUSHER_CLUSTER,
    useTLS: true
});

// Client-side Pusher instance
export const pusherClient = typeof window !== 'undefined' ? new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
    {
        cluster: PUSHER_CLUSTER,
        authEndpoint: '/api/pusher/auth',
        auth: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
) : null;

// Channel names
export const getNotificationChannel = (userId: string) => `private-notifications-${userId}`;
export const getMessageChannel = (userId: string) => `private-messages-${userId}`;
export const getDashboardChannel = (role: string) => `presence-dashboard-${role}`;

// Event names
export const EVENTS = {
    NOTIFICATION: 'notification',
    MESSAGE: 'message',
    PROGRESS_UPDATE: 'progress-update',
    ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
    USER_JOINED: 'user-joined',
    USER_LEFT: 'user-left'
} as const;
