'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
    auth,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    signInWithApple,
    signInWithLinkedIn,
    resetPassword,
    signOut as firebaseSignOut,
    onAuthChange,
} from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';

export type UserRole = 'child' | 'school' | 'institution' | 'parent';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role?: UserRole;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthChange((firebaseUser: User | null) => {
            if (firebaseUser) {
                // Get user role from localStorage or default to 'parent'
                const storedUser = localStorage.getItem('fg_user');
                const role: UserRole = storedUser
                    ? (JSON.parse(storedUser).role as UserRole)
                    : 'parent';

                setAuthState({
                    user: {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        role,
                    },
                    loading: false,
                    error: null,
                });
            } else {
                setAuthState({
                    user: null,
                    loading: false,
                    error: null,
                });
            }
        });

        return () => unsubscribe();
    }, []);

    // Email/Password Login
    const loginWithEmail = async (email: string, password: string) => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true, error: null }));
            const result = await signInWithEmail(email, password);
            const idToken = await result.user.getIdToken();

            // TODO: Send to backend for DB sync & session creation
            // For now, store token locally
            localStorage.setItem('fg_token', idToken);

            // Get user role from backend or default to 'parent'
            const role: UserRole = 'parent'; // This should come from your backend
            localStorage.setItem('fg_user', JSON.stringify({
                email: result.user.email,
                role
            }));

            return { success: true, role };
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed';
            setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    // Email/Password Signup
    const signupWithEmail = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true, error: null }));
            const result = await signUpWithEmail(email, password);

            // TODO: Send user data to backend
            // For now, store locally
            const role: UserRole = 'parent';
            localStorage.setItem('fg_user', JSON.stringify({
                email: result.user.email,
                firstName,
                lastName,
                role
            }));

            return { success: true };
        } catch (error: any) {
            const errorMessage = error.message || 'Signup failed';
            setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    // Social Login Helper
    const loginWithSocial = async (
        provider: 'google' | 'facebook' | 'microsoft' | 'apple' | 'linkedin'
    ) => {
        try {
            setAuthState((prev) => ({ ...prev, loading: true, error: null }));

            let result;
            switch (provider) {
                case 'google':
                    result = await signInWithGoogle();
                    break;
                case 'facebook':
                    result = await signInWithFacebook();
                    break;
                case 'microsoft':
                    result = await signInWithMicrosoft();
                    break;
                case 'apple':
                    result = await signInWithApple();
                    break;
                case 'linkedin':
                    result = await signInWithLinkedIn();
                    break;
            }

            const idToken = await result.user.getIdToken();

            // TODO: Send to backend for DB sync
            localStorage.setItem('fg_token', idToken);

            const role: UserRole = 'parent'; // Should come from backend
            localStorage.setItem('fg_user', JSON.stringify({
                email: result.user.email,
                name: result.user.displayName,
                photo: result.user.photoURL,
                role,
            }));

            return { success: true, role };
        } catch (error: any) {
            const errorMessage = error.message || 'Social login failed';
            setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
            return { success: false, error: errorMessage };
        }
    };

    // Forgot Password
    const sendPasswordReset = async (email: string) => {
        try {
            await resetPassword(email);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    // Sign Out
    const signOut = async () => {
        try {
            await firebaseSignOut();
            localStorage.removeItem('fg_token');
            localStorage.removeItem('fg_user');
            router.push('/');
        } catch (error: any) {
            console.error('Sign out error:', error);
        }
    };

    // Role-based redirection
    const redirectByRole = (role: UserRole, locale: string = 'en') => {
        switch (role.toLowerCase()) {
            case 'child':
                router.push(`/${locale}/app`);
                break;
            case 'school':
                router.push(`/${locale}/dashboard/school`);
                break;
            case 'institution':
                router.push(`/${locale}/dashboard/organization`);
                break;
            default:
                router.push(`/${locale}/dashboard/parent`);
        }
    };

    return {
        ...authState,
        loginWithEmail,
        signupWithEmail,
        loginWithSocial,
        sendPasswordReset,
        signOut,
        redirectByRole,
    };
};
