# Testing Guidelines - nextFire Calculator

## Overview
This document outlines the comprehensive testing strategy for the nextFire Calculator, ensuring accuracy of financial calculations, reliability of data visualizations, and proper functionality of local storage features.

## Testing Pyramid

### 1. Unit Tests
- **Framework:** Jest with React Testing Library
- **Coverage Areas:**
  - Financial calculation functions
  - Withdrawal strategy implementations
  - Data transformation utilities
  - UI component rendering
  - Form validation logic

#### Example Unit Tests
```javascript
describe('Portfolio Calculations', () => {
  test('calculates correct portfolio value with compound interest', () => {
    const initial = 100000;
    const rate = 0.07;
    const years = 30;
    expect(calculateCompoundGrowth(initial, rate, years))
      .toBeCloseTo(761225.50, 2);
  });

  test('implements VPW withdrawal strategy correctly', () => {
    const portfolio = 1000000;
    const age = 65;
    const allocation = { stocks: 0.6, bonds: 0.4 };
    expect(calculateVPWWithdrawal(portfolio, age, allocation))
      .toMatchSnapshot();
  });
});
```

### 2. Integration Tests
- **Framework:** Cypress for component integration
- **Focus Areas:**
  - Data flow between components
  - Chart rendering with real data
  - Local storage operations
  - URL parameter handling

#### Example Integration Tests
```javascript
describe('Scenario Management', () => {
  it('saves and loads scenarios correctly', () => {
    cy.createScenario({
      portfolio: 1000000,
      spending: 40000,
      allocation: { stocks: 0.8, bonds: 0.2 }
    });
    cy.saveScenario();
    cy.loadScenario();
    cy.get('[data-testid="portfolio-value"]')
      .should('have.value', '1000000');
  });
});
```

### 3. End-to-End Tests
- **Framework:** Cypress
- **Test Scenarios:**
  - Complete simulation workflows
  - Scenario comparison features
  - Data export functionality
  - URL sharing capabilities

## Specialized Testing Areas

### 1. Financial Calculation Testing
- **Historical Data Validation**
  - Verify accuracy of loaded historical returns
  - Test inflation adjustments
  - Validate asset class calculations

- **Simulation Engine Testing**
  ```javascript
  describe('Historical Simulation', () => {
    test('correctly processes all historical cycles', () => {
      const cycles = runHistoricalSimulation({
        portfolio: 1000000,
        duration: 30,
        spending: 40000
      });
      expect(cycles.length).toBe(expectedCycles);
      expect(cycles[0].successRate).toBeCloseTo(expectedRate, 2);
    });
  });
  ```

### 2. Data Visualization Testing
- **Chart Rendering**
  - Verify correct data representation
  - Test interactive features
  - Validate responsive behavior

- **Visual Regression Testing**
  ```javascript
  describe('Portfolio Chart', () => {
    it('renders correctly with different datasets', () => {
      cy.mount(<PortfolioChart data={sampleData} />);
      cy.matchImageSnapshot();
    });
  });
  ```

### 3. Local Storage Testing
- **Database Operations**
  - Test scenario saving/loading
  - Verify data persistence
  - Validate migration handling

- **URL Parameter Testing**
  ```javascript
  describe('URL Sharing', () => {
    it('correctly encodes and decodes scenario parameters', () => {
      const scenario = createTestScenario();
      const url = encodeScenarioToURL(scenario);
      const decoded = decodeScenarioFromURL(url);
      expect(decoded).toEqual(scenario);
    });
  });
  ```

## Performance Testing

### 1. Simulation Performance
- **Metrics to Test:**
  - Simulation execution time
  - Memory usage during calculations
  - UI responsiveness during processing

```javascript
describe('Performance', () => {
  test('completes Monte Carlo simulation within time limit', async () => {
    const startTime = performance.now();
    await runMonteCarloSimulation(1000);
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(maxAllowedTime);
  });
});
```

### 2. Chart Performance
- **Areas to Monitor:**
  - Chart rendering speed
  - Interaction responsiveness
  - Memory usage with large datasets

## Accessibility Testing

### 1. Component Accessibility
- Screen reader compatibility
- Keyboard navigation
- ARIA attribute validation

```javascript
describe('Accessibility', () => {
  test('form inputs have proper aria labels', () => {
    render(<PortfolioInput />);
    const input = screen.getByLabelText('Portfolio Value');
    expect(input).toHaveAttribute('aria-label');
  });
});
```

## Test Environment Setup

### 1. Local Development
```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import { setupTestDatabase } from './testUtils';

beforeAll(async () => {
  await setupTestDatabase();
});
```

### 2. CI/CD Integration
- Automated test runs on pull requests
- Performance benchmark tracking
- Coverage reporting

## Best Practices

### 1. Test Data Management
- Use realistic financial data samples
- Maintain consistent test scenarios
- Clean up test data after runs

### 2. Test Organization
```javascript
// Group tests by feature
describe('Withdrawal Strategies', () => {
  describe('Fixed Withdrawal', () => {
    // Fixed withdrawal tests
  });
  
  describe('Variable Withdrawal', () => {
    // Variable withdrawal tests
  });
});
```

### 3. Documentation
- Document test scenarios
- Maintain testing guidelines
- Update test documentation with new features

## Continuous Improvement
- Regular test coverage reviews
- Performance benchmark monitoring
- Test suite optimization
- Integration of user feedback

Remember: Financial calculation accuracy is critical - prioritize thorough testing of all calculation logic and validate results against known good examples.
