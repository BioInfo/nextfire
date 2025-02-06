# Requirements - nextFire Calculator

## Overview
This document details the requirements for the nextFire Calculator, a modern FIRE planning tool built with Next.js. It outlines both functional and non-functional requirements necessary for development, ensuring a comprehensive and reliable financial planning application.

## Functional Requirements

### 1. Core Simulation Engine

#### Input Collection
- [x] Portfolio value entry
- [x] Asset allocation settings
- [x] Basic input validation
- [ ] Annual spending input
- [ ] Income streams configuration
- [ ] Tax rate specification
- [ ] Variable inputs for:
  - Pre-retirement savings
  - Post-retirement spending strategies
    - Fixed spending
    - Variable spending
    - Percentage-of-portfolio
    - VPW (Variable Percentage Withdrawal)

#### Simulation Modes
- [x] Basic Historical Simulation (1947-present)
  - [x] Single cycle simulation
  - [x] Multiple cycle analysis
  - [x] Success rate calculation
  - [x] Portfolio statistics
- [ ] Enhanced Historical Simulation
  - [ ] Extended data (1871-present)
  - [ ] Custom cycle lengths
  - [ ] Period comparison
- [ ] Monte Carlo Simulation
  - [ ] Randomized trials
  - [ ] Distribution analysis
  - [ ] Confidence intervals
- [ ] Fixed-Rate Projections
  - [ ] User-defined rates
  - [ ] Asset-specific returns

#### Scenario Management
- [x] Basic scenario configuration
- [ ] Save and load functionality
- [ ] Custom income/expense streams
- [ ] Advanced withdrawal strategies
- [ ] Shareable URLs

### 2. Historical Data Integration

#### Data Sources
- [x] FRED API Integration
  - [x] Recent market data
  - [x] Error handling
  - [x] Data validation
- [ ] Shiller Dataset Integration
  - [ ] Historical data (1871-present)
  - [ ] Data processing pipeline
  - [ ] Validation framework
  - [ ] Merge with FRED data

#### Data Management
- [x] SQLite with Prisma integration
- [x] Basic data validation
- [x] Error handling
- [ ] Automated updates
- [ ] Data quality checks
- [ ] Version control
- [ ] Backup mechanisms

### 3. Visualization and Reporting

#### Charts and Graphs
- [ ] Portfolio Balance Charts
  - [ ] Line charts
  - [ ] Confidence bands
  - [ ] Interactive features
- [ ] Analysis Tools
  - [ ] Success rate display
  - [ ] Risk assessment
  - [ ] Performance metrics
- [ ] Data Presentation
  - [ ] Results tables
  - [ ] Custom reports
  - [ ] Export options

#### Dashboard Elements
- [ ] Summary Statistics
  - [ ] Success rates
  - [ ] Portfolio metrics
  - [ ] Risk indicators
- [ ] Comparison Tools
  - [ ] Strategy comparison
  - [ ] Period analysis
  - [ ] Scenario comparison

### 4. User Management and Data Persistence

#### Local Storage
- [x] SQLite database setup
- [x] Prisma ORM integration
- [ ] Scenario persistence
- [ ] Settings management
- [ ] Data export/import

#### Sharing Capabilities
- [ ] URL generation
- [ ] Parameter encoding
- [ ] Import/export system
- [ ] Documentation sharing

## Non-Functional Requirements

### 1. Performance
- [x] Efficient data querying
- [x] Type-safe operations
- [ ] Fast calculations
- [ ] Responsive UI
- [ ] Optimized data loading
- [ ] Caching system

### 2. Scalability
- [x] Modular architecture
- [x] Extensible database schema
- [ ] Plugin system
- [ ] API readiness
- [ ] Feature flags
- [ ] Configuration management

### 3. Security & Privacy
- [x] Local-first architecture
- [x] Data validation
- [x] Error handling
- [ ] Input sanitization
- [ ] Safe URL sharing
- [ ] Data encryption

### 4. Maintainability
- [x] TypeScript implementation
- [x] Code organization
- [x] Documentation structure
- [ ] Testing coverage
- [ ] CI/CD pipeline
- [ ] Monitoring system

### 5. Accessibility
- [x] ARIA attributes
- [x] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] Focus management
- [ ] Error announcements

### 6. Browser Compatibility
- [x] Modern browser support
- [x] Responsive layouts
- [ ] Mobile optimization
- [ ] Touch interactions
- [ ] Offline capabilities
- [ ] Print layouts

## Implementation Priorities

### Current Focus
1. Shiller dataset integration
2. Data processing pipeline
3. Visualization components
4. Withdrawal strategies
5. Testing infrastructure

### Next Phase
1. Monte Carlo simulations
2. Advanced UI features
3. Export capabilities
4. Documentation updates
5. Performance optimization

### Future Considerations
1. Real estate modeling
2. Tax calculations
3. Goal tracking
4. Collaboration features
5. Advanced analytics

## Quality Assurance

### Testing Strategy
- [x] Unit test framework
- [x] Integration tests
- [ ] E2E testing
- [ ] Visual regression
- [ ] Performance testing
- [ ] Security audits

### Monitoring Plan
- [ ] Error tracking
- [ ] Performance metrics
- [ ] Usage analytics
- [ ] User feedback
- [ ] System health
- [ ] Data quality

Remember: These requirements are continuously evolving based on project progress and user feedback. Regular reviews ensure alignment with project goals and user needs.
