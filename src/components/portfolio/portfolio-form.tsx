'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import type { PortfolioConfig, PortfolioFormData, PortfolioValidation } from '@/types/portfolio';
import { DEFAULT_PORTFOLIO_CONFIG } from '@/types/portfolio';

interface PortfolioFormProps {
  onSubmit: (config: PortfolioConfig) => void;
  initialConfig?: PortfolioConfig;
}

export function PortfolioForm({ onSubmit, initialConfig = DEFAULT_PORTFOLIO_CONFIG }: PortfolioFormProps) {
  const [formData, setFormData] = useState<PortfolioFormData>({
    initialBalance: initialConfig.initialBalance.toString(),
    stockAllocation: initialConfig.stockAllocation,
    bondAllocation: initialConfig.bondAllocation,
  });

  const [errors, setErrors] = useState<PortfolioValidation>({});
  const [isDirty, setIsDirty] = useState(false);

  // Update bond allocation when stock allocation changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      bondAllocation: 100 - prev.stockAllocation
    }));
  }, [formData.stockAllocation]);

  const validateForm = (): boolean => {
    const newErrors: PortfolioValidation = {};

    // Validate initial balance
    const balance = parseFloat(formData.initialBalance.replace(/,/g, ''));
    if (isNaN(balance) || balance <= 0) {
      newErrors.initialBalance = ['Please enter a valid positive number'];
    }

    // Validate stock allocation
    if (formData.stockAllocation < 0 || formData.stockAllocation > 100) {
      newErrors.stockAllocation = ['Stock allocation must be between 0 and 100'];
    }

    // Validate bond allocation
    if (formData.bondAllocation < 0 || formData.bondAllocation > 100) {
      newErrors.bondAllocation = ['Bond allocation must be between 0 and 100'];
    }

    // Validate total allocation
    if (formData.stockAllocation + formData.bondAllocation !== 100) {
      newErrors.stockAllocation = [...(newErrors.stockAllocation || []), 'Total allocation must equal 100%'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        initialBalance: parseFloat(formData.initialBalance.replace(/,/g, '')),
        stockAllocation: formData.stockAllocation,
        bondAllocation: formData.bondAllocation,
      });
    }
  };

  const formatCurrency = (value: string): string => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (isNaN(number)) return value;
    return number.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.,]/g, '');
    setFormData(prev => ({ ...prev, initialBalance: value }));
    setIsDirty(true);
  };

  const handleStockAllocationChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, stockAllocation: value[0] }));
    setIsDirty(true);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Portfolio Configuration</CardTitle>
        <CardDescription>
          Configure your initial portfolio balance and asset allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Initial Balance */}
          <div className="space-y-2">
            <Label htmlFor="initialBalance" className="flex items-center gap-2">
              Initial Portfolio Balance
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
            </Label>
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="initialBalance"
                value={formData.initialBalance}
                onChange={handleBalanceChange}
                onBlur={() => setFormData(prev => ({
                  ...prev,
                  initialBalance: formatCurrency(prev.initialBalance)
                }))}
                className={errors.initialBalance ? 'border-red-500' : ''}
              />
            </div>
            {errors.initialBalance?.map((error, i) => (
              <Alert key={i} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Asset Allocation */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              Asset Allocation
              <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
            </Label>
            
            <div className="space-y-6">
              {/* Stocks */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Stocks</Label>
                  <span>{formData.stockAllocation}%</span>
                </div>
                <Slider
                  value={[formData.stockAllocation]}
                  onValueChange={handleStockAllocationChange}
                  min={0}
                  max={100}
                  step={1}
                  className={errors.stockAllocation ? 'border-red-500' : ''}
                />
              </div>

              {/* Bonds */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Bonds</Label>
                  <span>{formData.bondAllocation}%</span>
                </div>
                <Slider
                  value={[formData.bondAllocation]}
                  onValueChange={() => {}}
                  min={0}
                  max={100}
                  step={1}
                  disabled
                />
              </div>
            </div>

            {errors.stockAllocation?.map((error, i) => (
              <Alert key={i} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>

          <Button type="submit" disabled={!isDirty}>
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
