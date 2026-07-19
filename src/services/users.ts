import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser } from '../types/models';
import type { MembershipTier } from '../theme/theme';

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

// Temporary — lets Stage 3+ gated UI be tested before the real upgrade
// flow (Stage 7) can change a user's tier via billing.
export async function setUserTier(uid: string, tier: MembershipTier): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'users', uid), { tier });
}

export async function updateUserDisplayName(uid: string, displayName: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'users', uid), { displayName });
}

export async function updateUserPhoto(uid: string, photoUrl: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'users', uid), { photoUrl });
}
