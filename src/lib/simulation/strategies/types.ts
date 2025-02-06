export type BaseWithdrawalStrategy = {
  name: string;
  description: string;
};

export interface FixedWithdrawalStrategy extends BaseWithdrawalStrategy {
  type: 'fixed';
  amount: number;
  adjustForInflation: boolean;
}

export interface PercentageWithdrawalStrategy extends BaseWithdrawalStrategy {
  type: 'percentage';
  amount: number; // 0-100
}

export interface VariableSpendingStrategy extends BaseWithdrawalStrategy {
  type: 'variable';
  baseAmount: number;
  floorAmount: number;
  ceilingAmount: number;
  marketSensitivity: number; // 0-1, how much to adjust based on portfolio performance
}

export interface GuardRailsStrategy extends BaseWithdrawalStrategy {
  type: 'guardrails';
  baseAmount: number;
  basePercentage: number;
  ceilingPercentage: number;
  floorPercentage: number;
}

export type WithdrawalStrategy =
  | FixedWithdrawalStrategy
  | PercentageWithdrawalStrategy
  | VariableSpendingStrategy
  | GuardRailsStrategy;

export interface WithdrawalCalculationContext {
  currentBalance: number;
  initialBalance: number;
  previousWithdrawal: number;
  inflationAdjustment: number;
  portfolioReturn: number;
}
