import { SimulationEngine } from '../src/lib/simulation/engine';
import type { SimulationParams } from '../src/lib/simulation/types';

async function main() {
  const engine = new SimulationEngine();

  // Test case: 60/40 portfolio with 4% withdrawal rate
  const params: SimulationParams = {
    portfolio: {
      initialBalance: 1000000,  // $1M initial portfolio
      stockAllocation: 60,      // 60% stocks
      bondAllocation: 40        // 40% bonds
    },
    withdrawalStrategy: {
      type: 'percentage',
      amount: 4,                // 4% withdrawal rate
      adjustForInflation: true
    },
    startYear: 1955,           // Start in 1955
    duration: 30               // 30-year retirement
  };

  try {
    console.log('Running simulation...');
    const result = await engine.runSimulation(params);
    
    console.log('\nSimulation Results:');
    console.log('-------------------');
    console.log(`Success: ${result.success}`);
    console.log(`Final Balance: $${result.finalBalance.toLocaleString()}`);
    console.log(`Lowest Balance: $${result.lowestBalance.toLocaleString()}`);
    console.log(`Highest Balance: $${result.highestBalance.toLocaleString()}`);
    console.log(`Average Return: ${(result.averageReturn * 100).toFixed(2)}%`);
    
    console.log('\nYearly Summary:');
    console.log('Year\tStart Balance\tWithdrawal\tEnd Balance');
    result.yearlyResults.forEach(year => {
      console.log(
        `${year.year}\t$${year.startingBalance.toLocaleString()}\t` +
        `$${year.withdrawal.toLocaleString()}\t$${year.endingBalance.toLocaleString()}`
      );
    });
  } catch (error) {
    console.error('Simulation failed:', error);
  }
}

main();
