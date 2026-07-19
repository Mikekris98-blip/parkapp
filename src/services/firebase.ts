import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// Imported from the '@firebase/auth' subpackage rather than the 'firebase/auth'
// wrapper because the wrapper's TypeScript types are fixed to the browser
// build and omit the React Native persistence helper, even though Metro
// resolves the same function correctly at runtime via either path.
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from '@firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Values come from a project-level .env file (see .env.example) using Expo's
// EXPO_PUBLIC_ prefix so they're inlined at build time. Fill these in with
// your own Firebase project's config from the Firebase console before running.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Firebase throws synchronously on invalid/empty config, which would crash
// the whole app on first import before a real .env is filled in. Everything
// below stays undefined until real credentials are present; screens that
// need Firebase should branch on isFirebaseConfigured.
export let firebaseApp: FirebaseApp | undefined;
export let auth: Auth | undefined;
export let db: Firestore | undefined;
export let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

  if (Platform.OS === 'web') {
    // getReactNativePersistence has no working implementation under Metro's
    // web bundle (only under the "react-native" platform condition) — the
    // browser build's default IndexedDB/localStorage persistence is correct
    // for web anyway, so just use getAuth there.
    auth = getAuth(firebaseApp);
  } else {
    try {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // initializeAuth throws if called twice (e.g. Fast Refresh) — fall back to getAuth.
      auth = getAuth(firebaseApp);
    }
  }

  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
}
