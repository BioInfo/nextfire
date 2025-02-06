export interface PortfolioConfig {
  initialBalance: number;
  stockAllocation: number;  // 0-100
  bondAllocation: number;   // 0-100
}

export interface PortfolioValidation {
  initialBalance?: string[];
  stockAllocation?: string[];
  bondAllocation?: string[];
}

export type PortfolioFormData = {
  initialBalance: string;
  stockAllocation: number;
  bondAllocation: number;
}

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  initialBalance: 1000000,  // $1M default
  stockAllocation: 60,      // 60/40 portfolio
  bondAllocation: 40
};
