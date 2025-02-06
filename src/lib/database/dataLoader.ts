import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

/**
 * Represents a data point from Shiller dataset
 */
interface ShillerData {
  Date: string;          // YYYY.MM format
  P: string;             // Stock price
  D: string;             // Dividend amount
  E: string;             // Earnings
  CPI: string;           // Consumer Price Index
  'Rate GS10': string;   // Long-term interest rate
  'Real Price': string;  // Real (inflation-adjusted) price
  'Real Dividend': string; // Real dividend
  'Real Earnings': string; // Real earnings
  CAPE: string;          // Cyclically adjusted PE ratio
}

/**
 * Represents a single data point from FRED API
 */
interface FREDData {
  date: string;        // Date in YYYY-MM-DD format
  value: number;       // Value for the series
}

/**
 * Represents processed yearly financial data
 */
interface ProcessedData {
  year: number;          // Calendar year
  equityNominal: number; // S&P 500 nominal return (%)
  equityReal: number;    // S&P 500 real return (%)
  bondNominal: number;   // 10-year Treasury nominal yield (%)
  bondReal: number;      // 10-year Treasury real yield (%)
  inflationRate: number; // Annual inflation rate (%)
}

/**
 * Fetches time series data from FRED API
 * @param series - FRED series ID (e.g., 'SP500', 'CPIAUCSL', 'GS10')
 * @param startDate - Start date in YYYY-MM-DD format
 * @param frequency - Data frequency (e.g., 'a' for annual)
 * @returns Array of date-value pairs
 * @throws Error if API key is missing or request fails
 */
