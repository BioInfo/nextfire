export interface Portfolio {
  initialBalance: number;
  stockAllocation: number;  // 0-100
  bondAllocation: number;   // 0-100
}

export interface WithdrawalStrategy {
  type: 'fixed' | 'percentage';
  amount: number;          // For fixed: dollar amount, for percentage: 0-100
  adjustForInflation?: boolean;
}

export interface SimulationParams {
  portfolio: Portfolio;
  withdrawalStrategy: WithdrawalStrategy;
  startYear?: number;      // Optional: specific start year for single simulation
  duration: number;        // Number of years to simulate
  simulationType: 'single' | 'historical-cycles';
}

export interface YearlyResult {
  year: number;
  startingBalance: number;
  withdrawal: number;
  stockReturn: number;
  bondReturn: number;
  endingBalance: number;
  inflationRate: number;
}

export interface CycleResult {
  startYear: number;
  success: boolean;        // True if portfolio survived the duration
  finalBalance: number;
  yearlyResults: YearlyResult[];
  lowestBalance: number;
  highestBalance: number;
  averageReturn: number;
}

export interface SimulationResult {
  type: 'single' | 'historical-cycles';
  cycles: CycleResult[];  // For historical cycles, multiple cycle results
  successRate?: number;   // For historical cycles, percentage of successful cycles
  medianEndingBalance?: number; // For historical cycles, median ending balance
  worstCaseBalance?: number;   // For historical cycles, worst case ending balance
  bestCaseBalance?: number;    // For historical cycles, best case ending balance
}
