export type RebalancingStrategy = 'periodic' | 'threshold' | 'none';

export interface DynamicAllocationThresholds {
  low: number;
  high: number;
}

export interface DynamicAllocation {
  enabled: boolean;
  type: 'dividend' | 'valuation' | 'both';
  dividendThresholds: DynamicAllocationThresholds;
  valuationThresholds: DynamicAllocationThresholds;
}

export interface Rebalancing {
  strategy: RebalancingStrategy;
  frequency?: number; // For periodic rebalancing (in months)
  threshold?: number; // For threshold rebalancing (percentage deviation)
}

export interface Portfolio {
  initialBalance: number;
  stockAllocation: number;  // 0-100
  bondAllocation: number;   // 0-100
  rebalancing: Rebalancing;
  dynamicAllocation: DynamicAllocation;
}

export const DEFAULT_PORTFOLIO: Portfolio = {
  initialBalance: 1000000,  // $1M default
  stockAllocation: 60,      // 60/40 portfolio
  bondAllocation: 40,
  rebalancing: {
    strategy: 'periodic',
    frequency: 3, // Quarterly by default
  },
  dynamicAllocation: {
    enabled: false,
    type: 'dividend',
    dividendThresholds: {
      low: 2,
      high: 5,
    },
    valuationThresholds: {
      low: 15,
      high: 25,
    },
  },
};

export const REBALANCING_OPTIONS = [
  { value: 'periodic', label: 'Periodic' },
  { value: 'threshold', label: 'Threshold-based' },
  { value: 'none', label: 'No Rebalancing' },
] as const;

export const DYNAMIC_ALLOCATION_OPTIONS = [
  { value: 'dividend', label: 'Dividend-based' },
  { value: 'valuation', label: 'Valuation-based' },
  { value: 'both', label: 'Both' },
] as const;
