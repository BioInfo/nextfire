import { SimulationEngine } from '@/lib/simulation/engine';
import { Portfolio, SimulationParams, WithdrawalStrategy } from '@/lib/simulation/types';
import '../mocks/prisma';
import { mockPrisma } from '../mocks/prisma';

describe('Historical Cycle Simulations', () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine(mockPrisma);
  });

  // Mock data for testing
  const mockHistoricalData = [
    // 1990-1994: Good market conditions
    { year: 1990, equityNominal: 10, bondNominal: 5, inflationRate: 2 },
    { year: 1991, equityNominal: 12, bondNominal: 6, inflationRate: 2 },
    { year: 1992, equityNominal: 15, bondNominal: 4, inflationRate: 3 },
    { year: 1993, equityNominal: 8, bondNominal: 5, inflationRate: 2 },
    { year: 1994, equityNominal: 9, bondNominal: 7, inflationRate: 2 },
    // 1995-1999: Mixed market conditions
    { year: 1995, equityNominal: -5, bondNominal: 6, inflationRate: 3 },
    { year: 1996, equityNominal: 4, bondNominal: 5, inflationRate: 2 },
    { year: 1997, equityNominal: 7, bondNominal: 4, inflationRate: 2 },
    { year: 1998, equityNominal: -10, bondNominal: 5, inflationRate: 4 },
    { year: 1999, equityNominal: 15, bondNominal: 3, inflationRate: 3 }
  ];

  beforeEach(() => {
    mockPrisma.historicalData.findMany.mockReset();
    mockPrisma.historicalData.findMany.mockResolvedValue(mockHistoricalData);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const testPortfolio: Portfolio = {
    initialBalance: 1000000, // $1M initial portfolio
    stockAllocation: 60,     // 60/40 portfolio
    bondAllocation: 40
  };

  const testWithdrawalStrategy: WithdrawalStrategy = {
    type: 'fixed',
    amount: 40000,          // $40k annual withdrawal
    adjustForInflation: true
  };

  describe('Single Cycle Simulation', () => {
    it('should run a single cycle simulation successfully', async () => {
      const params: SimulationParams = {
        portfolio: testPortfolio,
        withdrawalStrategy: testWithdrawalStrategy,
        startYear: 1990,
        duration: 5,
        simulationType: 'single'
      };

      const result = await engine.runSimulation(params);
      expect(result.type).toBe('single');
      expect(result.cycles).toHaveLength(1);
      expect(result.cycles[0].success).toBe(true);
      expect(result.cycles[0].yearlyResults).toHaveLength(5);
    });

    it('should handle portfolio failure correctly', async () => {
      const params: SimulationParams = {
        portfolio: {
          ...testPortfolio,
          initialBalance: 100000 // Much smaller portfolio
        },
        withdrawalStrategy: {
          ...testWithdrawalStrategy,
          amount: 40000 // Same withdrawal from smaller portfolio
        },
        startYear: 1990,
        duration: 5,
        simulationType: 'single'
      };

      const result = await engine.runSimulation(params);
      expect(result.cycles[0].success).toBe(false);
    });
  });

  describe('Historical Cycles Simulation', () => {
    it('should run simulations for all possible cycles', async () => {
      const params: SimulationParams = {
        portfolio: testPortfolio,
        withdrawalStrategy: testWithdrawalStrategy,
        duration: 5,
        simulationType: 'historical-cycles'
      };

      const result = await engine.runSimulation(params);
      expect(result.type).toBe('historical-cycles');
      expect(result.cycles.length).toBeGreaterThan(0);
      expect(result.successRate).toBeDefined();
      expect(result.medianEndingBalance).toBeDefined();
      expect(result.worstCaseBalance).toBeDefined();
      expect(result.bestCaseBalance).toBeDefined();
    });

    it('should calculate success rate correctly', async () => {
      const params: SimulationParams = {
        portfolio: testPortfolio,
        withdrawalStrategy: {
          type: 'percentage',
          amount: 4 // 4% withdrawal rate
        },
        duration: 5,
        simulationType: 'historical-cycles'
      };

      const result = await engine.runSimulation(params);
      expect(result.successRate).toBeGreaterThanOrEqual(0);
      expect(result.successRate).toBeLessThanOrEqual(100);
    });

    it('should handle edge cases with no valid cycles', async () => {
      const params: SimulationParams = {
        portfolio: testPortfolio,
        withdrawalStrategy: testWithdrawalStrategy,
        duration: 20, // Longer than our test data
        simulationType: 'historical-cycles'
      };

      await expect(engine.runSimulation(params)).rejects.toThrow(
        'No valid historical cycles found for simulation'
      );
    });
  });
});
