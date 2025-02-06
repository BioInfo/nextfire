'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateWithdrawal, type WithdrawalFormData } from '@/lib/validation/withdrawal';
import { PREDEFINED_STRATEGIES } from '@/lib/simulation/strategies/implementations';

interface WithdrawalFormProps {
  onSubmit: (withdrawal: WithdrawalFormData) => void;
  initialData?: WithdrawalFormData;
}

export function WithdrawalForm({ onSubmit, initialData }: WithdrawalFormProps) {
  const [formData, setFormData] = useState<Partial<WithdrawalFormData>>(
    initialData ?? PREDEFINED_STRATEGIES[0]
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateWithdrawal(formData);
    if (result.success && result.data) {
      onSubmit(result.data);
      setError(null);
    } else {
      setError(result.error ?? 'Invalid withdrawal strategy');
    }
  };

  const handleStrategyChange = (value: string) => {
    const strategy = PREDEFINED_STRATEGIES.find(s => s.type === value);
    if (strategy) {
      setFormData(strategy);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative">
            <Label>Strategy Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleStrategyChange}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select withdrawal type" />
              </SelectTrigger>
              <SelectContent 
                sideOffset={4}
                position="popper"
                className="bg-white border shadow-md rounded-md overflow-hidden"
              >
                <div className="p-1">
                  {PREDEFINED_STRATEGIES.map(strategy => (
                    <SelectItem 
                      key={strategy.type} 
                      value={strategy.type}
                      className="cursor-pointer relative flex w-full items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {strategy.name}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
            {formData.type && (
              <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                {PREDEFINED_STRATEGIES.find(s => s.type === formData.type)?.description}
              </div>
            )}
          </div>

          {formData.type === 'fixed' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Annual Withdrawal ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="1000"
                  min={0}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="adjustForInflation"
                  checked={formData.adjustForInflation}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      adjustForInflation: checked,
                    }))}
                />
                <Label htmlFor="adjustForInflation">Adjust for inflation</Label>
              </div>
            </div>
          )}

          {formData.type === 'percentage' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Rate (%)</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                min={0}
                max={100}
                value={formData.amount}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))}
              />
            </div>
          )}

          {formData.type === 'variable' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseAmount">Base Amount ($)</Label>
                <Input
                  id="baseAmount"
                  type="number"
                  step="1000"
                  min={0}
                  value={(formData as any).baseAmount}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      baseAmount: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorAmount">Floor Amount ($)</Label>
                <Input
                  id="floorAmount"
                  type="number"
                  step="1000"
                  min={0}
                  value={(formData as any).floorAmount}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      floorAmount: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ceilingAmount">Ceiling Amount ($)</Label>
                <Input
                  id="ceilingAmount"
                  type="number"
                  step="1000"
                  min={0}
                  value={(formData as any).ceilingAmount}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      ceilingAmount: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketSensitivity">Market Sensitivity (0-1)</Label>
                <Input
                  id="marketSensitivity"
                  type="number"
                  step="0.1"
                  min={0}
                  max={1}
                  value={(formData as any).marketSensitivity}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      marketSensitivity: Number(e.target.value),
                    }))}
                />
              </div>
            </div>
          )}

          {formData.type === 'guardrails' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseAmount">Base Amount ($)</Label>
                <Input
                  id="baseAmount"
                  type="number"
                  step="1000"
                  min={0}
                  value={(formData as any).baseAmount}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      baseAmount: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePercentage">Base Percentage (%)</Label>
                <Input
                  id="basePercentage"
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={(formData as any).basePercentage}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      basePercentage: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ceilingPercentage">Ceiling Percentage (%)</Label>
                <Input
                  id="ceilingPercentage"
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={(formData as any).ceilingPercentage}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      ceilingPercentage: Number(e.target.value),
                    }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorPercentage">Floor Percentage (%)</Label>
                <Input
                  id="floorPercentage"
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  value={(formData as any).floorPercentage}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      floorPercentage: Number(e.target.value),
                    }))}
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={!formData.type}
          >
            Save Strategy
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
