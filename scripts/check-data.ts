#!/usr/bin/env ts-node

import { prisma } from '../src/lib/database/prisma.js';

async function main() {
  try {
    const count = await prisma.historicalData.count();
    console.log(`Found ${count} historical records in database`);
    
    if (count > 0) {
      // Get first and last record to show date range
      const [firstRecord, lastRecord] = await Promise.all([
        prisma.historicalData.findFirst({ orderBy: { year: 'asc' } }),
        prisma.historicalData.findFirst({ orderBy: { year: 'desc' } })
      ]);
      
      console.log(`Data range: ${firstRecord?.year} to ${lastRecord?.year}`);
      console.log('\nSample record:');
      console.log(firstRecord);
    }
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();