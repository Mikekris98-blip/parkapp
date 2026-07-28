import { addDoc, arrayUnion, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Visit } from '../types/models';

type NewVisit = Omit<Visit, 'id' | 'createdAt'>;

export async function createVisit(input: NewVisit): Promise<string> {
  if (!db) throw new Error('Firestore is not configured.');
  const ref = await addDoc(collection(db, 'visits'), {
    ...input,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function addPhotoToVisit(visitId: string, photoUrl: string): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  await updateDoc(doc(db, 'visits', visitId), { photoUrls: arrayUnion(photoUrl) });
}

export async function deleteVisit(visitId: string, photoUrls: string[] = []): Promise<void> {
  if (!db) throw new Error('Firestore is not configured.');
  if (storage) {
    await Promise.all(
      photoUrls.map((url) =>
        deleteObject(ref(storage!, url)).catch(() => {
          // Best-effort: an already-missing or unparsable Storage object shouldn't block deleting the visit.
        })
      )
    );
  }
  await deleteDoc(doc(db, 'visits', visitId));
}

// Sorts client-side rather than using orderBy in the query, to avoid
// requiring a Firestore composite index (userId ==, createdAt orderBy) that
// the user would otherwise need to create manually in the console.
export function subscribeToVisits(userId: string, onChange: (visits: Visit[]) => void): () => void {
  if (!db) return () => {};
  const q = query(collection(db, 'visits'), where('userId', '==', userId));
  return onSnapshot(q, (snap) => {
    const visits = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Visit);
    visits.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    onChange(visits);
  });
}
