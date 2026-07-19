import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToVisits } from '../services/visits';
import type { Visit } from '../types/models';

export function useVisits() {
  const { firebaseUser } = useAuth();
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

  const distinctParkKeys = new Set(visits.map((v) => v.parkId ?? `manual:${v.manualParkName}`));

  return { visits, loading, distinctVisitedCount: distinctParkKeys.size, distinctParkKeys };
}