async function fetchFREDSeries(series: string, startDate: string = '1871-01-01', frequency: string = 'a'): Promise<FREDData[]> {
  const FRED_API_KEY = process.env.FRED_API_KEY;
  if (!FRED_API_KEY) {
    throw new Error('FRED_API_KEY environment variable is required');
  }

  const url = new URL('https://api.stlouisfed.org/fred/series/observations');
  url.searchParams.append('series_id', series);
  url.searchParams.append('api_key', FRED_API_KEY);
  url.searchParams.append('file_type', 'json');
  url.searchParams.append('observation_start', startDate);
  url.searchParams.append('frequency', frequency);
  // Only use percent change for CPI
  if (series === 'CPIAUCSL') {
    url.searchParams.append('units', 'pc1'); // Percent change from year ago
  }
  
  interface FREDObservation {
    date: string;
    value: string;
  }

  try {
    const response = await axios.get<{ observations: FREDObservation[] }>(url.toString(), {
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status === 200 // Only accept 200 OK
    });

    return response.data.observations
      .filter(obs => obs.value !== '.') // Filter out missing values
      .map((obs) => ({
        date: obs.date,
        value: parseFloat(obs.value)
      }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`FRED API error for ${series}: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error(`Network error fetching ${series}: ${error.message}`);
      }
    }
    throw new Error(`Unexpected error fetching ${series}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Processes raw FRED data into yearly financial metrics
 * @returns Array of processed yearly data
 * @throws Error if data processing fails
 */
async function processHistoricalData(): Promise<ProcessedData[]> {
  try {
    console.log('Fetching data from FRED API...');
    
    // Fetch required data series with specific date range
    const [equityData, cpiData, bondData] = await Promise.all([
      fetchFREDSeries('SP500', '1947-01-01', 'm'),     // S&P 500 Index
      fetchFREDSeries('CPIAUCSL', '1947-01-01', 'm'),  // Consumer Price Index
      fetchFREDSeries('GS10', '1947-01-01', 'm')       // 10-Year Treasury Rate
    ]);

    // Process monthly data to yearly by taking last value of each year
    function getYearlyData(monthlyData: FREDData[]): FREDData[] {
      const yearlyMap = new Map<number, FREDData>();
      monthlyData
        .filter(d => d.value > 0)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach(d => {
          const year = new Date(d.date).getFullYear();
          yearlyMap.set(year, d);
        });
      return Array.from(yearlyMap.values());
    }

    // Convert to yearly data
    const equity = getYearlyData(equityData);
    const cpi = getYearlyData(cpiData);
    const bonds = getYearlyData(bondData);

    console.log(`Processing ${equity.length} equity records, ${cpi.length} CPI records, ${bonds.length} bond records`);

    // Process data by year
    const yearlyData = new Map<number, ProcessedData>();

    // Create a sorted array of unique years from all data sources
    const years = [...new Set([...equity, ...cpi, ...bonds].map(d => new Date(d.date).getFullYear()))].sort();

    // Initialize data for all years
    years.forEach(year => {
      yearlyData.set(year, {
        year,
        equityNominal: 0,
        equityReal: 0,
        bondNominal: 0,
        bondReal: 0,
        inflationRate: 0
      });
    });

    // Process CPI data first to calculate inflation rates
    const sortedCPI = cpi.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 0; i < sortedCPI.length; i++) {
      const point = sortedCPI[i];
      const year = new Date(point.date).getFullYear();
      const data = yearlyData.get(year);
      
      if (data) {
        // CPI data comes as percent change from year ago
        data.inflationRate = point.value;
      }
    }

    // Process equity data to calculate year-over-year returns
    let lastYearValue: number | null = null;

    for (let i = 0; i < equity.length; i++) {
      const point = equity[i];
      const year = new Date(point.date).getFullYear();
      const data = yearlyData.get(year);
      
      if (data) {
        if (i > 0) {
          const previousValue = equity[i - 1].value;
          if (previousValue > 0) {
            // Calculate year-over-year return as percentage change
            const yearReturn = ((point.value - previousValue) / previousValue) * 100;
            // Cap extreme values
            data.equityNominal = Math.max(Math.min(yearReturn, 50), -30);
            data.equityReal = data.equityNominal - data.inflationRate;
          }
        } else {
          // For the first year with data
          data.equityNominal = 8.0; // Historical average nominal return
          data.equityReal = data.equityNominal - data.inflationRate;
        }
      }
    }

    // Process bond data - use yields as total returns
    const sortedBonds = bonds.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const point of sortedBonds) {
      const year = new Date(point.date).getFullYear();
      const data = yearlyData.get(year);
      if (data) {
        data.bondNominal = point.value;
        data.bondReal = data.bondNominal - data.inflationRate;
      }
    }

    // Convert map to array and sort by year
    const processed = Array.from(yearlyData.values())
      .filter(data => 
        isFinite(data.equityNominal) && 
        isFinite(data.equityReal) && 
        isFinite(data.bondNominal) && 
        isFinite(data.bondReal) && 
        isFinite(data.inflationRate)
      )
      .sort((a, b) => a.year - b.year);

    if (processed.length === 0) {
      throw new Error('No valid data could be processed');
    }

    console.log(`Processed ${processed.length} years of data from ${processed[0].year} to ${processed[processed.length - 1].year}`);
    return processed;
  } catch (error) {
    console.error('Error processing historical data:', error);
    throw error;
  }
}

/**
 * Reads and combines split Shiller data files
 */
async function readShillerData(): Promise<string> {
  try {
    console.log('Reading Shiller data files...');
    const dataDir = 'data';
    const filePattern = /^ie_data_part_[a-z]{2}$/;
    
    // Get all data part files
    const files = await fs.readdir(dataDir);
    const dataFiles = files
      .filter(f => filePattern.test(f))
      .sort(); // Ensure files are processed in order
    
    console.log(`Found ${dataFiles.length} data part files`);
    
    // Combine file contents
    let combinedContent = '';
    for (const file of dataFiles) {
      const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
      combinedContent += content;
    }
    
    return combinedContent;
  } catch (error) {
    console.error('Error reading Shiller data:', error);
    throw error;
  }
}

/**
 * Parses combined CSV content into structured data
 */
async function parseShillerData(content: string): Promise<ShillerData[]> {
  // Split content and take only the data section (skip header rows)
  const lines = content.split('\n');
  const dataStartIndex = lines.findIndex(line => line.includes('Date,P,D,E,CPI,'));
  const dataContent = lines.slice(dataStartIndex).join('\n');
  
  const rawData = parse(dataContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    skip_records_with_empty_values: true
  });

  // Debug: log the first row's columns
  if (rawData.length > 0) {
    console.log('Available columns:', Object.keys(rawData[0]));
  }

  // Map columns to our expected format
  return rawData.map((row: Record<string, string>) => {
    // Debug: log the first row's values
    if (row === rawData[0]) {
      console.log('First row values:', row);
    }

    return {
      Date: row.Date,
      P: row.P,
      D: row.D,
      E: row.E,
      CPI: row.CPI,
      'Rate GS10': row['Rate GS10'],
      'Real Price': row.Price, // Use the Price column for real price
      'Real Dividend': row['Real Dividend'],
      'Real Earnings': row['Real Earnings'],
      CAPE: row.CAPE
    };
  });
}

/**
 * Processes Shiller dataset into yearly financial metrics
 */
async function processShillerData(): Promise<ProcessedData[]> {
  try {
    console.log('Processing Shiller dataset...');
    
    // Read and parse data
    const rawContent = await readShillerData();
    const monthlyData = await parseShillerData(rawContent);
    
    console.log(`Loaded ${monthlyData.length} monthly records`);
    
    // Create a map to store yearly data
    const yearlyData = new Map<number, ProcessedData>();
    
    // Process monthly data into yearly records
    for (let i = 0; i < monthlyData.length; i++) {
      const record = monthlyData[i];
      const year = Math.floor(parseFloat(record.Date));
      
      // Skip if we don't have previous year's data for return calculation
      if (i === 0) continue;
      
      const prevRecord = monthlyData[i - 1];
      const prevYear = Math.floor(parseFloat(prevRecord.Date));
      
      // Only process December data for yearly calculations
      const dateStr = record.Date.toString();
      if (!dateStr.includes('.12')) continue;
      
      // Parse numeric values
      const currentPrice = parseFloat(record.P);
      const prevPrice = parseFloat(prevRecord.P);
      const currentReal = parseFloat(record['Real Price']);
      const prevReal = parseFloat(prevRecord['Real Price']);
      const currentCPI = parseFloat(record.CPI);
      const prevCPI = parseFloat(prevRecord.CPI);
      const bondRate = parseFloat(record['Rate GS10']);

      // Skip if any values are invalid
      if ([currentPrice, prevPrice, currentReal, prevReal, currentCPI, prevCPI, bondRate].some(v => !isFinite(v))) {
        console.log('Skipping record due to invalid values:', {
          date: record.Date,
          currentPrice,
          prevPrice,
          currentReal,
          prevReal,
          currentCPI,
          prevCPI,
          bondRate
        });
        continue;
      }

      // Calculate returns
      const nominalReturn = ((currentPrice - prevPrice) / prevPrice) * 100;
      const realReturn = ((currentReal - prevReal) / prevReal) * 100;
      
      // Calculate inflation rate from CPI
      const inflationRate = ((currentCPI - prevCPI) / prevCPI) * 100;
      
      // Get bond data
      const bondNominal = bondRate;
      const bondReal = bondNominal - inflationRate;
      
      yearlyData.set(year, {
        year,
        equityNominal: nominalReturn,
        equityReal: realReturn,
        bondNominal,
        bondReal,
        inflationRate
      });
      
      if (yearlyData.size % 10 === 0) {
        console.log(`Processed ${yearlyData.size} years of data`);
      }
    }

    // Convert map to array and sort by year
    const processed = Array.from(yearlyData.values())
      .filter(data => 
        isFinite(data.equityNominal) && 
        isFinite(data.equityReal) && 
        isFinite(data.bondNominal) && 
        isFinite(data.bondReal) && 
        isFinite(data.inflationRate)
      )
      .sort((a, b) => a.year - b.year);

    if (processed.length === 0) {
      throw new Error('No valid Shiller data could be processed');
    }

    console.log(`Processed ${processed.length} years of Shiller data from ${processed[0].year} to ${processed[processed.length - 1].year}`);
    return processed;
  } catch (error) {
    console.error('Error processing Shiller data:', error);
    throw error;
  }
}

/**
 * Loads historical financial data from FRED and Shiller dataset into the local database
 * @throws Error if data loading fails
 */
export async function loadHistoricalData(): Promise<void> {
  try {
    // Check for required environment variables
    if (!process.env.FRED_API_KEY) {
      throw new Error('FRED_API_KEY environment variable is required');
    }

    let processedData: ProcessedData[] = [];
    
    // Try loading Shiller data first
    try {
      console.log('Processing Shiller dataset...');
      processedData = await processShillerData();
    } catch (error) {
      console.warn('Failed to load Shiller data, falling back to FRED:', error);
      
      // Fall back to FRED if Shiller data fails
      if (process.env.FRED_API_KEY) {
        console.log('Processing historical data from FRED...');
        processedData = await processHistoricalData();
      } else {
        throw new Error('No data sources available: Shiller data failed and FRED_API_KEY is missing');
      }
    }

    // Batch insert/update data
    console.log('Loading data into database...');
    await prisma.$transaction(async (tx) => {
      for (const data of processedData) {
        await tx.historicalData.upsert({
          where: { year: data.year },
          create: data,
          update: data
        });
      }
    });

    const count = await prisma.historicalData.count();
    const range = await prisma.historicalData.aggregate({
      _min: { year: true },
      _max: { year: true }
    });

    console.log(`Successfully loaded ${count} years of historical data (${range._min.year} to ${range._max.year})`);
  } catch (error) {
    console.error('Error in loadHistoricalData:', error);
    throw error;
  }
}
