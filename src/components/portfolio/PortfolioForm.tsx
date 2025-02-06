'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validatePortfolio } from '@/lib/validation/portfolio';
import { usePortfolioStore } from '@/lib/stores/portfolioStore';
import type { Portfolio } from '@/types/portfolio';

interface PortfolioFormProps {
  onSubmit: (portfolio: Portfolio) => void;
  initialData?: Portfolio;
}

export function PortfolioForm({ onSubmit, initialData }: PortfolioFormProps) {
  const { defaultPortfolio } = usePortfolioStore();
  const [formData, setFormData] = useState<Portfolio>(
    initialData ?? defaultPortfolio
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePortfolio(formData);
    if (result.success && result.data) {
      onSubmit(result.data);
      setError(null);
    } else {
      setError(result.error ?? 'Invalid portfolio data');
    }
  };

  const handleStockAllocationChange = (value: number[]) => {
    setFormData((prev: Portfolio) => ({
      ...prev,
      stockAllocation: value[0],
      bondAllocation: 100 - value[0],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance ($)</Label>
            <Input
              id="initialBalance"
              type="number"
              min="1000"
              step="1000"
              value={formData.initialBalance}
              onChange={(e) =>
                setFormData((prev: Portfolio) => ({
                  ...prev,
                  initialBalance: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Asset Allocation</Label>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>Stocks: {formData.stockAllocation}%</div>
                <div>Bonds: {formData.bondAllocation}%</div>
              </div>
              <Slider
                value={[formData.stockAllocation ?? 60]}
                onValueChange={handleStockAllocationChange}
                min={0}
                max={100}
                step={5}
                className="my-4"
              />
            </div>

            <div className="space-y-2">
              <Label>Rebalancing Strategy</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.rebalancing.strategy}
                onChange={(e) =>
                  setFormData((prev: Portfolio) => ({
                    ...prev,
                    rebalancing: {
                      ...prev.rebalancing,
                      strategy: e.target.value as 'periodic' | 'threshold' | 'none',
                      // Set default values based on strategy
                      ...(e.target.value === 'periodic' ? { frequency: 3 } : {}),
                      ...(e.target.value === 'threshold' ? { threshold: 5 } : {}),
                    },
                  }))
                }
              >
                <option value="periodic">Periodic</option>
                <option value="threshold">Threshold-based</option>
                <option value="none">No Rebalancing</option>
              </select>

              {formData.rebalancing?.strategy === 'periodic' && (
                <div className="mt-2">
                  <Label>Rebalancing Frequency (months)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={formData.rebalancing.frequency ?? 3}
                    onChange={(e) =>
                      setFormData((prev: Portfolio) => ({
                        ...prev,
                        rebalancing: {
                          ...prev.rebalancing,
                          frequency: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              )}

              {formData.rebalancing?.strategy === 'threshold' && (
                <div className="mt-2">
                  <Label>Rebalancing Threshold (%)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.rebalancing.threshold ?? 5}
                    onChange={(e) =>
                      setFormData((prev: Portfolio) => ({
                        ...prev,
                        rebalancing: {
                          ...prev.rebalancing,
                          threshold: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.dynamicAllocation.enabled}
                  onChange={(e) =>
                    setFormData((prev: Portfolio) => ({
                      ...prev,
                      dynamicAllocation: {
                        ...prev.dynamicAllocation,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
                Enable Dynamic Allocation
              </Label>

              {formData.dynamicAllocation.enabled && (
                <div className="space-y-4 mt-2">
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.dynamicAllocation.type}
                    onChange={(e) =>
                      setFormData((prev: Portfolio) => ({
                        ...prev,
                        dynamicAllocation: {
                          ...prev.dynamicAllocation,
                          type: e.target.value as 'dividend' | 'valuation' | 'both',
                        },
                      }))
                    }
                  >
                    <option value="dividend">Dividend-based</option>
                    <option value="valuation">Valuation-based</option>
                    <option value="both">Both</option>
                  </select>

                  {(formData.dynamicAllocation.type === 'dividend' || formData.dynamicAllocation.type === 'both') && (
                    <div className="space-y-2">
                      <Label>Dividend Yield Thresholds (%)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Low</Label>
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={0.5}
                            value={formData.dynamicAllocation.dividendThresholds.low}
                            onChange={(e) =>
                              setFormData((prev: Portfolio) => ({
                                ...prev,
                                dynamicAllocation: {
                                  ...prev.dynamicAllocation,
                                  dividendThresholds: {
                                    low: Number(e.target.value),
                                    high: prev.dynamicAllocation?.dividendThresholds?.high ?? 5,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>High</Label>
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={0.5}
                            value={formData.dynamicAllocation.dividendThresholds.high}
                            onChange={(e) =>
                              setFormData((prev: Portfolio) => ({
                                ...prev,
                                dynamicAllocation: {
                                  ...prev.dynamicAllocation,
                                  dividendThresholds: {
                                    low: prev.dynamicAllocation?.dividendThresholds?.low ?? 2,
                                    high: Number(e.target.value),
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.dynamicAllocation.type === 'valuation' || formData.dynamicAllocation.type === 'both') && (
                    <div className="space-y-2">
                      <Label>P/E Ratio Thresholds</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Low</Label>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            step={1}
                            value={formData.dynamicAllocation.valuationThresholds.low}
                            onChange={(e) =>
                              setFormData((prev: Portfolio) => ({
                                ...prev,
                                dynamicAllocation: {
                                  ...prev.dynamicAllocation,
                                  valuationThresholds: {
                                    low: Number(e.target.value),
                                    high: prev.dynamicAllocation?.valuationThresholds?.high ?? 25,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>High</Label>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            step={1}
                            value={formData.dynamicAllocation.valuationThresholds.high}
                            onChange={(e) =>
                              setFormData((prev: Portfolio) => ({
                                ...prev,
                                dynamicAllocation: {
                                  ...prev.dynamicAllocation,
                                  valuationThresholds: {
                                    low: prev.dynamicAllocation?.valuationThresholds?.low ?? 15,
                                    high: Number(e.target.value),
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Save Portfolio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
