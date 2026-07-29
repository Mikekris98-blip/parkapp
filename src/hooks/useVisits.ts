import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToVisits } from '../services/visits';
import { FREE_TIER_PARK_CAP } from '../constants';
import { capVisitsToRecentParks, distinctParkKey } from '../utils/visitDates';
import type { Visit } from '../types/models';

export function useVisits() {
  const { firebaseUser, profile } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setVisits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToVisits(firebaseUser.uid, (v) => {
      setVisits(v);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseUser]);

  const tier = profile?.tier ?? 'free';
  // A Membership/Premium account that drops back to Free keeps all its visit
  // data in Firestore untouched — it just only sees its most recently visited
  // parks until it upgrades again, at which point everything reappears.
  const visibleVisits = tier === 'free' ? capVisitsToRecentParks(visits, FREE_TIER_PARK_CAP) : visits;

  const distinctParkKeys = new Set(visibleVisits.map(distinctParkKey));

  return { visits: visibleVisits, loading, distinctVisitedCount: distinctParkKeys.size, distinctParkKeys };
}
