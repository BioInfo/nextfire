'use client';

import { PortfolioForm } from '@/components/portfolio/PortfolioForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import type { PortfolioFormData } from '@/lib/validation/portfolio';

export default function SimulationPage() {
  const { portfolio, setPortfolio } = usePortfolioStore();

  const handlePortfolioSubmit = (data: PortfolioFormData) => {
    setPortfolio(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Retirement Simulation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Portfolio Settings */}
        <div>
          <PortfolioForm 
            onSubmit={handlePortfolioSubmit} 
            initialData={portfolio ?? undefined} 
          />
        </div>

        {/* Simulation Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio ? (
                <div className="space-y-4">
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
              ) : (
                <p className="text-muted-foreground">
                  Enter your portfolio details to start the simulation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
