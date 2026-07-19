import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { SiteNote } from '../types/models';

function siteNoteId(userId: string, parkId: string, siteNumber: number): string {
  return `${userId}_${parkId}_${siteNumber}`;
}

export async function getSiteNote(userId: string, parkId: string, siteNumber: number): Promise<SiteNote | null> {
  if (!db) throw new Error('Firestore is not configured.');
  const snap = await getDoc(doc(db, 'siteNotes', siteNoteId(userId, parkId, siteNumber)));
  return snap.exists() ? (snap.data() as SiteNote) : null;
}

export async function saveSiteNoteText(
  userId: string,
  parkId: string,
  siteNumber: number,
  notes: string
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const id = siteNoteId(userId, parkId, siteNumber);
  await setDoc(
    doc(db, 'siteNotes', id),
    { id, userId, parkId, siteNumber, notes },
    { merge: true }
  );
}

export async function addSiteNotePhoto(
  userId: string,
  parkId: string,
  siteNumber: number,
  photoUrl: string
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  const id = siteNoteId(userId, parkId, siteNumber);
  await setDoc(
    doc(db, 'siteNotes', id),
    { id, userId, parkId, siteNumber },
    { merge: true }
  );
  await updateDoc(doc(db, 'siteNotes', id), { photoUrls: arrayUnion(photoUrl) });
}
