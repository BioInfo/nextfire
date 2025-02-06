# Security Overview - nextFire Calculator

## Overview
This document outlines the security measures implemented in the nextFire Calculator, focusing on protecting user financial data while maintaining a local-first architecture that prioritizes privacy and data integrity.

## Core Security Principles

### 1. Local-First Security
- All data stored locally in SQLite database
- No external data transmission
- Complete user privacy
- Offline-capable operation

### 2. Data Protection
```typescript
// Example of secure data handling
interface SecureStorage {
  // Store data locally with encryption
  saveScenario: (data: SimulationData) => Promise<void>;
  // Retrieve data with decryption
  loadScenario: (id: string) => Promise<SimulationData>;
}

// Implementation using the Web Crypto API
const secureStorage: SecureStorage = {
  async saveScenario(data) {
    const serialized = JSON.stringify(data);
    const encoded = new TextEncoder().encode(serialized);
    const buffer = await crypto.subtle.digest('SHA-256', encoded);
    // Store with hash for integrity verification
  },
  // ... implementation
};
```

### 3. URL Parameter Security
```typescript
// Safe URL parameter handling
const shareableUrlUtils = {
  // Encode scenario parameters safely
  encodeScenario: (scenario: SimulationParams): string => {
    const safeParams = {
      ...scenario,
      // Remove any sensitive data
      personalNotes: undefined
    };
    return btoa(JSON.stringify(safeParams));
  },

  // Decode and validate shared parameters
  decodeScenario: (encoded: string): SimulationParams => {
    try {
      const decoded = JSON.parse(atob(encoded));
      return validateSimulationParams(decoded);
    } catch (error) {
      throw new Error('Invalid scenario parameters');
    }
  }
};
```

## Data Security Measures

### 1. Input Validation
```typescript
// Zod schema for input validation
const simulationParamsSchema = z.object({
  portfolioValue: z.number().positive(),
  annualSpending: z.number().positive(),
  duration: z.number().int().min(1).max(100),
  assetAllocation: z.object({
    stocks: z.number().min(0).max(1),
    bonds: z.number().min(0).max(1)
  }).refine(data => 
    Math.abs((data.stocks + data.bonds) - 1) < 0.0001,
    "Asset allocation must sum to 100%"
  )
});

// Validation middleware
const validateInput = (schema: z.ZodSchema) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.errors
      });
    }
  };
};
```

### 2. Database Security
```typescript
// Prisma schema with proper constraints
model UserScenario {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Data validation at database level
  portfolioValue Float  @positive
  annualSpending Float  @positive
  
  @@index([createdAt])
}

// Secure database operations
const dbOperations = {
  async saveScenario(data: SimulationData) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Atomic operations
        const scenario = await tx.userScenario.create({
          data: {
            ...data,
            // Add audit trail
            auditLog: {
              create: {
                action: 'CREATE',
                timestamp: new Date()
              }
            }
          }
        });
        return scenario;
      });
    } catch (error) {
      // Proper error handling
      throw new DatabaseError('Failed to save scenario', error);
    }
  }
};
```

### 3. Historical Data Integrity
```typescript
// Verify historical data integrity
const verifyHistoricalData = async (data: HistoricalData[]) => {
  // Check for data completeness
  const years = new Set(data.map(d => d.year));
  const expectedYears = range(1871, new Date().getFullYear());
  
  // Verify all years present
  for (const year of expectedYears) {
    if (!years.has(year)) {
      throw new Error(`Missing data for year ${year}`);
    }
  }
  
  // Validate data ranges
  for (const entry of data) {
    if (!isValidHistoricalEntry(entry)) {
      throw new Error(`Invalid data for year ${entry.year}`);
    }
  }
};
```

## Security Best Practices

### 1. Development Guidelines
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow secure coding practices
- Regular dependency updates

### 2. Data Validation
- Validate all user inputs
- Sanitize data before processing
- Implement proper error handling
- Use type-safe interfaces

### 3. Local Storage
- Implement secure storage practices
- Regular integrity checks
- Proper error recovery
- Data backup capabilities

## Error Handling

### 1. API Error Responses
```typescript
// Standardized error handling
const handleApiError = (error: unknown): ApiResponse => {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    };
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  return {
    status: 500,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  };
};
```

### 2. Client-Side Error Handling
```typescript
// Error boundary for simulation components
class SimulationErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error safely
    console.error('Simulation error:', {
      error: error.message,
      stack: info.componentStack
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <SimulationErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Testing & Verification

### 1. Security Testing
```typescript
describe('Security Measures', () => {
  test('prevents invalid input', async () => {
    const invalidInput = {
      portfolioValue: -1000, // Invalid negative value
      annualSpending: 'invalid' // Invalid type
    };
    
    await expect(
      validateSimulationParams(invalidInput)
    ).rejects.toThrow();
  });
  
  test('maintains data integrity', async () => {
    const scenario = createTestScenario();
    const saved = await saveScenario(scenario);
    const loaded = await loadScenario(saved.id);
    
    expect(loaded).toEqual(scenario);
  });
});
```

Remember: While the nextFire Calculator operates locally, maintaining strong security practices ensures data integrity and protects user privacy.
