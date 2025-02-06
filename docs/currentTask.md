# Current Development Task - nextFire Calculator

## Current Objectives

1. Historical Data Integration
   - Create data loader script for Shiller dataset
   - Process and validate historical market data
   - Import data into SQLite database

2. Basic Simulation Engine Implementation
   - Complete the historical simulation logic
   - Implement core calculation methods
   - Add basic error handling and validation

3. Financial Input Forms
   - Create form components using shadcn/ui
   - Implement input validation
   - Add tooltips and help text

## Context
These tasks tie into Phase 1: Core Simulation Engine from the project roadmap. We have completed the initial setup and infrastructure, and now need to focus on core functionality.

## Next Steps

### Historical Data Integration
- [ ] Create data processing script in src/lib/database/dataLoader.ts
- [ ] Download and validate Shiller dataset
- [ ] Implement data normalization functions
- [ ] Create database migration for historical data
- [ ] Add data validation tests

### Simulation Engine
- [ ] Complete historical simulation implementation in src/lib/simulation/historical.ts
- [ ] Add portfolio calculation functions
- [ ] Implement withdrawal strategy interfaces
- [ ] Create unit tests for calculations

### UI Development
- [ ] Create financial input form components
- [ ] Add form validation with error messages
- [ ] Implement responsive layout adjustments
- [ ] Add loading states and error handling

## Dependencies
- Next.js with TypeScript ✓
- shadcn/ui components ✓
- Prisma with SQLite ✓
- Project structure ✓

## Technical Considerations
1. Ensure efficient data querying for historical simulations
2. Implement proper error handling for edge cases
3. Maintain type safety throughout the codebase
4. Follow accessibility guidelines for form components

## Testing Requirements
- Unit tests for calculation functions
- Integration tests for data loading
- Form validation testing
- Performance testing for data queries