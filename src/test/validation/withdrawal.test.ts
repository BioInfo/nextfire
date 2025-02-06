import { validateWithdrawal } from '@/lib/validation/withdrawal';

describe('Withdrawal Validation', () => {
  it('should validate a correct fixed withdrawal', () => {
    const withdrawal = {
      type: 'fixed',
      amount: 40000,
      adjustForInflation: true,
    };

    const result = validateWithdrawal(withdrawal);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(withdrawal);
  });

  it('should validate a correct percentage withdrawal', () => {
    const withdrawal = {
      type: 'percentage',
      amount: 4,
    };

    const result = validateWithdrawal(withdrawal);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(withdrawal);
  });

  it('should reject invalid percentage amount', () => {
    const withdrawal = {
      type: 'percentage',
      amount: 101,  // Over 100%
    };

    const result = validateWithdrawal(withdrawal);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Percentage withdrawal must be between 0 and 100');
  });

  it('should reject negative amounts', () => {
    const withdrawal = {
      type: 'fixed',
      amount: -1000,
    };

    const result = validateWithdrawal(withdrawal);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Withdrawal amount must be positive');
  });

  it('should allow optional adjustForInflation', () => {
    const withdrawal = {
      type: 'fixed',
      amount: 40000,
    };

    const result = validateWithdrawal(withdrawal);
    expect(result.success).toBe(true);
    expect(result.data?.adjustForInflation).toBeUndefined();
  });
});
