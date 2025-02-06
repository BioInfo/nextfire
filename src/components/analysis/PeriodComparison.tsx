'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Period {
  startYear: number;
  endYear: number;
  name: string;
}

interface PeriodMetrics {
  stockReturns: number;
  bondReturns: number;
  inflation: number;
  peRatio: number;
  dividendYield: number;
}

interface PeriodComparisonProps {
  onPeriodsChange: (periods: Period[]) => void;
  metrics?: Record<string, PeriodMetrics>;
}

export function PeriodComparison({ onPeriodsChange, metrics }: PeriodComparisonProps) {
  const [periods, setPeriods] = useState<Period[]>([
    { startYear: 1970, endYear: 1980, name: 'High Inflation Era' },
    { startYear: 1990, endYear: 2000, name: 'Tech Boom' },
    { startYear: 2008, endYear: 2018, name: 'Post Financial Crisis' },
  ]);

  const handleAddPeriod = () => {
    setPeriods([
      ...periods,
      {
        startYear: new Date().getFullYear() - 10,
        endYear: new Date().getFullYear(),
        name: `Period ${periods.length + 1}`,
      },
    ]);
  };

  const handlePeriodChange = (index: number, field: keyof Period, value: string | number) => {
    const newPeriods = [...periods];
    newPeriods[index] = {
      ...newPeriods[index],
      [field]: field === 'name' ? value : Number(value),
    };
    setPeriods(newPeriods);
    onPeriodsChange(newPeriods);
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    setPeriods(newPeriods);
    onPeriodsChange(newPeriods);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Period Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {periods.map((period, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Input
                  value={period.name}
                  onChange={(e) => handlePeriodChange(index, 'name', e.target.value)}
                  className="max-w-[200px]"
                  placeholder="Period Name"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemovePeriod(index)}
                  disabled={periods.length <= 1}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Year</Label>
                  <Input
                    type="number"
                    min={1871}
                    max={new Date().getFullYear()}
                    value={period.startYear}
                    onChange={(e) => handlePeriodChange(index, 'startYear', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Year</Label>
                  <Input
                    type="number"
                    min={1871}
                    max={new Date().getFullYear()}
                    value={period.endYear}
                    onChange={(e) => handlePeriodChange(index, 'endYear', e.target.value)}
                  />
                </div>
              </div>

              {metrics?.[period.name] && (
                <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50/50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-500">Stock Returns</Label>
                    <p className="text-lg font-medium">{(metrics[period.name].stockReturns * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Bond Returns</Label>
                    <p className="text-lg font-medium">{(metrics[period.name].bondReturns * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Inflation</Label>
                    <p className="text-lg font-medium">{(metrics[period.name].inflation * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">P/E Ratio</Label>
                    <p className="text-lg font-medium">{metrics[period.name].peRatio.toFixed(1)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Dividend Yield</Label>
                    <p className="text-lg font-medium">{(metrics[period.name].dividendYield * 100).toFixed(1)}%</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button onClick={handleAddPeriod} className="w-full">
            Add Period
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
