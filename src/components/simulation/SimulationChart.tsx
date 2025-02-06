'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationResult } from '@/lib/simulation/types';

interface ChartData {
  year: number;
  balance: number;
  withdrawal: number;
}

function prepareChartData(result: SimulationResult): ChartData[] {
  // For historical cycles, we'll show the median path
  if (result.type === 'historical-cycles') {
    // Find the shortest cycle length to avoid index out of bounds
    const minYearCount = Math.min(
      ...result.cycles.map(cycle => cycle.yearlyResults.length)
    );
    const data: ChartData[] = [];

    for (let i = 0; i < minYearCount; i++) {
      // Get all balances for this year across cycles
      const yearData = result.cycles
        .filter(cycle => i < cycle.yearlyResults.length)
        .map(cycle => ({
          balance: cycle.yearlyResults[i].endingBalance,
          withdrawal: cycle.yearlyResults[i].withdrawal,
          year: cycle.yearlyResults[i].year
        }));

      if (yearData.length === 0) continue;

      // Calculate median balance and withdrawal
      const sortedBalances = yearData
        .map(d => d.balance)
        .sort((a, b) => a - b);
      const sortedWithdrawals = yearData
        .map(d => d.withdrawal)
        .sort((a, b) => a - b);

      const medianBalance = sortedBalances[Math.floor(sortedBalances.length / 2)];
      const medianWithdrawal = sortedWithdrawals[Math.floor(sortedWithdrawals.length / 2)];

      // Use the most common year for this index
      const yearCounts = new Map<number, number>();
      yearData.forEach(d => {
        yearCounts.set(d.year, (yearCounts.get(d.year) || 0) + 1);
      });
      const mostCommonYear = Array.from(yearCounts.entries())
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      data.push({
        year: mostCommonYear,
        balance: medianBalance,
        withdrawal: medianWithdrawal,
      });
    }
    return data;
  }

  // For single simulation, just map the yearly results
  return result.cycles[0].yearlyResults.map(year => ({
    year: year.year,
    balance: year.endingBalance,
    withdrawal: year.withdrawal,
  }));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

interface SimulationChartProps {
  result: SimulationResult;
}

export function SimulationChart({ result }: SimulationChartProps) {
  if (!result || !result.cycles || result.cycles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Balance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
            No simulation data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = prepareChartData(result);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Balance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
            Unable to prepare chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Balance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{
                  value: 'Year',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                label={{
                  value: 'Amount',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(year) => `Year: ${year}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                name="Portfolio Balance"
                stroke="#2563eb"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="withdrawal"
                name="Annual Withdrawal"
                stroke="#dc2626"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
