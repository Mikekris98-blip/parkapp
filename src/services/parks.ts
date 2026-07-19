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
  return getParkByIdSync(id);
}

// Synchronous variant for list rendering (e.g. matching a visit's parkId to
// its display info), where awaiting a promise per row would be wasteful
// given the seed data is already in memory.
export function getParkByIdSync(id: string): Park | undefined {
  return seedParks.find((p) => p.id === id);
}

export function totalParkCount(): number {
  return seedParks.length;
}
