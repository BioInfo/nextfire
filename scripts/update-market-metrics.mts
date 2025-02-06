import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface MetricsData {
  year: number;
  [key: string]: number | string;
}

async function loadIEData(): Promise<MetricsData[]> {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir)
    .filter((f: string) => f.startsWith('ie_data_part_'))
    .sort();

  let combinedData = '';
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    combinedData += content;
  }

  return parse(combinedData, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
    trim: true,
  });
}

async function updateMarketMetrics() {
  try {
    console.log('Loading IE data files...');
    const ieData = await loadIEData();

    console.log('Creating lookup maps...');
    const peRatiosMap = new Map(ieData.map(d => {
      const year = Math.floor(Number(d.Date));
      const pe = Number(d.CAPE); // Using CAPE (Cyclically Adjusted P/E)
      return [year, pe];
    }));

    const dividendsMap = new Map(ieData.map(d => {
      const year = Math.floor(Number(d.Date));
      const price = Number(d.P); // Stock price
      const dividend = Number(d.D); // Dividend
      const yield_ = (dividend * 12) / price; // Annualize monthly dividend
      return [year, yield_];
    }));

    console.log('Fetching historical data...');
    const historicalData = await prisma.historicalData.findMany({
      orderBy: { year: 'asc' },
    });

    console.log('Updating records...');
    let updatedCount = 0;
    for (const record of historicalData) {
      const peRatio = peRatiosMap.get(record.year) ?? 15.0; // Default P/E if not found
      const dividendYield = dividendsMap.get(record.year) ?? 0.04; // Default yield if not found

      await prisma.historicalData.update({
        where: { id: record.id },
        data: {
          peRatio,
          dividendYield,
        },
      });
      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`Updated ${updatedCount} of ${historicalData.length} records...`);
      }
    }

    console.log(`\nUpdate complete! Updated ${updatedCount} records.`);
  } catch (error) {
    console.error('Error updating market metrics:', error);
    process.exit(1);
  }
}

updateMarketMetrics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
