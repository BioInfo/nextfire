import { PrismaClient } from '@prisma/client';

export interface SimulationParams {
  portfolioValue: number;
  annualSpending: number;
  equityAllocation: number;
  bondAllocation: number;
  simulationYears: number;
  withdrawalStrategy: 'fixed' | 'variable' | 'percentageOfPortfolio' | 'vpw';
}

export interface SimulationResult {
  success: boolean;
  portfolioValues: number[];
  withdrawalAmounts: number[];
  years: number[];
  successRate?: number;
}

interface YearlyReturn {
  year: number;
  equityReturn: number;
  bondReturn: number;
  inflationRate: number;
}

export class HistoricalSimulation {
  constructor(private readonly prisma: PrismaClient) {}

  private async getHistoricalData(startYear: number, endYear: number): Promise<YearlyReturn[]> {
    const data = await this.prisma.historicalData.findMany({
      where: {
        year: {
          gte: startYear,
          lte: endYear
        }
      },
      orderBy: {
        year: 'asc'
      }
    });

    return data.map(d => ({
      year: d.year,
      equityReturn: d.equityNominal,
      bondReturn: d.bondNominal,
      inflationRate: d.inflationRate
    }));
  }

  private calculatePortfolioReturn(
    equityAllocation: number,
    bondAllocation: number,
    equityReturn: number,
    bondReturn: number
  ): number {
    return (equityReturn * equityAllocation + bondReturn * bondAllocation) / 100;
  }

  private calculateWithdrawal(
    strategy: SimulationParams['withdrawalStrategy'],
    baseAmount: number,
    currentPortfolio: number,
    inflationRate: number,
    previousWithdrawal: number
  ): number {
    switch (strategy) {
      case 'fixed':
        // Adjust for inflation
        return baseAmount * (1 + inflationRate / 100);
      
      case 'percentageOfPortfolio':
        // Withdraw a fixed percentage (e.g., 4%) of current portfolio
        return currentPortfolio * 0.04;
      
      case 'variable':
        // Flexible withdrawal that adjusts with portfolio value but has floor/ceiling
        const baseWithdrawal = baseAmount * (1 + inflationRate / 100);
        const maxWithdrawal = previousWithdrawal * 1.1; // 10% increase cap
        const minWithdrawal = previousWithdrawal * 0.9; // 10% decrease floor
        return Math.min(Math.max(baseWithdrawal, minWithdrawal), maxWithdrawal);
      
      case 'vpw':
        // Variable Percentage Withdrawal based on remaining years
        // This is a simplified version - real VPW would use more complex factors
        const withdrawalRate = 1 / 30; // Simple example - should be based on remaining years
        return currentPortfolio * withdrawalRate;
      
      default:
        return baseAmount;
    }
  }

  async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    try {
      // Get current year as starting point
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - params.simulationYears;
      
      // Fetch historical data
      const historicalData = await this.getHistoricalData(startYear, currentYear);
      
      if (historicalData.length === 0) {
        throw new Error('No historical data available for the specified period');
      }

      const portfolioValues: number[] = [params.portfolioValue];
      const withdrawalAmounts: number[] = [];
      const years: number[] = [startYear];
      
      let currentPortfolio = params.portfolioValue;
      let previousWithdrawal = params.annualSpending;

      // Run simulation for each year
      for (let i = 0; i < historicalData.length; i++) {
        const { equityReturn, bondReturn, inflationRate, year } = historicalData[i];
        
        // Calculate withdrawal for this year
        const withdrawal = this.calculateWithdrawal(
          params.withdrawalStrategy,
          params.annualSpending,
          currentPortfolio,
          inflationRate,
          previousWithdrawal
        );
        
        // Update portfolio value after withdrawal
        currentPortfolio -= withdrawal;
        
        // Calculate returns
        const portfolioReturn = this.calculatePortfolioReturn(
          params.equityAllocation,
          params.bondAllocation,
          equityReturn,
          bondReturn
        );
        
        // Update portfolio value after returns
        currentPortfolio *= (1 + portfolioReturn / 100);
        
        // Store results
        portfolioValues.push(currentPortfolio);
        withdrawalAmounts.push(withdrawal);
        years.push(year);
        
        previousWithdrawal = withdrawal;
        
        // Check for portfolio failure
        if (currentPortfolio <= 0) {
          return {
            success: false,
            portfolioValues,
            withdrawalAmounts,
            years,
            successRate: 0
          };
        }
      }

      // Calculate success rate based on final portfolio value
      const success = currentPortfolio >= params.annualSpending;
      const successRate = success ? 100 : 0;

      return {
        success,
        portfolioValues,
        withdrawalAmounts,
        years,
        successRate
      };
    } catch (error) {
      console.error('Error running historical simulation:', error);
      throw error;
    }
  }
}