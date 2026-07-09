import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

/**
 * Try popup first (instant UX). If popup is blocked, fall back to redirect.
 * Returns the Firebase ID token on popup success, null if redirect was triggered.
 */
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) throw new Error('Google sign-in is not configured');

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await result.user.getIdToken();
  } catch (err) {
    // Popup was blocked by browser — fall back to full-page redirect
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, googleProvider);
      return null; // Page will reload; result caught in handleGoogleRedirect
    }
    throw err;
  }
};

/**
 * Call this once on page load (in useEffect) to complete a pending redirect sign-in.
 * Returns Firebase ID token, or null if no redirect was in progress.
 */
export const handleGoogleRedirect = async () => {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) return await result.user.getIdToken();
    return null;
  } catch (err) {
    // Swallow non-critical redirect errors (no pending redirect, etc.)
    console.warn('Firebase redirect result:', err.code, err.message);
    return null;
  }
};
