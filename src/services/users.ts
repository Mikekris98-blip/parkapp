import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser } from '../types/models';

export async function createUserProfile(uid: string, displayName: string, email: string): Promise<AppUser> {
  if (!db) throw new Error('Firestore is not configured.');
  const profile: AppUser = { id: uid, displayName, email, tier: 'free' };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  if (!db) throw new Error('Firestore is not configured.');
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}
