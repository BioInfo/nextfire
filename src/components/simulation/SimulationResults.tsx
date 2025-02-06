'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimulationChart } from '@/components/simulation/SimulationChart';
import { useSimulation } from '@/lib/hooks/useSimulation';
import type { SimulationResult } from '@/lib/simulation/types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function ResultsDisplay({ result }: { result: SimulationResult }) {
  if (result.type === 'single') {
    const cycle = result.cycles[0];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Final Balance</p>
            <p className="text-lg font-medium">{formatCurrency(cycle.finalBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Success</p>
            <p className="text-lg font-medium">{cycle.success ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lowest Balance</p>
            <p className="text-lg font-medium">{formatCurrency(cycle.lowestBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Highest Balance</p>
            <p className="text-lg font-medium">{formatCurrency(cycle.highestBalance)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-lg font-medium">{formatPercentage(result.successRate)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Median Ending Balance</p>
          <p className="text-lg font-medium">{formatCurrency(result.medianEndingBalance)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Worst Case Balance</p>
          <p className="text-lg font-medium">{formatCurrency(result.worstCaseBalance)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Best Case Balance</p>
          <p className="text-lg font-medium">{formatCurrency(result.bestCaseBalance)}</p>
        </div>
      </div>
    </div>
  );
}

export function SimulationResults() {
  const { result, error, isLoading, runSimulation } = useSimulation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runSimulation} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Running Simulation...' : 'Run Simulation'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-6">
              <ResultsDisplay result={result} />
              <SimulationChart result={result} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
