import type { MembershipTier } from '../theme/theme';

export interface Park {
  id: string;
  icon: string;
  name: string;
  loc: string;
  address: string;
  coord: { x: number; y: number };
  description: string;
  amenities: string[];
  campsiteCount: number;
  trailCount: number;
}

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  tier: MembershipTier;
  renewalDate?: string;
  shippingAddress?: string;
}

export interface Visit {
  id: string;
  userId: string;
  parkId: string | null;
  manualParkName?: string;
  dates: string;
  notes: string;
  photoUrls: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface SiteNote {
  id: string;
  userId: string;
  parkId: string;
  siteNumber: number;
  notes: string;
  photoUrls: string[];
}

export interface TreasureTrail {
  id: string;
  icon: string;
  name: string;
  description: string;
  checkpointCount: number;
}

export interface FunGuide {
  id: string;
  title: string;
  theme: string;
}

export interface PatchOrder {
  id: string;
  userId: string;
  year: number;
  shippingStatus: 'pending' | 'shipped' | 'delivered';
}
