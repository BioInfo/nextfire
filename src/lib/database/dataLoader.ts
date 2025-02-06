import fs from 'fs/promises';
import path from 'path';
import { prisma } from './prisma';
import axios from 'axios';

interface FREDData {
  date: string;        // Date in YYYY-MM-DD format
  value: number;       // Value for the series
}

interface ProcessedData {
  year: number;
  equityNominal: number;
  equityReal: number;
  bondNominal: number;
  bondReal: number;
  inflationRate: number;
}

async function fetchFREDSeries(series: string): Promise<FREDData[]> {
  const FRED_API_KEY = process.env.FRED_API_KEY;
  if (!FRED_API_KEY) {
    throw new Error('FRED_API_KEY environment variable is required');
  }

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_API_KEY}&file_type=json`;
  
  interface FREDObservation {
    date: string;
    value: string;
  }

  try {
    const response = await axios.get<{ observations: FREDObservation[] }>(url);
    return response.data.observations.map((obs) => ({
      date: obs.date,
      value: parseFloat(obs.value)
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch FRED data for ${series}: ${error.message}`);
    }
    throw error;
  }
}

export async function downloadShillerData(): Promise<string> {
  const SHILLER_URL = 'http://www.econ.yale.edu/~shiller/data/ie_data.xls';
  const DATA_DIR = path.join(process.cwd(), 'data');
  const XLS_PATH = path.join(DATA_DIR, 'shiller_data.xls');
  const CSV_PATH = path.join(DATA_DIR, 'shiller_data.csv');

  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Download XLS file
    console.log('Downloading Shiller data...');
    const response = await axios.get(SHILLER_URL, {
      responseType: 'arraybuffer',
      timeout: 10000 // 10 second timeout
    });

    // Save XLS file
    await fs.writeFile(XLS_PATH, response.data);
    console.log('Downloaded XLS file successfully');

    // Convert XLS to CSV
    console.log('Converting XLS to CSV...');
    const workbook = XLSX.read(response.data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Get worksheet range
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    console.log('\nScanning worksheet cells:');
    let headerRowIndex = -1;
    let headers: string[] = [];
    
    // Scan through first column (A) looking for "Date" cell
    // Search deeper in the file (up to row 50) to find the actual data headers
    for (let r = range.s.r; r <= Math.min(range.e.r, 50); r++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c: 0 });
      const cell = worksheet[cellAddress];
      
      if (cell) {
        const cellValue = cell.v?.toString() || '';
        console.log(`Row ${r + 1}, Column A:`, cellValue);
        
        // Check for Date header with more flexible matching
        // Look for a cell that contains a year in the format YYYY.MM
        if (cellValue.match(/^\d{4}\.\d{2}/) || cellValue.match(/^(Date|Year)/i)) {
          headerRowIndex = r;
          console.log(`Found header row at index ${r}`);
          
          // Extract headers from this row
          headers = [];
          for (let c = 0; c <= range.e.c; c++) {
            const headerCell = worksheet[XLSX.utils.encode_cell({ r, c })];
            if (headerCell && headerCell.v) {
              // Clean up header names
              const headerName = headerCell.v.toString().trim();
              if (headerName) {
                headers.push(headerName);
                console.log(`  Column ${String.fromCharCode(65 + c)}:`, headerName);
              }
            }
          }
          
          // Verify we have the required headers
          const requiredHeaders = ['Date', 'P', 'D', 'E', 'CPI', 'GS10'];
          const hasRequiredHeaders = requiredHeaders.every(header => 
            headers.some(h => h.includes(header)));
          
          if (hasRequiredHeaders) {
            console.log('Found all required headers');
            break;
          } else {
            console.log('Missing some required headers, continuing search...');
            headerRowIndex = -1;
            headers = [];
          }
        }
      }
    }
    
    if (headerRowIndex === -1) {
      throw new Error('Could not find header row starting with "Date"');
    }
    
    console.log('\nFound headers:', headers);
    
    // Extract data rows using the headers
    const data: string[][] = [];
    for (let r = headerRowIndex + 1; r <= range.e.r; r++) {
      const row: string[] = [];
      let hasData = false;
      
      for (let c = 0; c <= range.e.c; c++) {
        const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
        const value = cell ? cell.v?.toString() || '' : '';
        row.push(value);
        if (value) hasData = true;
      }
      
      if (hasData) {
        data.push(row);
      }
    }
    
    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell =>
        cell ? `"${cell.replace(/"/g, '""')}"` : ''
      ).join(','))
    ].join('\n');

    // Write CSV file
    await fs.writeFile(CSV_PATH, csvContent);
    console.log('Converted to CSV successfully');

    // Clean up XLS file
    await fs.unlink(XLS_PATH);

    return CSV_PATH;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to download Shiller data: ${error.message}`);
    }
    throw new Error(`Error processing Shiller data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processHistoricalData(): Promise<ProcessedData[]> {
  // Fetch required data series from FRED
  const [sp500, cpi, bonds] = await Promise.all([
    fetchFREDSeries('SP500'),          // S&P 500
    fetchFREDSeries('CPIAUCSL'),       // Consumer Price Index
    fetchFREDSeries('GS10')            // 10-Year Treasury Rate
  ]);

  // Process data by year
  const yearlyData = new Map<number, ProcessedData>();
  let prevCPI = null;

  // Process CPI data first to calculate inflation rates
  for (let i = 0; i < cpi.length; i++) {
    const date = new Date(cpi[i].date);
    const year = date.getFullYear();
    const cpiValue = cpi[i].value;

    if (prevCPI !== null) {
      const inflationRate = ((cpiValue - prevCPI) / prevCPI) * 100;
      
      yearlyData.set(year, {
        year,
        equityNominal: 0,
        equityReal: 0,
        bondNominal: 0,
        bondReal: 0,
        inflationRate
      });
    }

    prevCPI = cpiValue;
  }

  // Process S&P 500 data
  for (let i = 0; i < sp500.length - 1; i++) {
    const date = new Date(sp500[i].date);
    const year = date.getFullYear();
    const data = yearlyData.get(year);

    if (data) {
      const currentPrice = sp500[i].value;
      const nextPrice = sp500[i + 1].value;
      
      // Calculate nominal return (assuming 2% dividend yield as historical average)
      const estimatedDividend = currentPrice * 0.02;
      data.equityNominal = ((nextPrice - currentPrice + estimatedDividend) / currentPrice) * 100;
      data.equityReal = data.equityNominal - data.inflationRate;
    }
  }

  // Process bond data
  for (const bond of bonds) {
    const date = new Date(bond.date);
    const year = date.getFullYear();
    const data = yearlyData.get(year);

    if (data) {
      data.bondNominal = bond.value;
      data.bondReal = bond.value - data.inflationRate;
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

  return processed;
}

export async function loadHistoricalData(): Promise<void> {
  try {
    console.log('Starting historical data load from FRED...');
    
    // Process data from FRED
    const processedData = await processHistoricalData();

    console.log(`Processed ${processedData.length} years of data`);

    // Import to database
    console.log('Importing to database...');
    
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