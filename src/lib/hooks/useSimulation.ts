'use client';

import { useState } from 'react';
import { SimulationEngine } from '@/lib/simulation/engine';
import type { SimulationResult } from '@/lib/simulation/types';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { useWithdrawalStore } from '@/lib/stores/withdrawalStore';

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { portfolio } = usePortfolioStore();
  const { strategy } = useWithdrawalStore();

  const runSimulation = async () => {
    if (!portfolio || !strategy) {
      setError('Please configure both portfolio and withdrawal strategy');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const engine = new SimulationEngine();
      const result = await engine.runSimulation({
        portfolio,
        withdrawalStrategy: strategy,
        simulationType: 'historical-cycles',
        duration: 30, // 30-year retirement period
      });

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulation');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    result,
    error,
    isLoading,
    runSimulation,
  };
}
