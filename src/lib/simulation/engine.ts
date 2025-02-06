import { prisma } from '@/lib/database/prisma';
import type { PrismaClient } from '@prisma/client';
import type { Portfolio, SimulationParams, SimulationResult, WithdrawalStrategy, YearlyResult } from './types';

export class SimulationEngine {
  private db: typeof prisma;

  constructor(db: typeof prisma = prisma) {
    this.db = db;
  }
  private async getHistoricalData(startYear?: number, duration?: number) {
    const query: any = {
      orderBy: {
        year: 'asc'
      }
    };

    if (startYear && duration) {
      const endYear = startYear + duration;
      query.where = {
        year: {
          gte: startYear,
          lt: endYear
        }
      };
    }

    return await this.db.historicalData.findMany(query);
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

  private async runSingleCycle(params: SimulationParams, historicalData: any[]): Promise<CycleResult> {
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
          startYear: historicalData[0].year,
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
      startYear: historicalData[0].year,
      success: true,
      finalBalance: currentBalance,
      yearlyResults,
      lowestBalance,
      highestBalance,
      averageReturn: totalReturn / yearlyResults.length
    };
  }

  public async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    const allHistoricalData = await this.getHistoricalData();
    
    if (params.simulationType === 'single') {
      if (!params.startYear) {
        throw new Error('Start year is required for single simulation');
      }

      const cycleData = allHistoricalData
        .filter(d => d.year >= params.startYear! && d.year < params.startYear! + params.duration);

      if (cycleData.length < params.duration) {
        throw new Error('Insufficient historical data for simulation duration');
      }

      const cycleResult = await this.runSingleCycle(params, cycleData);
      return {
        type: 'single',
        cycles: [cycleResult]
      };
    } else {
      // Historical cycles simulation
      const cycles: CycleResult[] = [];
      const minYear = Math.min(...allHistoricalData.map(d => d.year));
      const maxYear = Math.max(...allHistoricalData.map(d => d.year)) - params.duration;

      // Run simulation for each possible starting year
      for (let startYear = minYear; startYear <= maxYear; startYear++) {
        const cycleData = allHistoricalData
          .filter(d => d.year >= startYear && d.year < startYear + params.duration);

        if (cycleData.length === params.duration) {
          const cycleResult = await this.runSingleCycle(params, cycleData);
          cycles.push(cycleResult);
        }
      }

      if (cycles.length === 0) {
        throw new Error('No valid historical cycles found for simulation');
      }

      // Calculate aggregate statistics
      const successRate = (cycles.filter(c => c.success).length / cycles.length) * 100;
      const endingBalances = cycles.map(c => c.finalBalance).sort((a, b) => a - b);
      const medianEndingBalance = endingBalances[Math.floor(endingBalances.length / 2)];

      return {
        type: 'historical-cycles',
        cycles,
        successRate,
        medianEndingBalance,
        worstCaseBalance: Math.min(...endingBalances),
        bestCaseBalance: Math.max(...endingBalances)
      };
    }
  }
}
