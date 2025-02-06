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
  startYear: number;
  duration: number;        // Number of years to simulate
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

export interface SimulationResult {
  success: boolean;        // True if portfolio survived the duration
  finalBalance: number;
  yearlyResults: YearlyResult[];
  lowestBalance: number;
  highestBalance: number;
  averageReturn: number;
}
