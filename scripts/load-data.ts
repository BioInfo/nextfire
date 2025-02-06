import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function loadIEData() {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir)
    .filter((f: string) => f.startsWith('ie_data_part_'))
    .sort();

  let combinedData = '';
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    combinedData += content;
  }

  const lines = combinedData.split('\n');
  const dataStartIndex = lines.findIndex(line => line.includes('Date,P,D,E,CPI,'));
  const dataContent = lines.slice(dataStartIndex).join('\n');

  return parse(dataContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

async function main() {
  try {
    console.log('Loading IE data files...');
    const ieData = await loadIEData();

    console.log('Processing data...');
    interface IEDataRow {
      Date: string;
      P: string;
      D: string;
      'Rate GS10': string;
      CPI: string;
      CAPE: string;
    }

    interface ProcessedData {
      year: number;
      equityNominal: number;
      equityReal: number;
      bondNominal: number;
      bondReal: number;
      inflationRate: number;
      peRatio: number;
      dividendYield: number;
    }

    const processedData = ieData.map((row: IEDataRow): ProcessedData => {
      const year = Math.floor(Number(row.Date));
      const price = Number(row.P);
      const dividend = Number(row.D);
      const bondRate = Number(row['Rate GS10']);
      const cpi = Number(row.CPI);

      return {
        year,
        equityNominal: price,
        equityReal: price / cpi * 100,
        bondNominal: bondRate,
        bondReal: bondRate - ((cpi - Number(row.CPI)) / Number(row.CPI)) * 100,
        inflationRate: ((cpi - Number(row.CPI)) / Number(row.CPI)) * 100,
        peRatio: Number(row.CAPE),
        dividendYield: (dividend * 12) / price,
      };
    }).filter((data: ProcessedData) => 
      Object.values(data).every((val: number) => isFinite(val))
    );

    console.log('Loading data into database...');
    for (const data of processedData) {
      await prisma.historicalData.upsert({
        where: { year: data.year },
        create: data,
        update: data,
      });
    }

    const count = await prisma.historicalData.count();
    console.log(`Successfully loaded ${count} records`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
