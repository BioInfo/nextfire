export type RebalancingFrequency = 'never' | 'monthly' | 'quarterly' | 'annually' | 'threshold';

export interface RebalancingThresholds {
  stocks: number;  // Percentage threshold (e.g., 5 means rebalance when stocks drift ±5%)
  bonds: number;   // Percentage threshold
}

export interface PortfolioConfig {
  initialBalance: number;
  stockAllocation: number;  // 0-100
  bondAllocation: number;   // 0-100
  rebalancingFrequency: RebalancingFrequency;
  rebalancingThresholds?: RebalancingThresholds;  // Required only when frequency is 'threshold'
  trackDrift: boolean;  // Whether to track and report portfolio drift
}

export interface PortfolioValidation {
  initialBalance?: string[];
  stockAllocation?: string[];
  bondAllocation?: string[];
  rebalancingThresholds?: string[];
}

export type PortfolioFormData = {
  initialBalance: string;
  stockAllocation: number;
  bondAllocation: number;
  rebalancingFrequency: RebalancingFrequency;
  stockThreshold?: number;
  bondThreshold?: number;
  trackDrift: boolean;
}

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  initialBalance: 1000000,  // $1M default
  stockAllocation: 60,      // 60/40 portfolio
  bondAllocation: 40,
  rebalancingFrequency: 'annually',
  rebalancingThresholds: {
    stocks: 5,  // 5% threshold
    bonds: 5
  },
  trackDrift: true
};

export const REBALANCING_FREQUENCY_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'threshold', label: 'When Threshold Exceeded' }
] as const;

export const DEFAULT_THRESHOLD = 5; // 5% default threshold
