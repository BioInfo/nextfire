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
    const yearCount = result.cycles[0].yearlyResults.length;
    const data: ChartData[] = [];

    for (let i = 0; i < yearCount; i++) {
      // Get all balances for this year across cycles
      const balances = result.cycles.map(
        cycle => cycle.yearlyResults[i].endingBalance
      );
      const withdrawals = result.cycles.map(
        cycle => cycle.yearlyResults[i].withdrawal
      );

      // Calculate median balance and withdrawal
      const sortedBalances = [...balances].sort((a, b) => a - b);
      const sortedWithdrawals = [...withdrawals].sort((a, b) => a - b);
      const medianBalance =
        sortedBalances[Math.floor(sortedBalances.length / 2)];
      const medianWithdrawal =
        sortedWithdrawals[Math.floor(sortedWithdrawals.length / 2)];

      data.push({
        year: result.cycles[0].yearlyResults[i].year,
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
  const data = prepareChartData(result);

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
