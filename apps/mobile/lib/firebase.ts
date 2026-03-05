import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBY8aZBDy2JQ4oCIILugB4f-j1U-sh2uFM",
    authDomain: "freegeny.firebaseapp.com",
    projectId: "freegeny",
    storageBucket: "freegeny.firebasestorage.app",
    messagingSenderId: "252196226558",
    appId: "1:252196226558:web:79c23c91e7025dd39facaf"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
const appleProvider = new firebase.auth.OAuthProvider('apple.com');
const linkedinProvider = new firebase.auth.OAuthProvider('linkedin.com');

export {
    auth,
    googleProvider,
    facebookProvider,
    microsoftProvider,
    appleProvider,
    linkedinProvider
};
