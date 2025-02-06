/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import '@testing-library/jest-dom';
import { PortfolioForm } from '../portfolio-form';
import { DEFAULT_PORTFOLIO_CONFIG, REBALANCING_FREQUENCY_OPTIONS } from '../../../types/portfolio';
import type { PortfolioConfig } from '../../../types/portfolio';

describe('PortfolioForm', () => {
  const mockOnSubmit = jest.fn();
  const customConfig: PortfolioConfig = {
    initialBalance: 500000,
    stockAllocation: 70,
    bondAllocation: 30,
    rebalancingFrequency: 'quarterly',
    trackDrift: true
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Initialization', () => {
    it('renders with default values when no initial config provided', () => {
      render(<PortfolioForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/initial portfolio balance/i)).toHaveValue(
        DEFAULT_PORTFOLIO_CONFIG.initialBalance.toLocaleString()
      );
      expect(screen.getByText('60%')).toBeInTheDocument(); // Default stock allocation
      expect(screen.getByText('40%')).toBeInTheDocument(); // Default bond allocation
      expect(screen.getByText(REBALANCING_FREQUENCY_OPTIONS.find(opt => opt.value === 'annually')!.label)).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked(); // Default drift tracking enabled
    });

    it('renders with custom initial config', () => {
      render(<PortfolioForm onSubmit={mockOnSubmit} initialConfig={customConfig} />);
      
      expect(screen.getByLabelText(/initial portfolio balance/i)).toHaveValue('500,000');
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText(REBALANCING_FREQUENCY_OPTIONS.find(opt => opt.value === 'quarterly')!.label)).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked();
    });
  });

  describe('Form State Management', () => {
    it('starts with disabled submit button', () => {
      render(<PortfolioForm onSubmit={mockOnSubmit} />);
      expect(screen.getByRole('button', { name: /save configuration/i })).toBeDisabled();
    });

    it('enables submit button when form becomes dirty', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
      
      expect(screen.getByRole('button', { name: /save configuration/i })).toBeDisabled();
      await user.clear(balanceInput);
      await user.type(balanceInput, '2000000');
      expect(screen.getByRole('button', { name: /save configuration/i })).toBeEnabled();
    });

    it('updates bond allocation automatically when stock allocation changes', async () => {
      render(<PortfolioForm onSubmit={mockOnSubmit} />);
      const stockSliderGroup = screen.getByRole('group', { name: /stock allocation slider/i });
      const stockSlider = stockSliderGroup.querySelector('[role="slider"]') as HTMLElement;
      
      // Simulate slider change by calling the onValueChange handler directly
      const onValueChange = stockSlider.getAttribute('data-onvaluechange');
      if (onValueChange) {
        const fn = new Function('value', onValueChange);
        fn([75]);
      }

      expect(screen.getByText('75%')).toBeInTheDocument(); // Stock allocation
      expect(screen.getByText('25%')).toBeInTheDocument(); // Bond allocation
    });

    it('shows threshold inputs when threshold rebalancing is selected', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      
      // Open select dropdown and choose threshold option
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /when threshold exceeded/i }));

      expect(screen.getByLabelText(/stock threshold/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bond threshold/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error for negative initial balance', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
      
      await user.clear(balanceInput);
      await user.type(balanceInput, '-1000');
      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/please enter a valid positive number/i);
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error for invalid stock allocation range', async () => {
      render(<PortfolioForm onSubmit={mockOnSubmit} />);
      const stockSliderGroup = screen.getByRole('group', { name: /stock allocation slider/i });
      const stockSlider = stockSliderGroup.querySelector('[role="slider"]') as HTMLElement;
      
      // Set invalid value using data attribute
      const onValueChange = stockSlider.getAttribute('data-onvaluechange');
      if (onValueChange) {
        const fn = new Function('value', onValueChange);
        fn([101]);
      }
      
      await fireEvent.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/stock allocation must be between 0 and 100/i);
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates threshold values when threshold rebalancing is selected', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      
      // Select threshold rebalancing
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /when threshold exceeded/i }));

      // Set invalid threshold
      const stockThresholdSlider = screen.getByLabelText(/stock threshold/i);
      fireEvent.change(stockThresholdSlider, { target: { value: '0' } });
      
      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/stock threshold must be a positive number/i);
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      const balanceInput = screen.getByLabelText(/initial portfolio balance/i);
      const stockSliderGroup = screen.getByRole('group', { name: /stock allocation slider/i });
      const stockSlider = stockSliderGroup.querySelector('[role="slider"]') as HTMLElement;
      
      await user.clear(balanceInput);
      await user.type(balanceInput, '2000000');
      
      // Set stock allocation
      const onValueChange = stockSlider.getAttribute('data-onvaluechange');
      if (onValueChange) {
        const fn = new Function('value', onValueChange);
        fn([70]);
      }

      // Change rebalancing frequency
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /quarterly/i }));
      
      // Toggle drift tracking
      await user.click(screen.getByRole('switch'));
      
      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        initialBalance: 2000000,
        stockAllocation: 70,
        bondAllocation: 30,
        rebalancingFrequency: 'quarterly',
        trackDrift: false
      });
    });

    it('submits form with threshold rebalancing configuration', async () => {
      const { user } = render(<PortfolioForm onSubmit={mockOnSubmit} />);
      
      // Select threshold rebalancing
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: /when threshold exceeded/i }));

      // Set thresholds
      const stockThresholdSlider = screen.getByLabelText(/stock threshold/i);
      const bondThresholdSlider = screen.getByLabelText(/bond threshold/i);
      
      fireEvent.change(stockThresholdSlider, { target: { value: '10' } });
      fireEvent.change(bondThresholdSlider, { target: { value: '10' } });
      
      await user.click(screen.getByRole('button', { name: /save configuration/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        rebalancingFrequency: 'threshold',
        rebalancingThresholds: {
          stocks: 10,
          bonds: 10
        }
      }));
    });
  });
});
