import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WithdrawalStrategy } from '@/lib/simulation/types';

interface WithdrawalStore {
  strategy: WithdrawalStrategy | null;
  setStrategy: (strategy: WithdrawalStrategy) => void;
  clearStrategy: () => void;
}

export const useWithdrawalStore = create<WithdrawalStore>()(
  persist(
    (set) => ({
      strategy: null,
      setStrategy: (strategy) => set({ strategy }),
      clearStrategy: () => set({ strategy: null }),
    }),
    {
      name: 'withdrawal-storage',
    }
  )
);
