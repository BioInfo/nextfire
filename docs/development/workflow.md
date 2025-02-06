# Workflow Guide - nextFire Calculator

## Overview
This document outlines the development workflow and processes for the nextFire Calculator project, ensuring consistent, high-quality development of this Next.js-based FIRE planning tool.

## Development Lifecycle

### 1. Planning Phase
- Review financial calculation requirements
- Research historical data sources
- Plan component architecture
- Design database schema
- Document API specifications

### 2. Development Phase

#### Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/nextfire.git

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Load historical data
npm run load-historical-data

# Start development server
npm run dev
```

#### Development Guidelines
- Use TypeScript for all new code
- Follow shadcn/ui component patterns
- Implement tests for financial calculations
- Document complex algorithms
- Maintain type safety with Prisma

### 3. Code Organization

```
nextFire/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── forms/             # Input forms
│   │   ├── charts/            # Data visualization
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── simulation/        # Calculation engine
│   │   ├── database/          # Prisma clients
│   │   └── utils/             # Helper functions
│   └── types/                 # TypeScript definitions
├── prisma/                    # Database schema
└── tests/                    # Test files
```

### 4. Feature Development Process

1. **Initial Setup**
   ```bash
   # Create feature branch
   git checkout -b feature/simulation-engine
   
   # Generate necessary files
   touch src/lib/simulation/historical.ts
   touch src/lib/simulation/monte-carlo.ts
   ```

2. **Implementation**
   ```typescript
   // Example implementation pattern
   export class HistoricalSimulation {
     constructor(private readonly prisma: PrismaClient) {}
   
     async runSimulation(params: SimulationParams): Promise<SimulationResult> {
       // Implementation
     }
   }
   ```

3. **Testing**
   ```typescript
   // Example test pattern
   describe('HistoricalSimulation', () => {
     test('calculates correct success rate', async () => {
       // Test implementation
     });
   });
   ```

### 5. Code Review Process

#### Pull Request Template
```markdown
## Description
[Description of changes]

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Financial Calculation Verification
- [ ] Results match expected outcomes
- [ ] Edge cases considered
- [ ] Historical data properly utilized
```

## Version Control

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features (e.g., `feature/monte-carlo-sim`)
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Commit Guidelines
```bash
# Conventional commits
feat: implement historical simulation engine
fix: correct inflation adjustment calculation
docs: update withdrawal strategy documentation
test: add Monte Carlo simulation tests
```

## Testing Strategy

### 1. Unit Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

### 2. Integration Testing
```bash
# Run integration tests
npm run test:integration

# Run E2E tests
npm run cypress
```

### 3. Performance Testing
```bash
# Run performance benchmarks
npm run benchmark
```

## Documentation

### 1. Code Documentation
```typescript
/**
 * Calculates portfolio success rate using historical data
 * @param portfolio Initial portfolio value
 * @param spending Annual spending amount
 * @param duration Simulation duration in years
 * @returns Success rate as percentage
 */
function calculateSuccessRate(
  portfolio: number,
  spending: number,
  duration: number
): number {
  // Implementation
}
```

### 2. API Documentation
- Maintain OpenAPI/Swagger specs
- Document all API endpoints
- Include request/response examples

## Quality Assurance

### 1. Code Quality
```bash
# Run linter
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

### 2. Performance Monitoring
- Monitor simulation execution time
- Track memory usage
- Optimize database queries
- Profile React components

## Deployment

### 1. Local Build
```bash
# Create production build
npm run build

# Verify build
npm run start
```

### 2. Release Process
1. Update version in package.json
2. Generate changelog
3. Create release branch
4. Run full test suite
5. Build and verify
6. Tag release
7. Merge to main

## Best Practices

### 1. Financial Calculations
- Document all formulas and assumptions
- Include source citations
- Validate against known examples
- Handle edge cases gracefully

### 2. Data Management
- Validate historical data integrity
- Implement proper error handling
- Cache calculation results
- Handle large datasets efficiently

### 3. UI Development
- Follow shadcn/ui patterns
- Maintain responsive design
- Ensure accessibility
- Optimize performance

Remember: The nextFire Calculator handles critical financial calculations, so maintain high standards for accuracy, testing, and documentation throughout the development process.
