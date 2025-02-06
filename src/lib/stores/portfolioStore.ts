import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Portfolio } from '@/lib/simulation/types';

interface PortfolioStore {
  portfolio: Portfolio | null;
  setPortfolio: (portfolio: Portfolio) => void;
  clearPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      portfolio: null,
      setPortfolio: (portfolio) => set({ portfolio }),
      clearPortfolio: () => set({ portfolio: null }),
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
