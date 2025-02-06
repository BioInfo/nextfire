import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Portfolio } from '@/types/portfolio';

const STORE_VERSION = 1;

interface PortfolioStore {
  version: number;
  portfolio: Portfolio | null;
  setPortfolio: (portfolio: Portfolio) => void;
  clearPortfolio: () => void;
  defaultPortfolio: Portfolio;
  hydrated: boolean;
  setHydrated: (state: boolean) => void;
}

const defaultPortfolio: Portfolio = {
  initialBalance: 1000000,
  stockAllocation: 60,
  bondAllocation: 40,
  rebalancing: {
    strategy: 'periodic',
    frequency: 3,
  },
  dynamicAllocation: {
    enabled: false,
    type: 'dividend',
    dividendThresholds: { low: 2, high: 5 },
    valuationThresholds: { low: 15, high: 25 },
  },
};

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      version: STORE_VERSION,
      portfolio: null,
      defaultPortfolio,
      hydrated: false,
      setPortfolio: (portfolio) => set({ portfolio }),
      clearPortfolio: () => set({ portfolio: null }),
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: 'portfolio-storage',
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
export const useHydrated = () => usePortfolioStore((state) => state.hydrated);
