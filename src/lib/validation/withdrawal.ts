import { z } from 'zod';

export const withdrawalSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fixed'),
    amount: z.number()
      .positive('Withdrawal amount must be positive'),
    adjustForInflation: z.boolean().optional()
  }),
  z.object({
    type: z.literal('percentage'),
    amount: z.number()
      .positive('Withdrawal amount must be positive')
      .max(100, 'Percentage withdrawal must be between 0 and 100')
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
