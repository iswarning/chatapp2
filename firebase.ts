import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore/lite';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

// const firebaseConfig = {
//     apiKey: "AIzaSyAJDAsjGHkKm_H1ErW_gq_s2UlnBpeJ2eQ",
//     authDomain: "chatapp-6142d.firebaseapp.com",
//     projectId: "chatapp-6142d",
//     storageBucket: "chatapp-6142d.appspot.com",
//     messagingSenderId: "348770708072",
//     appId: "1:348770708072:web:37ac790686602f06bd29dd"
// };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };