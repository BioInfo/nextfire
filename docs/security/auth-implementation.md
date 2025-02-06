# Local Data Access & Sharing Implementation - nextFire Calculator

## Overview
The nextFire Calculator operates as a local-first application without traditional authentication. This document outlines how we handle local data access and secure scenario sharing through URLs.

## Local Data Access

### SQLite Database Access
```typescript
// Database connection utility
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Log queries only in development
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error'] 
    : ['error'],
  
  // Database connection configuration
  datasources: {
    db: {
      url: 'file:./nextfire.db'
    }
  }
});

// Ensure proper database connection handling
const withDatabase = async <T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> => {
  try {
    return await operation(prisma);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new DatabaseError('Failed to access local database');
  }
};
```

### Data Access Controls
```typescript
// Data access utility
const dataAccess = {
  // Ensure data integrity when saving
  async saveScenario(scenario: SimulationParams): Promise<string> {
    return await withDatabase(async (db) => {
      const result = await db.userScenario.create({
        data: {
          ...scenario,
          createdAt: new Date(),
          // Add hash for integrity verification
          hash: await generateDataHash(scenario)
        }
      });
      return result.id;
    });
  },

  // Verify data integrity when loading
  async loadScenario(id: string): Promise<SimulationParams> {
    return await withDatabase(async (db) => {
      const scenario = await db.userScenario.findUnique({
        where: { id }
      });
      
      if (!scenario) {
        throw new NotFoundError('Scenario not found');
      }
      
      // Verify data integrity
      const hash = await generateDataHash(scenario);
      if (hash !== scenario.hash) {
        throw new IntegrityError('Data integrity check failed');
      }
      
      return scenario;
    });
  }
};
```

## URL-Based Sharing

### Parameter Encoding
```typescript
// Secure URL parameter handling
const urlSharing = {
  // Encode scenario parameters for sharing
  encodeScenarioUrl(scenario: SimulationParams): string {
    // Remove any sensitive or unnecessary data
    const shareableData = {
      portfolioValue: scenario.portfolioValue,
      annualSpending: scenario.annualSpending,
      assetAllocation: scenario.assetAllocation,
      withdrawalStrategy: scenario.withdrawalStrategy,
      // Exclude personal notes or other private data
    };

    // Encode and sign data
    const encoded = Buffer
      .from(JSON.stringify(shareableData))
      .toString('base64');
    
    return `${window.location.origin}/share/${encoded}`;
  },

  // Decode and validate shared parameters
  decodeScenarioUrl(encoded: string): SimulationParams {
    try {
      const decoded = JSON.parse(
        Buffer.from(encoded, 'base64').toString()
      );
      
      // Validate decoded data
      return validateSharedScenario(decoded);
    } catch (error) {
      throw new ValidationError('Invalid shared scenario data');
    }
  }
};
```

### Data Validation
```typescript
// Validation schema for shared scenarios
const sharedScenarioSchema = z.object({
  portfolioValue: z.number().positive(),
  annualSpending: z.number().positive(),
  assetAllocation: z.object({
    stocks: z.number().min(0).max(1),
    bonds: z.number().min(0).max(1)
  }),
  withdrawalStrategy: z.object({
    type: z.enum(['fixed', 'variable', 'vpw']),
    rate: z.number().positive()
  })
});

// Validation utility
const validateSharedScenario = (
  data: unknown
): SimulationParams => {
  const result = sharedScenarioSchema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(
      'Invalid scenario parameters',
      result.error
    );
  }
  
  return result.data;
};
```

## Data Integrity

### Hash Generation
```typescript
// Generate hash for data integrity verification
async function generateDataHash(data: any): Promise<string> {
  const serialized = JSON.stringify(data);
  const encoder = new TextEncoder();
  const buffer = encoder.encode(serialized);
  
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    buffer
  );
  
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### Integrity Checking
```typescript
// Verify data integrity
async function verifyDataIntegrity(
  data: any,
  storedHash: string
): Promise<boolean> {
  const currentHash = await generateDataHash(data);
  return currentHash === storedHash;
}
```

## Error Handling

### Custom Errors
```typescript
class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

class IntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IntegrityError';
  }
}
```

## Testing

### Security Tests
```typescript
describe('Data Security', () => {
  test('maintains data integrity', async () => {
    const scenario = createTestScenario();
    const id = await dataAccess.saveScenario(scenario);
    const loaded = await dataAccess.loadScenario(id);
    
    expect(loaded).toEqual(scenario);
  });

  test('validates shared URL parameters', () => {
    const invalidData = {
      portfolioValue: -1000,
      annualSpending: 'invalid'
    };
    
    expect(() => 
      validateSharedScenario(invalidData)
    ).toThrow(ValidationError);
  });
});
```

Remember: While the application doesn't require traditional authentication, maintaining data integrity and secure sharing mechanisms is crucial for protecting user financial information.
