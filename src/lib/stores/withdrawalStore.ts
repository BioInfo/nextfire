import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WithdrawalStrategy } from '@/lib/simulation/strategies/types';

const STORE_VERSION = 1;

interface WithdrawalStore {
  version: number;
  strategy: WithdrawalStrategy | null;
  setStrategy: (strategy: WithdrawalStrategy) => void;
  clearStrategy: () => void;
  hydrated: boolean;
  setHydrated: (state: boolean) => void;
}

const defaultStrategy: WithdrawalStrategy = {
  type: 'fixed',
  name: 'Fixed Withdrawal',
  description: 'Withdraw a fixed amount each year, optionally adjusted for inflation',
  amount: 40000,
  adjustForInflation: true,
};

export const useWithdrawalStore = create<WithdrawalStore>()(
  persist(
    (set) => ({
      version: STORE_VERSION,
      strategy: null,
      hydrated: false,
      setStrategy: (strategy) => set({ strategy }),
      clearStrategy: () => set({ strategy: null }),
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: 'withdrawal-storage',
      storage: createJSONStorage(() => localStorage),
      version: STORE_VERSION,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
      migrate: (persistedState: any, version) => {
        if (version < STORE_VERSION) {
          // Handle migrations here when schema changes
          return {
            ...persistedState,
            version: STORE_VERSION,
          };
        }
        return persistedState;
      },
    }
  )
);

// Export a hook to check if store is hydrated
export const useWithdrawalHydrated = () => useWithdrawalStore((state) => state.hydrated);
