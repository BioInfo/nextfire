import { prisma } from './prisma';
import axios from 'axios';

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
 * Loads historical financial data from FRED into the local database
 * @throws Error if FRED_API_KEY is missing or data loading fails
 */
export async function loadHistoricalData(): Promise<void> {
  try {
    // Check for required environment variables
    if (!process.env.FRED_API_KEY) {
      throw new Error('FRED_API_KEY environment variable is required');
    }

    console.log('Processing historical data from FRED...');
    const processedData = await processHistoricalData();

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
