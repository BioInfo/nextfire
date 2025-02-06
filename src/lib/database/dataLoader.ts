import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { prisma } from './prisma';

interface RawShillerData {
  Date: string;        // Year in YYYY.MM format
  'P': string;        // Stock Price
  'D': string;        // Dividend
  'E': string;        // Earnings
  'CPI': string;      // Consumer Price Index
  'GS10': string;     // 10-Year Treasury Rate
  'Real Price': string;
  'Real Dividend': string;
  'Real Earnings': string;
}

interface ProcessedData {
  year: number;
  equityNominal: number;
  equityReal: number;
  bondNominal: number;
  bondReal: number;
  inflationRate: number;
}

export async function downloadShillerData(): Promise<string> {
  try {
    // Download from Shiller's website - for now we'll use a local file
    // TODO: Implement actual download from http://www.econ.yale.edu/~shiller/data/ie_data.xls
    const dataPath = path.join(process.cwd(), 'data', 'shiller_data.csv');
    await fs.access(dataPath);
    return dataPath;
  } catch (error) {
    throw new Error('Could not access Shiller data file');
  }
}

export function processShillerData(rawData: RawShillerData[]): ProcessedData[] {
  const processed: ProcessedData[] = [];
  let prevCPI: number | null = null;

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const year = parseInt(row.Date.split('.')[0]);
    const cpi = parseFloat(row.CPI);
    
    // Skip if we don't have enough data
    if (!year || !cpi || isNaN(year) || isNaN(cpi)) continue;

    // Calculate inflation rate
    const inflationRate = prevCPI ? (cpi - prevCPI) / prevCPI : 0;
    prevCPI = cpi;

    // Parse stock price and dividend for total return calculation
    const price = parseFloat(row.P);
    const dividend = parseFloat(row.D);
    const nextPrice = i < rawData.length - 1 ? parseFloat(rawData[i + 1].P) : price;
    
    // Calculate nominal and real returns
    const equityNominal = ((nextPrice - price + dividend) / price) * 100;
    const equityReal = parseFloat(row['Real Price']) || 0;
    
    // Get bond yields
    const bondNominal = parseFloat(row.GS10) || 0;
    const bondReal = bondNominal - inflationRate * 100;

    processed.push({
      year,
      equityNominal,
      equityReal,
      bondNominal,
      bondReal,
      inflationRate: inflationRate * 100 // Convert to percentage
    });
  }

  return processed;
}

export async function loadHistoricalData(): Promise<void> {
  try {
    // Step 1: Get data file
    const dataPath = await downloadShillerData();
    
    // Step 2: Read and parse CSV
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const rawData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as RawShillerData[];

    // Step 3: Process data
    const processedData = processShillerData(rawData);

    // Step 4: Validate data
    if (processedData.length === 0) {
      throw new Error('No valid data was processed');
    }

    // Step 5: Import to database
    console.log(`Importing ${processedData.length} years of historical data...`);
    
    // Clear existing data
    await prisma.historicalData.deleteMany();

    // Import new data
    await prisma.historicalData.createMany({
      data: processedData
    });

    console.log('Historical data import completed successfully');
  } catch (error) {
    console.error('Error loading historical data:', error);
    throw error;
  }
}