// Firebase Configuration for FreeGeny Authentication
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    Auth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBY8aZBDy2JQ4oCIILugB4f-j1U-sh2uFM",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "freegeny.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "freegeny",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "freegeny.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "252196226558",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:252196226558:web:79c23c91e7025dd39facaf"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
}

// Social Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
export const appleProvider = new OAuthProvider('apple.com');
export const linkedinProvider = new OAuthProvider('linkedin.com');

// Auth Helper Functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const signInWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);
export const signInWithApple = () => signInWithPopup(auth, appleProvider);
export const signInWithLinkedIn = () => signInWithPopup(auth, linkedinProvider);

export const signInWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

export const resetPassword = (email: string) =>
    sendPasswordResetEmail(auth, email);

export const signOut = () => firebaseSignOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback);

export { auth };
export default app;
