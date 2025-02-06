# Development Guide - nextFire Calculator

## Overview
This guide provides comprehensive setup instructions and development guidelines for the nextFire Calculator, a Next.js-based FIRE planning tool with local-first architecture.

## Quick Start

### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/nextfire.git
cd nextfire

# Install dependencies
npm install

# Setup database and load historical data
npx prisma generate
npx prisma db push
npm run load-historical-data

# Start development server
npm run dev
```

### 2. Required Tools
- Node.js (v18+ LTS recommended)
- Git
- VS Code with recommended extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

### 3. Environment Configuration
```env
# .env.local
NODE_ENV=development
DATABASE_URL="file:./nextfire.db"
```

## Project Structure
```
nextFire/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # Context providers
│   ├── components/            # React components
│   │   ├── forms/            # Input forms
│   │   ├── charts/           # Data visualization
│   │   └── ui/              # shadcn/ui components
│   ├── lib/                  # Core utilities
│   │   ├── simulation/      # Simulation engine
│   │   ├── database/        # Prisma client
│   │   └── utils/           # Helper functions
│   └── types/               # TypeScript definitions
├── prisma/                  # Database schema
│   ├── schema.prisma       # Prisma schema
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── tests/                 # Test files
    ├── unit/             # Unit tests
    └── integration/      # Integration tests
```

## Core Features Implementation

### 1. Simulation Engine
```typescript
// src/lib/simulation/historical.ts
export class HistoricalSimulation {
  constructor(private readonly prisma: PrismaClient) {}

  async runSimulation(params: SimulationParams): Promise<SimulationResult> {
    // Implementation
  }
}

// Usage
const simulation = new HistoricalSimulation(prisma);
const results = await simulation.runSimulation({
  portfolioValue: 1000000,
  annualSpending: 40000,
  // ... other parameters
});
```

### 2. Data Visualization
```typescript
// src/components/charts/PortfolioChart.tsx
import { LineChart } from 'recharts';

export const PortfolioChart: React.FC<{
  data: SimulationResult;
  height?: number;
}> = ({ data, height = 400 }) => {
  // Implementation
};
```

### 3. Database Operations
```typescript
// src/lib/database/scenarios.ts
export const scenarioOperations = {
  async save(scenario: SimulationParams): Promise<string> {
    return await prisma.userScenario.create({
      data: scenario
    });
  }
};
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/monte-carlo-simulation

# Run tests in watch mode
npm test -- --watch

# Check types
npm run type-check

# Format code
npm run format
```

### 2. Database Management
```bash
# Create migration
npx prisma migrate dev --name add_custom_streams

# Reset database (development only)
npx prisma migrate reset

# Update client
npx prisma generate
```

### 3. Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- simulation.test.ts

# Run with coverage
npm test -- --coverage
```

## Common Tasks

### 1. Adding a New Component
1. Create component file in appropriate directory
2. Implement component with TypeScript
3. Add tests
4. Update documentation if needed

### 2. Implementing New Features
1. Review requirements in PRD
2. Create feature branch
3. Implement core functionality
4. Add tests
5. Update documentation
6. Submit pull request

### 3. Debugging
- Use Chrome DevTools for React debugging
- Use VS Code debugger for Node.js
- Check browser console for errors
- Verify database queries with Prisma Studio

## Performance Optimization

### 1. Code Optimization
```typescript
// Memoize expensive calculations
const memoizedCalculation = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Use React.memo for pure components
const MemoizedChart = memo(PortfolioChart);
```

### 2. Database Optimization
```typescript
// Batch operations
await prisma.$transaction([
  prisma.historicalData.createMany({ data: entries }),
  prisma.metadata.update({ data: { lastUpdated: new Date() } })
]);
```

## Troubleshooting

### Common Issues
1. **Database Connection Issues**
   ```bash
   # Verify database file exists
   ls prisma/nextfire.db
   
   # Reset database
   npx prisma migrate reset
   ```

2. **Type Errors**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   
   # Check types
   npm run type-check
   ```

3. **Build Errors**
   ```bash
   # Clean build cache
   rm -rf .next
   npm run build
   ```

## Development Standards

### 1. Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### 2. Testing Requirements
- Unit tests for utilities and hooks
- Integration tests for features
- E2E tests for critical flows
- Maintain test coverage

### 3. Documentation
- Update relevant docs with changes
- Include JSDoc comments
- Document complex algorithms
- Keep README updated

## Support Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

### Tools
- Prisma Studio: `npx prisma studio`
- React DevTools
- Chrome DevTools
- VS Code Debugger

Remember: The nextFire Calculator handles critical financial calculations. Always thoroughly test changes and maintain high code quality standards.
