'use client';

import { PortfolioForm } from '@/components/portfolio/PortfolioForm';
import { WithdrawalForm } from '@/components/withdrawal/WithdrawalForm';
import { SimulationResults } from '@/components/simulation/SimulationResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import { useWithdrawalStore } from '@/lib/stores/withdrawalStore';
import type { PortfolioFormData } from '@/lib/validation/portfolio';
import type { WithdrawalFormData } from '@/lib/validation/withdrawal';

export default function SimulationPage() {
  const { portfolio, setPortfolio } = usePortfolioStore();
  const { strategy, setStrategy } = useWithdrawalStore();

  const handlePortfolioSubmit = (data: PortfolioFormData) => {
    setPortfolio(data);
  };

  const handleWithdrawalSubmit = (data: WithdrawalFormData) => {
    setStrategy(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Retirement Simulation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Settings */}
        <div>
          <PortfolioForm 
            onSubmit={handlePortfolioSubmit} 
            initialData={portfolio ?? undefined} 
          />
        </div>

        {/* Withdrawal Settings */}
        <div>
          <WithdrawalForm
            onSubmit={handleWithdrawalSubmit}
            initialData={strategy ?? undefined}
          />
        </div>

        {/* Configuration Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio || strategy ? (
                <div className="space-y-6">
                  {portfolio && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Portfolio</h3>
                      <p>Initial Balance: ${portfolio.initialBalance.toLocaleString()}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Stocks</p>
                          <p className="text-lg font-medium">{portfolio.stockAllocation}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bonds</p>
                          <p className="text-lg font-medium">{portfolio.bondAllocation}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {strategy && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Withdrawal Strategy</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="text-lg font-medium capitalize">{strategy.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="text-lg font-medium">
                            {strategy.type === 'fixed' 
                              ? `$${strategy.amount.toLocaleString()}` 
                              : `${strategy.amount}%`}
                          </p>
                        </div>
                      </div>
                      {strategy.type === 'fixed' && (
                        <p className="text-sm text-muted-foreground">
                          {strategy.adjustForInflation 
                            ? 'Adjusted for inflation' 
                            : 'Not adjusted for inflation'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Configure your portfolio and withdrawal strategy to start the simulation
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Simulation Results */}
        <div>
          <SimulationResults />
        </div>
      </div>
    </div>
  );
}
