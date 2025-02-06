#!/usr/bin/env ts-node

import { loadHistoricalData } from '../src/lib/database/dataLoader.js';

async function main() {
  try {
    console.log('Starting historical data load...');
    await loadHistoricalData();
    console.log('Data load completed successfully');
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

main();
