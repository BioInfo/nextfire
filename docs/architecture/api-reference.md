# API Reference - nextFire Calculator

## Overview
This document details the Next.js API routes used in the nextFire Calculator. These routes handle simulation calculations, scenario management, and historical data access, all operating locally through Next.js API routes.

## API Routes Structure
```
pages/api/
├── historical/
│   ├── data.ts         # Historical market data endpoints
│   └── cycles.ts       # Historical cycle calculations
├── scenarios/
│   ├── [id].ts        # Individual scenario operations
│   ├── create.ts      # Create new scenarios
│   └── list.ts        # List saved scenarios
├── simulations/
│   ├── historical.ts  # Historical simulation
│   ├── monte-carlo.ts # Monte Carlo simulation
│   └── fixed-rate.ts  # Fixed rate projections
└── utils/
    └── share.ts       # URL sharing utilities
```

## Endpoints

### Historical Data

#### GET /api/historical/data
Retrieves historical market data for a specified range.

```typescript
// Request
interface HistoricalDataRequest {
  startYear?: number;  // Optional, defaults to 1871
  endYear?: number;    // Optional, defaults to current year
}

// Response
interface HistoricalDataResponse {
  data: {
    year: number;
    equityNominal: number;
    equityReal: number;
    bondNominal: number;
    bondReal: number;
    inflationRate: number;
    goldReturn?: number;
    cashReturn?: number;
  }[];
}
```

### Scenario Management

#### POST /api/scenarios/create
Creates a new simulation scenario.

```typescript
// Request
interface CreateScenarioRequest {
  name: string;
  portfolioValue: number;
  annualSpending: number;
  withdrawalStrategy: string;
  assetAllocation: {
    stocks: number;
    bonds: number;
    gold?: number;
    cash?: number;
  };
  customStreams?: {
    name: string;
    type: 'income' | 'expense';
    amount: number;
    frequency: 'monthly' | 'annual';
    startDate: string;
    endDate?: string;
    inflationAdjusted: boolean;
  }[];
}

// Response
interface CreateScenarioResponse {
  id: string;
  name: string;
  createdAt: string;
}
```

#### GET /api/scenarios/[id]
Retrieves a specific scenario by ID.

```typescript
// Response
interface ScenarioResponse {
  scenario: {
    id: string;
    name: string;
    // ... all scenario properties
  };
  simulationResults?: {
    type: string;
    results: any;
    createdAt: string;
  }[];
}
```

### Simulation Endpoints

#### POST /api/simulations/historical
Runs a historical simulation for a given scenario.

```typescript
// Request
interface HistoricalSimulationRequest {
  scenarioId: string;
  parameters: {
    duration: number;        // Simulation length in years
    startYear?: number;      // Optional starting year
    withdrawalStrategy: {
      type: string;          // 'fixed', 'variable', 'vpw'
      baseAmount: number;
      floor?: number;
      ceiling?: number;
    };
  };
}

// Response
interface HistoricalSimulationResponse {
  successRate: number;
  medianOutcome: number;
  worstCase: {
    endingValue: number;
    startYear: number;
  };
  bestCase: {
    endingValue: number;
    startYear: number;
  };
  cycles: {
    startYear: number;
    endingValue: number;
    yearlyValues: number[];
    withdrawals: number[];
  }[];
}
```

#### POST /api/simulations/monte-carlo
Executes a Monte Carlo simulation.

```typescript
// Request
interface MonteCarloSimulationRequest {
  scenarioId: string;
  parameters: {
    duration: number;
    trials: number;          // Number of simulation runs
    withdrawalStrategy: {
      type: string;
      baseAmount: number;
      floor?: number;
      ceiling?: number;
    };
  };
}

// Response
interface MonteCarloSimulationResponse {
  successRate: number;
  confidenceIntervals: {
    percentile: number;
    values: number[];
  }[];
  trials: {
    endingValue: number;
    yearlyValues: number[];
    withdrawals: number[];
  }[];
}
```

### Utility Endpoints

#### POST /api/utils/share
Generates a shareable URL for a scenario.

```typescript
// Request
interface ShareRequest {
  scenarioId: string;
}

// Response
interface ShareResponse {
  url: string;  // URL with encoded scenario parameters
}
```

## Error Handling

All endpoints follow a standard error response format:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

Common error codes:
- `INVALID_INPUT`: Request validation failed
- `SCENARIO_NOT_FOUND`: Requested scenario doesn't exist
- `SIMULATION_ERROR`: Error during calculation
- `DATABASE_ERROR`: Database operation failed

## API Usage Examples

### Running a Historical Simulation
```typescript
// Example API call
const response = await fetch('/api/simulations/historical', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    scenarioId: 'abc123',
    parameters: {
      duration: 30,
      withdrawalStrategy: {
        type: 'fixed',
        baseAmount: 40000
      }
    }
  })
});

const results = await response.json();
```

### Creating a New Scenario
```typescript
// Example API call
const response = await fetch('/api/scenarios/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Conservative Portfolio',
    portfolioValue: 1000000,
    annualSpending: 40000,
    withdrawalStrategy: 'fixed',
    assetAllocation: {
      stocks: 0.6,
      bonds: 0.4
    }
  })
});

const newScenario = await response.json();
```

## Best Practices

1. **Input Validation**
   - Validate all request parameters
   - Use Zod or similar for runtime type checking
   - Return clear validation error messages

2. **Performance**
   - Cache heavy calculations
   - Use efficient database queries
   - Implement request throttling if needed

3. **Error Handling**
   - Provide meaningful error messages
   - Log errors for debugging
   - Handle edge cases gracefully

Remember: All API routes operate locally within the Next.js application, focusing on performance and data integrity rather than traditional API security concerns.
