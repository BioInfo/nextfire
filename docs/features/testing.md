# Testing Guidelines - nextFire Calculator

## Overview
This document outlines the comprehensive testing strategy for the nextFire Calculator, ensuring accuracy of financial calculations, reliability of data processing, and proper functionality of the application.

## Current Testing Status

### Completed
- [x] Basic test infrastructure setup
- [x] Unit tests for core calculations
- [x] FRED API integration tests
- [x] Database operation tests
- [x] Initial component tests

### In Progress
- [ ] Shiller data validation tests
- [ ] Data merging verification
- [ ] Enhanced UI component testing
- [ ] Performance benchmarking
- [ ] E2E test implementation

## Testing Pyramid

### 1. Unit Tests
- **Framework:** Jest with React Testing Library
- **Coverage Areas:**
  - Financial calculations
  - Data processing functions
  - UI components
  - Utility functions
  - Type validations

#### Example Unit Tests
```typescript
describe('Historical Data Processing', () => {
  test('correctly processes FRED API data', () => {
    const rawData = mockFREDData();
    const processed = processFREDData(rawData);
    expect(processed).toMatchSnapshot();
  });

  test('validates Shiller data format', () => {
    const rawData = mockShillerData();
    expect(() => validateShillerData(rawData)).not.toThrow();
  });
});

describe('Portfolio Calculations', () => {
  test('calculates compound growth accurately', () => {
    const initial = 100000;
    const rate = 0.07;
    const years = 30;
    expect(calculateCompoundGrowth(initial, rate, years))
      .toBeCloseTo(761225.50, 2);
  });
});
```

### 2. Integration Tests
- **Focus:** Component interactions and data flow
- **Key Areas:**
  - Data pipeline integration
  - Database operations
  - API interactions
  - State management
  - Form submissions

#### Example Integration Tests
```typescript
describe('Data Integration', () => {
  it('successfully merges FRED and Shiller data', async () => {
    const fredData = await loadFREDData();
    const shillerData = await loadShillerData();
    const merged = await mergeHistoricalData(fredData, shillerData);
    
    expect(merged).toMatchSchema(historicalDataSchema);
    expect(merged.length).toBeGreaterThan(0);
    expect(merged[0].year).toBe(1871);
  });
});
```

### 3. End-to-End Tests
- **Framework:** Playwright
- **Coverage:**
  - Complete user workflows
  - Data visualization
  - Form interactions
  - Error handling
  - Browser compatibility

## Specialized Testing Areas

### 1. Data Processing Tests
```typescript
describe('Historical Data Pipeline', () => {
  test('handles missing data points', () => {
    const data = mockDataWithGaps();
    const processed = processHistoricalData(data);
    expect(processed.gaps).toEqual([]);
  });

  test('validates data consistency', () => {
    const data = mockHistoricalData();
    const validation = validateDataConsistency(data);
    expect(validation.isValid).toBe(true);
  });
});
```

### 2. Financial Calculation Tests
```typescript
describe('Simulation Engine', () => {
  test('calculates success rates accurately', () => {
    const portfolio = createTestPortfolio();
    const results = runSimulation(portfolio);
    expect(results.successRate).toBeCloseTo(0.95, 2);
  });

  test('handles extreme market conditions', () => {
    const crashScenario = loadHistoricalCrash();
    const results = runSimulation(crashScenario);
    expect(results.worstCase).toBeDefined();
  });
});
```

### 3. UI Component Tests
```typescript
describe('Portfolio Form', () => {
  test('validates input correctly', async () => {
    render(<PortfolioForm />);
    
    await userEvent.type(
      screen.getByLabelText('Portfolio Value'),
      'invalid'
    );
    
    expect(screen.getByText('Must be a number'))
      .toBeInTheDocument();
  });
});
```

## Performance Testing

### 1. Data Processing Performance
```typescript
describe('Performance', () => {
  test('processes large datasets efficiently', async () => {
    const startTime = performance.now();
    await processHistoricalData(largeDataset);
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(1000);
  });
});
```

### 2. Simulation Performance
```typescript
describe('Simulation Performance', () => {
  test('completes calculations within time limit', () => {
    const startTime = performance.now();
    const results = runFullSimulation(testScenario);
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(2000);
  });
});
```

## Test Environment Setup

### Development Environment
```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

// jest.setup.ts
import '@testing-library/jest-dom';
import { setupTestDatabase } from './testUtils';

beforeAll(async () => {
  await setupTestDatabase();
});
```

## Testing Guidelines

### 1. Data Testing
- Validate data integrity
- Test edge cases
- Verify calculations
- Check data consistency

### 2. Component Testing
- Test user interactions
- Verify state updates
- Check accessibility
- Test error states

### 3. Integration Testing
- Test data flow
- Verify API interactions
- Check state management
- Test error handling

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Run E2E Tests
        run: npm run test:e2e
```

## Quality Metrics

### Coverage Goals
- Unit Tests: 90%+
- Integration Tests: 80%+
- E2E Tests: Key workflows
- Performance Tests: Critical paths

### Performance Targets
- Data Processing: <1s
- Simulation Run: <2s
- UI Interactions: <100ms
- API Responses: <200ms

## Future Improvements

### Planned Enhancements
1. Visual regression testing
2. Automated performance monitoring
3. Enhanced error scenario testing
4. Cross-browser testing
5. Accessibility testing suite

Remember: Testing is critical for ensuring reliable financial calculations and data processing. Maintain high test coverage and regularly review test effectiveness.
