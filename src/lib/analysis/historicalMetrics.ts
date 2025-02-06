export interface PeriodMetrics {
  stockReturns: number;
  bondReturns: number;
  inflation: number;
  peRatio: number;
  dividendYield: number;
}

export interface Period {
  startYear: number;
  endYear: number;
  name: string;
}

export async function calculatePeriodMetrics(period: Period): Promise<PeriodMetrics> {
  const response = await fetch(
    `/api/analysis?startYear=${period.startYear}&endYear=${period.endYear}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to fetch data for period ${period.startYear}-${period.endYear}`);
  }

  return response.json();
}

export async function calculateMetricsForPeriods(periods: Period[]): Promise<Record<string, PeriodMetrics>> {
  const metrics: Record<string, PeriodMetrics> = {};

  for (const period of periods) {
    try {
      metrics[period.name] = await calculatePeriodMetrics(period);
    } catch (error) {
      console.error(`Error calculating metrics for period ${period.name}:`, error);
    }
  }

  return metrics;
}

// Helper function to get notable historical periods
export function getNotablePeriods(): Period[] {
  return [
    { startYear: 1929, endYear: 1932, name: 'Great Depression' },
    { startYear: 1970, endYear: 1980, name: 'High Inflation Era' },
    { startYear: 1990, endYear: 2000, name: 'Tech Boom' },
    { startYear: 2000, endYear: 2002, name: 'Dot-com Crash' },
    { startYear: 2008, endYear: 2009, name: 'Financial Crisis' },
    { startYear: 2020, endYear: 2021, name: 'COVID-19 Crisis' },
  ];
}
