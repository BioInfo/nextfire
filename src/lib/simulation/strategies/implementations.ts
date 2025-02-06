import type {
  WithdrawalStrategy,
  WithdrawalCalculationContext,
  FixedWithdrawalStrategy,
  PercentageWithdrawalStrategy,
  VariableSpendingStrategy,
  GuardRailsStrategy,
} from './types';

export function calculateWithdrawal(
  strategy: WithdrawalStrategy,
  context: WithdrawalCalculationContext
): number {
  switch (strategy.type) {
    case 'fixed':
      return calculateFixedWithdrawal(strategy, context);
    case 'percentage':
      return calculatePercentageWithdrawal(strategy, context);
    case 'variable':
      return calculateVariableWithdrawal(strategy, context);
    case 'guardrails':
      return calculateGuardRailsWithdrawal(strategy, context);
    default:
      throw new Error(`Unknown strategy type: ${(strategy as any).type}`);
  }
}

function calculateFixedWithdrawal(
  strategy: FixedWithdrawalStrategy,
  context: WithdrawalCalculationContext
): number {
  return strategy.adjustForInflation
    ? strategy.amount * context.inflationAdjustment
    : strategy.amount;
}

function calculatePercentageWithdrawal(
  strategy: PercentageWithdrawalStrategy,
  context: WithdrawalCalculationContext
): number {
  return (context.currentBalance * strategy.amount) / 100;
}

function calculateVariableWithdrawal(
  strategy: VariableSpendingStrategy,
  context: WithdrawalCalculationContext
): number {
  // Calculate the base withdrawal adjusted for inflation
  const baseWithdrawal = strategy.baseAmount * context.inflationAdjustment;

  // Calculate portfolio performance factor (-1 to 1)
  const performanceFactor =
    (context.currentBalance - context.initialBalance) / context.initialBalance;

  // Adjust withdrawal based on market sensitivity
  const adjustedWithdrawal =
    baseWithdrawal * (1 + performanceFactor * strategy.marketSensitivity);

  // Apply floor and ceiling
  const floorAmount = strategy.floorAmount * context.inflationAdjustment;
  const ceilingAmount = strategy.ceilingAmount * context.inflationAdjustment;

  return Math.min(Math.max(adjustedWithdrawal, floorAmount), ceilingAmount);
}

function calculateGuardRailsWithdrawal(
  strategy: GuardRailsStrategy,
  context: WithdrawalCalculationContext
): number {
  // Calculate initial withdrawal if this is the first year
  if (context.previousWithdrawal === 0) {
    return (context.currentBalance * strategy.basePercentage) / 100;
  }

  // Calculate current withdrawal rate
  const currentRate =
    (context.previousWithdrawal / context.currentBalance) * 100;

  // Check if we need to adjust based on guardrails
  if (currentRate > strategy.ceilingPercentage) {
    // Cut spending
    return (context.currentBalance * strategy.ceilingPercentage) / 100;
  } else if (currentRate < strategy.floorPercentage) {
    // Increase spending
    return (context.currentBalance * strategy.floorPercentage) / 100;
  }

  // If within guardrails, continue with previous withdrawal adjusted for inflation
  return context.previousWithdrawal * context.inflationAdjustment;
}

export const PREDEFINED_STRATEGIES: WithdrawalStrategy[] = [
  {
    type: 'fixed',
    name: 'Constant Dollar',
    description: 'Withdraw a fixed amount each year, optionally adjusted for inflation',
    amount: 40000,
    adjustForInflation: true,
  },
  {
    type: 'percentage',
    name: 'Percentage of Portfolio',
    description: 'Withdraw a fixed percentage of the current portfolio value each year',
    amount: 4,
  },
  {
    type: 'variable',
    name: 'Variable Spending',
    description: 'Adjust withdrawals based on portfolio performance with floor and ceiling limits',
    baseAmount: 40000,
    floorAmount: 30000,
    ceilingAmount: 50000,
    marketSensitivity: 0.5,
  },
  {
    type: 'guardrails',
    name: 'Guardrails',
    description: 'Adjust spending when withdrawal rate exceeds certain thresholds',
    baseAmount: 40000,
    basePercentage: 4,
    ceilingPercentage: 6,
    floorPercentage: 3,
  },
];
