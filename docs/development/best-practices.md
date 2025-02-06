# Best Practices - nextFire Calculator

## Overview
This document outlines development best practices for the nextFire Calculator, ensuring accurate financial calculations, maintainable code, and a high-quality user experience.

## Code Quality & Standards

### TypeScript Best Practices
```typescript
// Use strict typing
type WithdrawalStrategy = 'fixed' | 'variable' | 'vpw';

interface Portfolio {
  value: number;
  allocation: {
    stocks: number;
    bonds: number;
    gold?: number;
    cash?: number;
  };
}

// Use enums for fixed values
enum SimulationType {
  HISTORICAL = 'historical',
  MONTE_CARLO = 'monteCarlo',
  FIXED_RATE = 'fixedRate'
}

// Implement proper error handling
class SimulationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SimulationError';
  }
}
```

### React Component Standards
```typescript
// Use functional components with proper typing
interface PortfolioChartProps {
  data: SimulationResult[];
  onHover?: (point: DataPoint) => void;
  height?: number;
  showConfidenceBands?: boolean;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data,
  onHover,
  height = 400,
  showConfidenceBands = true
}) => {
  // Implementation
};

// Use hooks effectively
const useSimulation = (params: SimulationParams) => {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Implementation
};
```

## Financial Calculation Standards

### 1. Numerical Precision
```typescript
// Use BigDecimal for critical calculations
import { BigDecimal } from 'big.js';

function calculateCompoundGrowth(
  principal: BigDecimal,
  rate: BigDecimal,
  years: number
): BigDecimal {
  return principal.times(
    BigDecimal(1).plus(rate).pow(years)
  );
}

// Round appropriately for display
function formatCurrency(amount: BigDecimal): string {
  return amount.toFixed(2);
}
```

### 2. Validation Rules
```typescript
const validatePortfolioAllocation = (allocation: {
  [key: string]: number
}): boolean => {
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  return Math.abs(total - 1) < 0.0001; // Allow for minor floating-point differences
};

const validateWithdrawalRate = (rate: number): boolean => {
  return rate > 0 && rate <= 0.2; // Maximum 20% withdrawal rate
};
```

## Database Best Practices

### 1. Prisma Query Optimization
```typescript
// Use include selectively
const getScenarioWithResults = async (id: string) => {
  return await prisma.userScenario.findUnique({
    where: { id },
    include: {
      simulationResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });
};

// Batch operations
const saveHistoricalData = async (data: HistoricalData[]) => {
  await prisma.$transaction(
    data.map(entry => 
      prisma.historicalData.create({ data: entry })
    )
  );
};
```

## Performance Optimization

### 1. Calculation Optimization
```typescript
// Memoize expensive calculations
const memoizedSimulation = useMemo(
  () => runSimulation(params),
  [JSON.stringify(params)]
);

// Use web workers for heavy calculations
const simulationWorker = new Worker(
  new URL('../workers/simulation.ts', import.meta.url)
);
```

### 2. React Performance
```typescript
// Optimize re-renders
const MemoizedChart = memo(PortfolioChart, (prev, next) => {
  return prev.data === next.data && prev.height === next.height;
});

// Use proper key props
{scenarios.map(scenario => (
  <ScenarioCard
    key={scenario.id}
    scenario={scenario}
  />
))}
```

## Error Handling

### 1. API Error Handling
```typescript
// Consistent error responses
interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

// Error handler
const handleApiError = (error: unknown): APIError => {
  if (error instanceof SimulationError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred'
  };
};
```

### 2. UI Error Boundaries
```typescript
class SimulationErrorBoundary extends React.Component<
  PropsWithChildren<unknown>,
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <SimulationErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Testing Standards

### 1. Unit Tests
```typescript
describe('Portfolio Calculations', () => {
  test('correctly calculates success rate', () => {
    const portfolio = 1000000;
    const spending = 40000;
    const results = calculateSuccessRate(portfolio, spending);
    expect(results).toBeCloseTo(0.95, 2);
  });
});
```

### 2. Integration Tests
```typescript
describe('Simulation Flow', () => {
  it('saves and retrieves simulation results', async () => {
    const scenario = await createTestScenario();
    const results = await runSimulation(scenario);
    const saved = await prisma.simulationResult.findFirst({
      where: { scenarioId: scenario.id }
    });
    expect(saved?.results).toEqual(results);
  });
});
```

## Documentation Standards

### 1. Component Documentation
```typescript
/**
 * Displays a portfolio value chart with historical simulation results
 * 
 * @component
 * @example
 * ```tsx
 * <PortfolioChart
 *   data={simulationResults}
 *   height={400}
 *   showConfidenceBands={true}
 * />
 * ```
 */
```

### 2. API Documentation
```typescript
/**
 * Runs a historical simulation using provided parameters
 * 
 * @param params - Simulation parameters
 * @param params.portfolio - Initial portfolio value
 * @param params.spending - Annual spending amount
 * @param params.duration - Simulation duration in years
 * @returns Simulation results including success rate and portfolio values
 * @throws {SimulationError} When parameters are invalid
 */
```

## Security Considerations

### 1. Input Validation
```typescript
const validateSimulationInput = (input: unknown): SimulationParams => {
  const schema = z.object({
    portfolio: z.number().positive(),
    spending: z.number().positive(),
    duration: z.number().int().min(1).max(100)
  });
  
  return schema.parse(input);
};
```

### 2. URL Parameter Handling
```typescript
const encodeScenarioParams = (params: SimulationParams): string => {
  return encodeURIComponent(
    Buffer.from(JSON.stringify(params)).toString('base64')
  );
};
```

Remember: Financial calculations must be precise and well-tested. Always validate inputs, handle edge cases, and document assumptions and methodologies.
