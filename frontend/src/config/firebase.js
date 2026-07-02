import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  indexedDBLocalPersistence,
  setPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // Always use the real Firebase authDomain — this is the URI registered
  // in Google Cloud Console so redirect_uri_mismatch never happens.
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

  // Use IndexedDB persistence — works on Safari/mobile where
  // localStorage is blocked by cross-origin iframe restrictions.
  setPersistence(auth, indexedDBLocalPersistence).catch(() => {
    // Silently fallback if IndexedDB is unavailable (private mode, etc.)
  });
}

/**
 * Trigger Google sign-in via redirect.
 * Works on ALL devices/browsers without popup issues.
 */
export const signInWithGoogleRedirect = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Google sign-in is not configured');
  }
  await signInWithRedirect(auth, googleProvider);
};

/**
 * Call on page load to complete the redirect sign-in flow.
 * Returns the Firebase ID token, or null if no redirect was pending.
 */
export const handleRedirectResult = async () => {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return result.user.getIdToken();
    }
    return null;
  } catch (err) {
    // Ignore non-critical redirect errors (e.g. no pending redirect)
    console.warn('getRedirectResult:', err.message);
    return null;
  }
};
