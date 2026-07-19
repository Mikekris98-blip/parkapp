import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { createUserProfile, getUserProfile } from '../services/users';
import type { AppUser } from '../types/models';

interface AuthContextValue {
  firebaseUser: User | null;
  profile: AppUser | null;
  initializing: boolean;
  signUp: (displayName: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setInitializing(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const existing = await getUserProfile(user.uid);
        setProfile(existing);
      } else {
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(displayName: string, email: string, password: string) {
    if (!auth) throw new Error('Firebase is not configured.');
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    const newProfile = await createUserProfile(credential.user.uid, displayName, email);
    setProfile(newProfile);
  }

  async function logIn(email: string, password: string) {
    if (!auth) throw new Error('Firebase is not configured.');
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  async function refreshProfile() {
    if (!firebaseUser) return;
    const existing = await getUserProfile(firebaseUser.uid);
    setProfile(existing);
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, initializing, signUp, logIn, logOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
