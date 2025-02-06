import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { HistoricalSimulation, SimulationParams } from '../../../src/lib/simulation/historical';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    historicalData: {
      findMany: jest.fn()
    }
  }))
}));

describe('HistoricalSimulation', () => {
  let simulation: HistoricalSimulation;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    simulation = new HistoricalSimulation(mockPrisma);
  });

  describe('runSimulation', () => {
    const mockParams: SimulationParams = {
      portfolioValue: 1000000,
      annualSpending: 40000,
      equityAllocation: 60,
      bondAllocation: 40,
      simulationYears: 30,
      withdrawalStrategy: 'fixed'
    };

    it('should handle successful simulation', async () => {
      // Mock historical data for a successful scenario
      const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        year: 1990 + i,
        equityNominal: 8.0,  // 8% return
        equityReal: 6.0,
        bondNominal: 4.0,    // 4% return
        bondReal: 2.0,
        inflationRate: 2.0,  // 2% inflation
        goldReturn: null,
        cashReturn: null
      }));

      mockPrisma.historicalData.findMany.mockResolvedValue(mockHistoricalData);

      const result = await simulation.runSimulation(mockParams);

      expect(result.success).toBe(true);
      expect(result.portfolioValues.length).toBeGreaterThan(0);
      expect(result.withdrawalAmounts.length).toBeGreaterThan(0);
      expect(result.years.length).toBeGreaterThan(0);
      expect(typeof result.successRate).toBe('number');
    });

    it('should handle portfolio failure', async () => {
      // Mock historical data for a failing scenario (negative returns)
      const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        year: 1990 + i,
        equityNominal: -10.0, // -10% return
        equityReal: -15.0,
        bondNominal: -5.0,    // -5% return
        bondReal: -10.0,
        inflationRate: 5.0,   // 5% inflation
        goldReturn: null,
        cashReturn: null
      }));

      mockPrisma.historicalData.findMany.mockResolvedValue(mockHistoricalData);

      const result = await simulation.runSimulation(mockParams);

      expect(result.success).toBe(false);
      expect(result.successRate).toBe(0);
    });

    it('should handle different withdrawal strategies', async () => {
      const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        year: 1990 + i,
        equityNominal: 8.0,
        equityReal: 6.0,
        bondNominal: 4.0,
        bondReal: 2.0,
        inflationRate: 2.0,
        goldReturn: null,
        cashReturn: null
      }));

      mockPrisma.historicalData.findMany.mockResolvedValue(mockHistoricalData);

      // Test each withdrawal strategy
      const strategies: SimulationParams['withdrawalStrategy'][] = [
        'fixed',
        'variable',
        'percentageOfPortfolio',
        'vpw'
      ];

      for (const strategy of strategies) {
        const params = { ...mockParams, withdrawalStrategy: strategy };
        const result = await simulation.runSimulation(params);

        expect(result).toEqual(expect.objectContaining({
          success: expect.any(Boolean),
          portfolioValues: expect.any(Array),
          withdrawalAmounts: expect.any(Array),
          years: expect.any(Array),
          successRate: expect.any(Number)
        }));
      }
    });

    it('should handle empty historical data', async () => {
      mockPrisma.historicalData.findMany.mockResolvedValue([]);

      await expect(simulation.runSimulation(mockParams))
        .rejects
        .toThrow('No historical data available for the specified period');
    });
  });
});