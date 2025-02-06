import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startYear = url.searchParams.get('startYear');
  const endYear = url.searchParams.get('endYear');

  if (!startYear || !endYear) {
    return NextResponse.json(
      { error: 'Missing startYear or endYear parameters' },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.historicalData.findMany({
      where: {
        year: {
          gte: parseInt(startYear),
          lte: parseInt(endYear),
        },
      },
      orderBy: {
        year: 'asc',
      },
    });

    if (data.length === 0) {
      return NextResponse.json(
        { error: `No data found for period ${startYear}-${endYear}` },
        { status: 404 }
      );
    }

    // Calculate averages
    const stockReturns = data.reduce((sum, d) => sum + d.equityNominal, 0) / data.length;
    const bondReturns = data.reduce((sum, d) => sum + d.bondNominal, 0) / data.length;
    const inflation = data.reduce((sum, d) => sum + d.inflationRate, 0) / data.length;
    const peRatio = data.reduce((sum, d) => sum + d.peRatio, 0) / data.length;
    const dividendYield = data.reduce((sum, d) => sum + d.dividendYield, 0) / data.length;

    return NextResponse.json({
      stockReturns,
      bondReturns,
      inflation,
      peRatio,
      dividendYield,
    });
  } catch (error) {
    console.error('Error fetching historical metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical metrics' },
      { status: 500 }
    );
  }
}
