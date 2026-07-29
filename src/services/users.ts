import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser, PremiumPicks } from '../types/models';
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

// Simulated $5 one-time purchase (this prototype has no real payment
// processing — see PaywallModal) — grants permanent access regardless of tier.
export async function purchaseTrail(uid: string, trailId: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'users', uid), { purchasedTrailIds: arrayUnion(trailId) });
}

export async function purchaseGuide(uid: string, guideId: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'users', uid), { purchasedGuideIds: arrayUnion(guideId) });
}

// Spends one of a Premium member's free picks for the current calendar year.
export async function addPremiumTrailPick(uid: string, trailId: string, currentPicks?: PremiumPicks): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const year = new Date().getFullYear();
  const base: PremiumPicks = currentPicks?.year === year ? currentPicks : { year, trailIds: [], guideIds: [] };
  const updated: PremiumPicks = { ...base, trailIds: [...base.trailIds, trailId] };
  await updateDoc(doc(db, 'users', uid), { premiumPicks: updated });
}

export async function addPremiumGuidePick(uid: string, guideId: string, currentPicks?: PremiumPicks): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const year = new Date().getFullYear();
  const base: PremiumPicks = currentPicks?.year === year ? currentPicks : { year, trailIds: [], guideIds: [] };
  const updated: PremiumPicks = { ...base, guideIds: [...base.guideIds, guideId] };
  await updateDoc(doc(db, 'users', uid), { premiumPicks: updated });
}
