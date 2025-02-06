import { z } from 'zod';

export const withdrawalSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fixed'),
    name: z.string(),
    description: z.string(),
    amount: z.number()
      .positive('Withdrawal amount must be positive'),
    adjustForInflation: z.boolean().default(true)
  }),
  z.object({
    type: z.literal('percentage'),
    name: z.string(),
    description: z.string(),
    amount: z.number()
      .positive('Withdrawal amount must be positive')
      .max(100, 'Percentage withdrawal must be between 0 and 100')
  }),
  z.object({
    type: z.literal('variable'),
    name: z.string(),
    description: z.string(),
    baseAmount: z.number()
      .positive('Base amount must be positive'),
    floorAmount: z.number()
      .positive('Floor amount must be positive'),
    ceilingAmount: z.number()
      .positive('Ceiling amount must be positive'),
    marketSensitivity: z.number()
      .min(0, 'Market sensitivity must be between 0 and 1')
      .max(1, 'Market sensitivity must be between 0 and 1')
  }),
  z.object({
    type: z.literal('guardrails'),
    name: z.string(),
    description: z.string(),
    baseAmount: z.number()
      .positive('Base amount must be positive'),
    basePercentage: z.number()
      .positive('Base percentage must be positive')
      .max(100, 'Base percentage must be between 0 and 100'),
    ceilingPercentage: z.number()
      .positive('Ceiling percentage must be positive')
      .max(100, 'Ceiling percentage must be between 0 and 100'),
    floorPercentage: z.number()
      .positive('Floor percentage must be positive')
      .max(100, 'Floor percentage must be between 0 and 100')
  })
]);


export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export function validateWithdrawal(data: unknown): { 
  success: boolean; 
  data?: WithdrawalFormData; 
  error?: string; 
} {
  try {
    const validData = withdrawalSchema.parse(data);
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
      error: 'Invalid withdrawal strategy' 
    };
  }
}
