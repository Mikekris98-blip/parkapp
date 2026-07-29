import { distinctParkKey, parseVisitStartDate } from '../utils/visitDates';
import type { Visit } from '../types/models';

export interface EarnedBadge {
  key: string;
  earnedAt: string;
}

function seasonOf(month0: number): 'winter' | 'spring' | 'summer' | 'fall' {
  if (month0 === 11 || month0 <= 1) return 'winter';
  if (month0 <= 4) return 'spring';
  if (month0 <= 7) return 'summer';
  return 'fall';
}

const PARK_COUNT_MILESTONES: [count: number, badgeKey: string][] = [
  [1, 'paw'],
  [5, 'cub'],
  [10, 'wolf'],
  [20, 'owl'],
];

// Badges are computed fresh from a user's visits rather than stored, so
// there's nothing to keep in sync — a badge simply becomes true once its
// criteria is met by the visit history.
export function computeEarnedBadges(visits: Visit[]): EarnedBadge[] {
  const sorted = [...visits].sort((a, b) => parseVisitStartDate(a) - parseVisitStartDate(b));

  const earned = new Map<string, string>();
  function markEarned(key: string, iso: string) {
    if (!earned.has(key)) earned.set(key, iso);
  }

  const seenParks = new Set<string>();
  const byMonth = new Map<string, Set<string>>();
  const byYear = new Map<string, Set<string>>();
  const seasonsSeen = new Set<string>();
  let publicCount = 0;
  let photoEntryCount = 0;

  for (const visit of sorted) {
    const ts = parseVisitStartDate(visit);
    const iso = new Date(ts).toISOString();
    const key = distinctParkKey(visit);
    const isNewPark = !seenParks.has(key);
    seenParks.add(key);

    if (isNewPark) {
      for (const [count, badgeKey] of PARK_COUNT_MILESTONES) {
        if (seenParks.size === count) markEarned(badgeKey, iso);
      }
    }

    const d = new Date(ts);
    const monthKey = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    const yearKey = `${d.getUTCFullYear()}`;

    const monthSet = byMonth.get(monthKey) ?? new Set<string>();
    monthSet.add(key);
    byMonth.set(monthKey, monthSet);
    if (monthSet.size === 2) markEarned('fox', iso);

    const yearSet = byYear.get(yearKey) ?? new Set<string>();
    yearSet.add(key);
    byYear.set(yearKey, yearSet);
    if (yearSet.size === 2) markEarned('beaver', iso);
    if (yearSet.size === 5) markEarned('flock', iso);

    seasonsSeen.add(seasonOf(d.getUTCMonth()));
    if (seasonsSeen.size === 4) markEarned('deer', iso);

    if (visit.isPublic) {
      publicCount += 1;
      if (publicCount === 3) markEarned('otter', iso);
    }

    if (visit.photoUrls.length > 0) {
      photoEntryCount += 1;
      if (photoEntryCount === 5) markEarned('chipmunk', iso);
    }
  }

  return Array.from(earned.entries()).map(([key, earnedAt]) => ({ key, earnedAt }));
}
