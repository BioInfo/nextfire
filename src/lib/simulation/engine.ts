import { prisma } from '@/lib/database/prisma';
import type { Portfolio, SimulationParams, SimulationResult, WithdrawalStrategy, YearlyResult } from './types';

export class SimulationEngine {
  private async getHistoricalData(startYear: number, duration: number) {
    const endYear = startYear + duration;
    return await prisma.historicalData.findMany({
      where: {
        year: {
          gte: startYear,
          lt: endYear
        }
      },
      orderBy: {
        year: 'asc'
      }
    });
  }

  private calculateWithdrawal(
    strategy: WithdrawalStrategy,
    balance: number,
    inflationAdjustment: number
  ): number {
    if (strategy.type === 'fixed') {
      return strategy.adjustForInflation 
        ? strategy.amount * inflationAdjustment 
        : strategy.amount;
    } else {
      return (balance * strategy.amount) / 100;
    }
  }

  private calculateReturn(
    balance: number,
    stockAllocation: number,
    bondAllocation: number,
    stockReturn: number,
    bondReturn: number
  ): number {
    const stockContribution = balance * (stockAllocation / 100) * (1 + (stockReturn / 100));
    const bondContribution = balance * (bondAllocation / 100) * (1 + (bondReturn / 100));
    return stockContribution + bondContribution;
  }

  public async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    const historicalData = await this.getHistoricalData(params.startYear, params.duration);
    if (historicalData.length < params.duration) {
      throw new Error('Insufficient historical data for simulation duration');
    }

    const yearlyResults: YearlyResult[] = [];
    let currentBalance = params.portfolio.initialBalance;
    let inflationAdjustment = 1;
    let lowestBalance = currentBalance;
    let highestBalance = currentBalance;
    let totalReturn = 0;

    for (const yearData of historicalData) {
      // Calculate withdrawal for the year
      const withdrawal = this.calculateWithdrawal(
        params.withdrawalStrategy,
        currentBalance,
        inflationAdjustment
      );

      // Apply withdrawal
      const balanceAfterWithdrawal = currentBalance - withdrawal;

      // Calculate returns
      const endingBalance = this.calculateReturn(
        balanceAfterWithdrawal,
        params.portfolio.stockAllocation,
        params.portfolio.bondAllocation,
        yearData.equityNominal,
        yearData.bondNominal
      );

      // Update inflation adjustment
      inflationAdjustment *= (1 + (yearData.inflationRate / 100));

      // Track min/max balances
      lowestBalance = Math.min(lowestBalance, endingBalance);
      highestBalance = Math.max(highestBalance, endingBalance);

      // Calculate year's return
      const yearReturn = (endingBalance - balanceAfterWithdrawal) / balanceAfterWithdrawal;
      totalReturn += yearReturn;

      // Store yearly result
      yearlyResults.push({
        year: yearData.year,
        startingBalance: currentBalance,
        withdrawal,
        stockReturn: yearData.equityNominal,
        bondReturn: yearData.bondNominal,
        endingBalance,
        inflationRate: yearData.inflationRate
      });

      // Update balance for next year
      currentBalance = endingBalance;

      // Check for portfolio failure
      if (currentBalance <= 0) {
        return {
          success: false,
          finalBalance: 0,
          yearlyResults,
          lowestBalance,
          highestBalance,
          averageReturn: totalReturn / yearlyResults.length
        };
      }
    }

    return {
      success: true,
      finalBalance: currentBalance,
      yearlyResults,
      lowestBalance,
      highestBalance,
      averageReturn: totalReturn / yearlyResults.length
    };
  }
}
