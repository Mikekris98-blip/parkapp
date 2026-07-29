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
