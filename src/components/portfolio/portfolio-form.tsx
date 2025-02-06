'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { PortfolioConfig, PortfolioFormData, PortfolioValidation, RebalancingFrequency } from '@/types/portfolio';
import { DEFAULT_PORTFOLIO_CONFIG, REBALANCING_FREQUENCY_OPTIONS, DEFAULT_THRESHOLD } from '@/types/portfolio';

interface PortfolioFormProps {
  onSubmit: (config: PortfolioConfig) => void;
  initialConfig?: PortfolioConfig;
}

export function PortfolioForm({ onSubmit, initialConfig = DEFAULT_PORTFOLIO_CONFIG }: PortfolioFormProps) {
  const [formData, setFormData] = useState<PortfolioFormData>({
    initialBalance: initialConfig.initialBalance.toString(),
    stockAllocation: initialConfig.stockAllocation,
    bondAllocation: initialConfig.bondAllocation,
    rebalancingFrequency: initialConfig.rebalancingFrequency,
    stockThreshold: initialConfig.rebalancingThresholds?.stocks ?? DEFAULT_THRESHOLD,
    bondThreshold: initialConfig.rebalancingThresholds?.bonds ?? DEFAULT_THRESHOLD,
    trackDrift: initialConfig.trackDrift
  });

  const [errors, setErrors] = useState<PortfolioValidation>({});
  const [isDirty, setIsDirty] = useState(false);

  // Format initial balance on mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      initialBalance: formatCurrency(prev.initialBalance)
    }));
  }, []);

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

    // Validate rebalancing thresholds
    if (formData.rebalancingFrequency === 'threshold') {
      if (!formData.stockThreshold || formData.stockThreshold <= 0) {
        newErrors.rebalancingThresholds = ['Stock threshold must be a positive number'];
      }
      if (!formData.bondThreshold || formData.bondThreshold <= 0) {
        newErrors.rebalancingThresholds = [
          ...(newErrors.rebalancingThresholds || []),
          'Bond threshold must be a positive number'
        ];
      }
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
        rebalancingFrequency: formData.rebalancingFrequency,
        rebalancingThresholds: formData.rebalancingFrequency === 'threshold' ? {
          stocks: formData.stockThreshold!,
          bonds: formData.bondThreshold!
        } : undefined,
        trackDrift: formData.trackDrift
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

  const handleRebalancingFrequencyChange = (value: RebalancingFrequency) => {
    setFormData(prev => ({ ...prev, rebalancingFrequency: value }));
    setIsDirty(true);
  };

  const handleThresholdChange = (field: 'stockThreshold' | 'bondThreshold') => (value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
    setIsDirty(true);
  };

  const handleTrackDriftChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, trackDrift: checked }));
    setIsDirty(true);
  };

  return (
    <TooltipProvider>
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
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Enter your starting portfolio value
                  </TooltipContent>
                </Tooltip>
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
                <Alert key={i} variant="destructive" role="alert" aria-label={error}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>

            {/* Asset Allocation */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Asset Allocation
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Set your target allocation between stocks and bonds
                  </TooltipContent>
                </Tooltip>
              </Label>
              
              <div className="space-y-6">
                {/* Stocks */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="stock-allocation">Stocks</Label>
                    <span>{formData.stockAllocation}%</span>
                  </div>
                  <div role="group" aria-label="Stock allocation slider">
                    <Slider
                      id="stock-allocation"
                      value={[formData.stockAllocation]}
                      onValueChange={handleStockAllocationChange}
                      min={0}
                      max={100}
                      step={1}
                      className={errors.stockAllocation ? 'border-red-500' : ''}
                      aria-label="Stock allocation percentage"
                      data-onvaluechange={`(value) => (${handleStockAllocationChange.toString()})(value)`}
                    />
                  </div>
                </div>

                {/* Bonds */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="bond-allocation">Bonds</Label>
                    <span>{formData.bondAllocation}%</span>
                  </div>
                  <div role="group" aria-label="Bond allocation slider">
                    <Slider
                      id="bond-allocation"
                      value={[formData.bondAllocation]}
                      onValueChange={() => {}}
                      min={0}
                      max={100}
                      step={1}
                      disabled
                      aria-label="Bond allocation percentage"
                    />
                  </div>
                </div>
              </div>

              {errors.stockAllocation?.map((error, i) => (
                <Alert key={i} variant="destructive" role="alert" aria-label={error}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>

            {/* Rebalancing Options */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                Rebalancing Strategy
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Choose how often to rebalance your portfolio back to target allocations
                  </TooltipContent>
                </Tooltip>
              </Label>

              <Select
                value={formData.rebalancingFrequency}
                onValueChange={handleRebalancingFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rebalancing frequency" />
                </SelectTrigger>
                <SelectContent>
                  {REBALANCING_FREQUENCY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.rebalancingFrequency === 'threshold' && (
                <div className="space-y-4">
                  {/* Stock Threshold */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="stock-threshold">Stock Threshold</Label>
                      <span>{formData.stockThreshold}%</span>
                    </div>
                    <Slider
                      id="stock-threshold"
                      value={[formData.stockThreshold ?? DEFAULT_THRESHOLD]}
                      onValueChange={handleThresholdChange('stockThreshold')}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>

                  {/* Bond Threshold */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bond-threshold">Bond Threshold</Label>
                      <span>{formData.bondThreshold}%</span>
                    </div>
                    <Slider
                      id="bond-threshold"
                      value={[formData.bondThreshold ?? DEFAULT_THRESHOLD]}
                      onValueChange={handleThresholdChange('bondThreshold')}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>
              )}

              {errors.rebalancingThresholds?.map((error, i) => (
                <Alert key={i} variant="destructive" role="alert" aria-label={error}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>

            {/* Drift Tracking */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Track Portfolio Drift</Label>
                <p className="text-sm text-muted-foreground">
                  Monitor how your portfolio deviates from target allocations
                </p>
              </div>
              <Switch
                checked={formData.trackDrift}
                onCheckedChange={handleTrackDriftChange}
              />
            </div>

            <Button type="submit" disabled={!isDirty}>
              Save Configuration
            </Button>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
