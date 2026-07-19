import { createContext, useContext, useState, type ReactNode } from 'react';
import { PaywallModal } from '../components/PaywallModal';
import { useAuth } from './AuthContext';
import { setUserTier } from '../services/users';
import type { MembershipTier } from '../theme/theme';

interface PaywallContextValue {
  openPaywall: () => void;
}

const PaywallContext = createContext<PaywallContextValue | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, refreshProfile } = useAuth();
  const [visible, setVisible] = useState(false);

  async function handleChooseTier(tier: MembershipTier) {
    if (firebaseUser) {
      await setUserTier(firebaseUser.uid, tier);
      await refreshProfile();
    }
    setVisible(false);
  }

  return (
    <PaywallContext.Provider value={{ openPaywall: () => setVisible(true) }}>
      {children}
      <PaywallModal visible={visible} onClose={() => setVisible(false)} onChooseTier={handleChooseTier} />
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallContextValue {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used within a PaywallProvider');
  return ctx;
}
