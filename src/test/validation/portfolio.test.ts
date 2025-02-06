import { validatePortfolio } from '@/lib/validation/portfolio';

describe('Portfolio Validation', () => {
  it('should validate a correct portfolio', () => {
    const portfolio = {
      initialBalance: 1000000,
      stockAllocation: 60,
      bondAllocation: 40,
    };

    const result = validatePortfolio(portfolio);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(portfolio);
  });

  it('should reject invalid initial balance', () => {
    const portfolio = {
      initialBalance: 500,  // Less than minimum
      stockAllocation: 60,
      bondAllocation: 40,
    };

    const result = validatePortfolio(portfolio);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Initial balance must be at least $1,000');
  });

  it('should reject invalid allocation percentages', () => {
    const portfolio = {
      initialBalance: 1000000,
      stockAllocation: 70,
      bondAllocation: 40,  // Sum > 100
    };

    const result = validatePortfolio(portfolio);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Stock and bond allocations must sum to 100%');
  });

  it('should reject negative values', () => {
    const portfolio = {
      initialBalance: 1000000,
      stockAllocation: -10,
      bondAllocation: 110,
    };

    const result = validatePortfolio(portfolio);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Stock allocation must be between 0 and 100');
  });
});
