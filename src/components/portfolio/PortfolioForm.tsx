'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validatePortfolio, type PortfolioFormData } from '@/lib/validation/portfolio';

interface PortfolioFormProps {
  onSubmit: (portfolio: PortfolioFormData) => void;
  initialData?: PortfolioFormData;
}

export function PortfolioForm({ onSubmit, initialData }: PortfolioFormProps) {
  const [formData, setFormData] = useState<Partial<PortfolioFormData>>(
    initialData ?? {
      initialBalance: 1000000,
      stockAllocation: 60,
      bondAllocation: 40,
    }
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
    setFormData(prev => ({
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
                setFormData(prev => ({
                  ...prev,
                  initialBalance: Number(e.target.value),
                }))
              }
            />
          </div>

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
