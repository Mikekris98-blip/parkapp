import { seedParks } from '../data/parks';
import type { Park } from '../types/models';

// Synchronous over the local seed set for now; returns a Promise so callers
// don't need to change when this is backed by Firestore's real 340+ park
// collection (see Stage 8).
export async function searchParks(query: string): Promise<Park[]> {
  const q = query.trim().toLowerCase();
  if (!q) return seedParks;
  return seedParks.filter((p) => p.name.toLowerCase().includes(q));
}

export async function getParkById(id: string): Promise<Park | undefined> {
  return seedParks.find((p) => p.id === id);
}
