/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { PortfolioForm } from '../portfolio-form';
import { DEFAULT_PORTFOLIO_CONFIG } from '@/types/portfolio';

describe('PortfolioForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders with default values', async () => {
    const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/initial portfolio balance/i)).toHaveValue(
      DEFAULT_PORTFOLIO_CONFIG.initialBalance.toString()
    );
    expect(screen.getByText('60%')).toBeInTheDocument(); // Default stock allocation
    expect(screen.getByText('40%')).toBeInTheDocument(); // Default bond allocation
  });

  it('updates bond allocation when stock allocation changes', async () => {
    const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
    
    const stockSlider = screen.getByRole('slider', { name: /stocks/i });
    await user.type(stockSlider, '70');

    expect(screen.getByText('70%')).toBeInTheDocument(); // Updated stock allocation
    expect(screen.getByText('30%')).toBeInTheDocument(); // Updated bond allocation
  });

  it('validates initial balance', async () => {
    const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
    
    const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
    await user.type(balanceInput, '-1000');
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    expect(screen.getByText(/please enter a valid positive number/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('formats currency input correctly', async () => {
    const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
    
    const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
    await user.type(balanceInput, '1000000');
    await user.tab();

    expect(balanceInput).toHaveValue('1,000,000');
  });

  it('submits form with valid data', async () => {
    const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
    
    const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
    await user.type(balanceInput, '2000000');
    
    const stockSlider = screen.getByRole('slider', { name: /stocks/i });
    await user.type(stockSlider, '70');

    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      initialBalance: 2000000,
      stockAllocation: 70,
      bondAllocation: 30
    });
  });
});
