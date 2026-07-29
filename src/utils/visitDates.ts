import type { Visit } from '../types/models';

// visit.dates is free text (e.g. "Jun 12 – Jun 15, 2026"), so this best-effort
// parses a start date out of it and falls back to createdAt when that fails.
export function parseVisitStartDate(visit: Visit): number {
  const firstPart = visit.dates?.split(/[–—-]/)[0]?.trim();
  if (firstPart) {
    const yearMatch = visit.dates.match(/\b(19|20)\d{2}\b/);
    const candidate = yearMatch && !/\d{4}/.test(firstPart) ? `${firstPart}, ${yearMatch[0]}` : firstPart;
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Date.parse(visit.createdAt);
}

export function distinctParkKey(visit: Visit): string {
  return visit.parkId ?? `manual:${visit.manualParkName ?? ''}`;
}

// Keeps only the visits belonging to a user's `maxParks` most-recently-visited
// distinct parks. Used to soft-cap a downgraded Membership/Premium account back
// to the Free tier's limit without ever deleting the older visit data — if they
// upgrade again, everything reappears.
export function capVisitsToRecentParks(visits: Visit[], maxParks: number): Visit[] {
  const latestByPark = new Map<string, number>();
  for (const visit of visits) {
    const key = distinctParkKey(visit);
    const ts = parseVisitStartDate(visit);
    const existing = latestByPark.get(key);
    if (existing === undefined || ts > existing) latestByPark.set(key, ts);
  }

  const allowedKeys = new Set(
    Array.from(latestByPark.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxParks)
      .map(([key]) => key)
  );

  return visits.filter((visit) => allowedKeys.has(distinctParkKey(visit)));
}
