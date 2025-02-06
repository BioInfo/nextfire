import { z } from 'zod';

const rebalancingStrategySchema = z.enum(['periodic', 'threshold', 'none']);

const dynamicAllocationSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(['dividend', 'valuation', 'both']),
  // Dividend yield thresholds for allocation shifts
  dividendThresholds: z.object({
    low: z.number().min(0).max(10),
    high: z.number().min(0).max(10),
  }),
  // P/E ratio thresholds for allocation shifts
  valuationThresholds: z.object({
    low: z.number().min(0).max(50),
    high: z.number().min(0).max(50),
  }),
});

export const portfolioSchema = z.object({
  initialBalance: z.number()
    .positive('Initial balance must be positive')
    .min(1000, 'Initial balance must be at least $1,000'),
  stockAllocation: z.number()
    .min(0, 'Stock allocation must be between 0 and 100')
    .max(100, 'Stock allocation must be between 0 and 100'),
  bondAllocation: z.number()
    .min(0, 'Bond allocation must be between 0 and 100')
    .max(100, 'Bond allocation must be between 0 and 100'),
  rebalancing: z.object({
    strategy: rebalancingStrategySchema,
    // For periodic rebalancing (in months)
    frequency: z.number().min(1).max(12).optional(),
    // For threshold rebalancing (percentage deviation)
    threshold: z.number().min(1).max(20).optional(),
  }).refine(
    (data) => {
      if (data.strategy === 'periodic') {
        return data.frequency !== undefined;
      }
      if (data.strategy === 'threshold') {
        return data.threshold !== undefined;
      }
      return true;
    },
    {
      message: 'Frequency required for periodic rebalancing, threshold required for threshold-based rebalancing',
    }
  ),
  dynamicAllocation: dynamicAllocationSchema.refine(
    (data) => {
      if (!data.enabled) return true;
      if (data.type === 'dividend' || data.type === 'both') {
        return data.dividendThresholds.low < data.dividendThresholds.high;
      }
      if (data.type === 'valuation' || data.type === 'both') {
        return data.valuationThresholds.low < data.valuationThresholds.high;
      }
      return true;
    },
    {
      message: 'Low threshold must be less than high threshold',
    }
  ),
}).refine(
  (data) => data.stockAllocation + data.bondAllocation === 100,
  { message: 'Stock and bond allocations must sum to 100%' }
);

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

export function validatePortfolio(data: unknown): { 
  success: boolean; 
  data?: PortfolioFormData; 
  error?: string; 
} {
  try {
    const validData = portfolioSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    return { 
      success: false, 
      error: 'Invalid portfolio data' 
    };
  }
}
