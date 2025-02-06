'use client';

import { useState, useEffect } from 'react';
import { PeriodComparison } from '@/components/analysis/PeriodComparison';
import { calculateMetricsForPeriods, getNotablePeriods, type PeriodMetrics, type Period } from '@/lib/analysis/historicalMetrics';

export default function AnalysisPage() {
  const [metrics, setMetrics] = useState<Record<string, PeriodMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with notable periods
  const [periods, setPeriods] = useState<Period[]>(getNotablePeriods());

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await calculateMetricsForPeriods(periods);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, [periods]);

  const handlePeriodsChange = async (newPeriods: Period[]) => {
    setPeriods(newPeriods);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-8 max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historical Analysis</h1>
          <p className="text-gray-600">
            Compare market metrics across different historical periods to understand market behavior
            and identify patterns.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg font-semibold mb-2">Loading...</div>
            <p className="text-gray-500">Calculating historical metrics</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <PeriodComparison
            onPeriodsChange={handlePeriodsChange}
            metrics={metrics}
          />
        )}

        <div className="mt-8 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Understanding the Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Market Returns</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Stock Returns: Average annual nominal returns for equities</li>
                <li>Bond Returns: Average annual nominal returns for bonds</li>
                <li>Inflation Rate: Average annual inflation rate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Valuation Metrics</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>P/E Ratio: Average Price-to-Earnings ratio</li>
                <li>Dividend Yield: Average dividend yield as percentage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
