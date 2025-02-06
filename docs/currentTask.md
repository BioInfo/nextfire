# Current Development Task - nextFire Calculator

## Current Objectives

1. Portfolio Input Interface
   - Create form components using shadcn/ui
   - Implement portfolio value input
   - Add asset allocation sliders
   - Implement input validation

2. Withdrawal Strategy Configuration
   - Create strategy selection component
   - Implement fixed withdrawal inputs
   - Add percentage-based withdrawal options
   - Create inflation adjustment toggle

3. Results Visualization
   - Implement portfolio balance chart
   - Add success rate visualization
   - Create yearly results table
   - Add export functionality

## Context
We have completed the core simulation engine implementation and historical data integration using the FRED API. The next phase focuses on creating an intuitive user interface for configuring simulations and visualizing results. These tasks align with Phase 1 and Phase 3 of the project roadmap.

## Next Steps

### Portfolio Configuration UI
- [ ] Create portfolio value input component
- [ ] Implement asset allocation slider
- [ ] Add input validation and error messages
- [ ] Create tooltips and help text

### Withdrawal Strategy UI
- [ ] Build strategy selection dropdown
- [ ] Create withdrawal amount input
- [ ] Implement percentage vs fixed toggle
- [ ] Add inflation adjustment options

### Results Visualization
- [ ] Set up chart library integration
- [ ] Create portfolio balance line chart
- [ ] Implement success rate visualization
- [ ] Build yearly results data table

## Dependencies
- Next.js with TypeScript ✓
- shadcn/ui components ✓
- Prisma with SQLite ✓
- Project structure ✓
- Testing framework and configuration ✓

## Technical Considerations
1. Ensure efficient data querying for historical simulations
2. Implement proper error handling for edge cases
3. Maintain type safety throughout the codebase
4. Follow accessibility guidelines for form components

## Testing Requirements
- [x] Unit tests for calculation functions
- [x] Integration tests for data loading
- [ ] Form validation testing
- [ ] Performance testing for data queries

## Next Priority
1. Download and implement actual Shiller dataset download functionality
2. Begin UI development with financial input forms
3. Set up CI/CD pipeline with automated testing