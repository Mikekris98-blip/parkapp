import { PREMIUM_FREE_PICKS_PER_YEAR } from '../constants';
import type { AppUser, PremiumPicks } from '../types/models';

function currentYearPicks(profile: AppUser | null): PremiumPicks {
  const year = new Date().getFullYear();
  if (profile?.premiumPicks && profile.premiumPicks.year === year) return profile.premiumPicks;
  return { year, trailIds: [], guideIds: [] };
}

export function isTrailUnlocked(profile: AppUser | null, trailId: string): boolean {
  if (profile?.purchasedTrailIds?.includes(trailId)) return true;
  if (profile?.tier === 'premium' && currentYearPicks(profile).trailIds.includes(trailId)) return true;
  return false;
}

export function isGuideUnlocked(profile: AppUser | null, guideId: string): boolean {
  if (profile?.purchasedGuideIds?.includes(guideId)) return true;
  if (profile?.tier === 'premium' && currentYearPicks(profile).guideIds.includes(guideId)) return true;
  return false;
}

export function remainingFreeTrailPicks(profile: AppUser | null): number {
  if (profile?.tier !== 'premium') return 0;
  return Math.max(0, PREMIUM_FREE_PICKS_PER_YEAR - currentYearPicks(profile).trailIds.length);
}

export function remainingFreeGuidePicks(profile: AppUser | null): number {
  if (profile?.tier !== 'premium') return 0;
  return Math.max(0, PREMIUM_FREE_PICKS_PER_YEAR - currentYearPicks(profile).guideIds.length);
}
