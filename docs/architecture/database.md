# Database Design - nextFire Calculator

## Overview
This document details the SQLite database architecture and Prisma schema design for the nextFire Calculator. The application uses a local SQLite database for storing historical market data and user scenarios, with Prisma ORM for type-safe database access.

## Database Architecture

### Core Components
- **SQLite Database:** Local storage for all application data
- **Prisma ORM:** Type-safe database access and schema management
- **Migration System:** Prisma-based schema versioning
- **Data Loader:** Scripts for historical data processing

## Schema Design

### Prisma Schema
```prisma
// schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./nextfire.db"
}

generator client {
  provider = "prisma-client-js"
}

// Historical market data
model HistoricalData {
  id            Int      @id @default(autoincrement())
  year          Int      @unique
  equityNominal Float    // Nominal stock market returns
  equityReal    Float    // Real (inflation-adjusted) returns
  bondNominal   Float    // Nominal bond returns
  bondReal      Float    // Real bond returns
  inflationRate Float    // Annual inflation rate
  goldReturn    Float?   // Optional gold returns
  cashReturn    Float?   // Optional cash/treasury returns
  
  @@index([year])
}

// User scenarios
model UserScenario {
  id          String   @id @default(uuid())
  name        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Core parameters
  portfolioValue     Float
  annualSpending     Float
  withdrawalStrategy String    // Fixed, Variable, VPW, etc.
  
  // Asset allocation
  stockAllocation    Float
  bondAllocation     Float
  goldAllocation     Float?
  cashAllocation     Float?
  
  // Additional settings
  taxRate           Float?
  inflationAdjusted Boolean @default(true)
  
  // Simulation parameters stored as JSON
  simulationParams Json
  
  // Custom streams (income/expenses)
  customStreams    CustomStream[]
  
  // Results cache
  simulationResults SimulationResult[]
}

// Custom income/expense streams
model CustomStream {
  id            String   @id @default(uuid())
  scenarioId    String
  scenario      UserScenario @relation(fields: [scenarioId], references: [id])
  
  name          String
  type          String    // "income" or "expense"
  amount        Float
  frequency     String    // "monthly", "annual", etc.
  startDate     DateTime
  endDate       DateTime?
  
  inflationAdjusted Boolean @default(true)
  
  @@index([scenarioId])
}

// Cached simulation results
model SimulationResult {
  id          String   @id @default(uuid())
  scenarioId  String
  scenario    UserScenario @relation(fields: [scenarioId], references: [id])
  
  type        String    // "historical", "monteCarlo", "fixed"
  createdAt   DateTime @default(now())
  
  // Results stored as JSON
  results     Json
  
  @@index([scenarioId])
}
```

## Data Management

### Historical Data Loading
```typescript
// data-loader.ts
import { PrismaClient } from '@prisma/client';
import { parseCSV } from './utils';

export async function loadHistoricalData() {
  const prisma = new PrismaClient();
  const data = await parseCSV('shiller_data.csv');
  
  await prisma.historicalData.createMany({
    data: data.map(row => ({
      year: parseInt(row.year),
      equityNominal: parseFloat(row.stockReturn),
      equityReal: parseFloat(row.stockReturnReal),
      bondNominal: parseFloat(row.bondYield),
      bondReal: parseFloat(row.bondYieldReal),
      inflationRate: parseFloat(row.inflation)
    }))
  });
}
```

### Query Optimization
```typescript
// Example optimized queries
async function getHistoricalCycles(startYear: number, duration: number) {
  return await prisma.historicalData.findMany({
    where: {
      year: {
        gte: startYear,
        lte: startYear + duration
      }
    },
    orderBy: {
      year: 'asc'
    }
  });
}

async function getUserScenarios() {
  return await prisma.userScenario.findMany({
    include: {
      customStreams: true,
      simulationResults: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  });
}
```

## Performance Optimization

### Indexing Strategy
- Year-based indexing for historical data
- Scenario ID indexing for related data
- Composite indexes for common query patterns

### Caching Considerations
- Cache simulation results for quick retrieval
- Store complex calculations in JSON fields
- Implement proper cache invalidation

## Data Migration

### Initial Setup
```bash
# Initialize database with historical data
npx prisma migrate dev --name init
npx ts-node scripts/load-historical-data.ts
```

### Schema Updates
```bash
# Create and apply new migrations
npx prisma migrate dev --name add_custom_streams
```

## Best Practices

### Development Guidelines
- Use Prisma migrations for schema changes
- Maintain type safety with Prisma Client
- Document all schema modifications
- Include seed data for development

### Data Integrity
- Validate inputs before storage
- Implement proper error handling
- Maintain data consistency
- Regular integrity checks

### Security Measures
- Local-only database access
- Input sanitization
- No sensitive data storage
- Regular backups

## Maintenance

### Database Health
- Regular vacuum operations
- Index optimization
- Data validation checks
- Performance monitoring

### Backup Strategy
- Regular SQLite database backups
- Export functionality for user scenarios
- Version control for schema changes

Remember: The database is local to each user's installation, so focus on performance and data integrity rather than multi-user concerns.
