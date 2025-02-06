'use client';

import { useState } from 'react';
import type { PortfolioConfig } from '@/types/portfolio';
import { PortfolioFormWrapper } from './portfolio-form-wrapper';

export function PortfolioContainer() {
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioConfig | null>(null);

  const handlePortfolioSubmit = (config: PortfolioConfig) => {
    setPortfolioConfig(config);
    // TODO: Trigger simulation with new config
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Financial Inputs</h2>
        <PortfolioFormWrapper 
          onSubmit={handlePortfolioSubmit}
          initialConfig={portfolioConfig || undefined}
        />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Results Overview</h2>
        {portfolioConfig ? (
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Current Configuration</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Initial Balance:</dt>
                <dd>${portfolioConfig.initialBalance.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Stock Allocation:</dt>
                <dd>{portfolioConfig.stockAllocation}%</dd>
              </div>
              <div className="flex justify-between">
                <dt>Bond Allocation:</dt>
                <dd>{portfolioConfig.bondAllocation}%</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              Simulation results will appear here once withdrawal strategy is configured.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">
              Configure your portfolio to see simulation results based on historical market cycles.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
