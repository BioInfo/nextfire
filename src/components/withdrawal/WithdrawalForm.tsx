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

interface WithdrawalFormProps {
  onSubmit: (withdrawal: WithdrawalFormData) => void;
  initialData?: WithdrawalFormData;
}

export function WithdrawalForm({ onSubmit, initialData }: WithdrawalFormProps) {
  const [formData, setFormData] = useState<Partial<WithdrawalFormData>>(
    initialData ?? {
      type: 'fixed',
      amount: 40000,
      adjustForInflation: true,
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Withdrawal Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'fixed' | 'percentage') =>
                setFormData(prev => ({
                  ...prev,
                  type: value,
                  // Reset amount when changing type to prevent validation issues
                  amount: value === 'fixed' ? 40000 : 4,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              {formData.type === 'fixed' ? 'Annual Withdrawal ($)' : 'Withdrawal Rate (%)'}
            </Label>
            <Input
              id="amount"
              type="number"
              step={formData.type === 'fixed' ? '1000' : '0.1'}
              min={0}
              max={formData.type === 'percentage' ? 100 : undefined}
              value={formData.amount}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
          </div>

          {formData.type === 'fixed' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="adjustForInflation"
                checked={formData.adjustForInflation}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({
                    ...prev,
                    adjustForInflation: checked,
                  }))
                }
              />
              <Label htmlFor="adjustForInflation">Adjust for inflation</Label>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Save Strategy
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
