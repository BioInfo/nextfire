import { z } from 'zod';

export const portfolioSchema = z.object({
  initialBalance: z.number()
    .positive('Initial balance must be positive')
    .min(1000, 'Initial balance must be at least $1,000'),
  stockAllocation: z.number()
    .min(0, 'Stock allocation must be between 0 and 100')
    .max(100, 'Stock allocation must be between 0 and 100'),
  bondAllocation: z.number()
    .min(0, 'Bond allocation must be between 0 and 100')
    .max(100, 'Bond allocation must be between 0 and 100')
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
