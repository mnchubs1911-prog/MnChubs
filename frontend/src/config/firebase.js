import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
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
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const signInWithGooglePopup = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Google sign-in is not configured');
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
};

export const signInWithGoogleRedirect = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Google sign-in is not configured');
  }
  await signInWithRedirect(auth, googleProvider);
};

export const handleRedirectResult = async () => {
  if (!auth) return null;
  const result = await getRedirectResult(auth);
  if (result) {
    return result.user.getIdToken();
  }
  return null;
};

export { isFirebaseConfigured };

