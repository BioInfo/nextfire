'use client';

import { PortfolioForm } from '@/components/portfolio/PortfolioForm';
import { WithdrawalForm } from '@/components/withdrawal/WithdrawalForm';
import { SimulationResults } from '@/components/simulation/SimulationResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { useWithdrawalStore } from '@/lib/stores/withdrawalStore';
import type { PortfolioFormData } from '@/lib/validation/portfolio';
import type { WithdrawalStrategy } from '@/lib/simulation/strategies/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SimulationPage() {
  const { portfolio, setPortfolio } = usePortfolioStore();
  const { strategy, setStrategy } = useWithdrawalStore();

  const handlePortfolioSubmit = (data: PortfolioFormData) => {
    setPortfolio(data);
  };

  const handleWithdrawalSubmit = (data: WithdrawalStrategy) => {
    setStrategy(data);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-8 max-w-7xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Retirement Simulation</h1>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' })}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Results ↓
          </button>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="setup">Setup & Configuration</TabsTrigger>
            <TabsTrigger value="results">Simulation Results</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Portfolio */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">1. Portfolio Settings</h2>
                  <PortfolioForm 
                    onSubmit={handlePortfolioSubmit} 
                    initialData={portfolio ?? undefined} 
                  />
                </div>
              </div>

              {/* Middle Column - Withdrawal */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">2. Withdrawal Strategy</h2>
                  <WithdrawalForm
                    onSubmit={handleWithdrawalSubmit}
                    initialData={strategy ?? undefined}
                  />
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl p-6 border shadow-sm sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">Configuration Summary</h2>
              {portfolio || strategy ? (
                <div className="divide-y divide-gray-100">
                  {portfolio && (
                    <div className="pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Portfolio</h3>
                      <p className="text-lg font-semibold mb-3">Initial Balance: ${portfolio.initialBalance.toLocaleString()}</p>
                      <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Stocks</p>
                          <p className="text-lg font-medium">{portfolio.stockAllocation}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bonds</p>
                          <p className="text-lg font-medium">{portfolio.bondAllocation}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {strategy && (
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Withdrawal Strategy</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="text-lg font-medium capitalize">{strategy.type}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-lg font-medium">
                            {(() => {
                              switch (strategy.type) {
                                case 'fixed':
                                  return `$${strategy.amount.toLocaleString()}`;
                                case 'percentage':
                                  return `${strategy.amount}%`;
                                case 'variable':
                                  return `$${strategy.baseAmount.toLocaleString()} (${strategy.floorAmount.toLocaleString()}-${strategy.ceilingAmount.toLocaleString()})`;
                                case 'guardrails':
                                  return `$${strategy.baseAmount.toLocaleString()} (${strategy.floorPercentage}%-${strategy.ceilingPercentage}%)`;
                                default:
                                  return 'Unknown';
                              }
                            })()} 
                          </p>
                        </div>
                        {strategy.type === 'fixed' && (
                          <div className="text-sm text-gray-500 italic">
                            {strategy.adjustForInflation 
                              ? '✓ Adjusted for inflation' 
                              : '✗ Not adjusted for inflation'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="text-gray-400 mb-3">No configuration yet</div>
                  <p className="text-sm text-gray-500">
                    Fill out the portfolio and withdrawal forms to see your configuration summary here
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" id="results" className="space-y-8">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <SimulationResults />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
}
