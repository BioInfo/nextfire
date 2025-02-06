# Requirements - nextFire Calculator

## Overview
This document details the requirements for the nextFire Calculator, a modern FIRE planning tool built with Next.js. It outlines both functional and non-functional requirements necessary for development, ensuring a comprehensive and reliable financial planning application.

## Functional Requirements

### 1. Core Simulation Engine

#### Input Collection
- [ ] Portfolio value entry
- [ ] Annual spending input
- [ ] Income streams configuration
- [ ] Tax rate specification
- [ ] Asset allocation settings
- [ ] Variable inputs for:
  - Pre-retirement savings
  - Post-retirement spending strategies
    - Fixed spending
    - Variable spending
    - Percentage-of-portfolio
    - VPW (Variable Percentage Withdrawal)

#### Simulation Modes
- [ ] Historical Simulation
  - Use market data from 1871 to present
  - Calculate outcomes for each possible historical cycle
  - Support custom cycle lengths (default 30 years)
- [ ] Monte Carlo Simulation
  - Generate randomized trials using historical distributions
  - Configurable number of simulation runs
- [ ] Fixed-Rate Projections
  - Support user-defined constant return rates
  - Allow separate rates for different asset classes

#### Scenario Management
- [ ] Save and load user scenarios
- [ ] Custom income/expense streams with start/end dates
- [ ] Adjustable withdrawal strategies
  - Floor/ceiling limits for spending
  - Multiple withdrawal models
- [ ] Generate shareable scenario URLs

### 2. Historical Data Integration

#### Data Sources
- [ ] Load and process data from 1871 to present
- [ ] Include:
  - Equity returns (nominal and real)
  - Bond returns (10-year Treasury yields)
  - Inflation rates (CPI data)
  - Optional: Gold prices, cash yields

#### Data Management
- [ ] Store historical data in SQLite via Prisma
- [ ] Support data updates for new years
- [ ] Efficient querying system for simulations

### 3. Visualization and Reporting

#### Charts and Graphs
- [ ] Interactive line charts
- [ ] Histograms for distribution analysis
- [ ] Probability bands visualization
- [ ] Drill-down capabilities for detailed views

#### Dashboard Elements
- [ ] Summary metrics display
  - Success rate
  - Median ending portfolio
  - Worst/best-case scenarios
- [ ] Scenario comparison tools
- [ ] Export functionality
  - PNG image export
  - CSV data download

### 4. User Management and Data Persistence

#### Local Storage
- [ ] SQLite database integration
- [ ] Save/retrieve user scenarios
- [ ] Store historical data locally

#### Sharing Capabilities
- [ ] Generate shareable URLs
- [ ] Encode simulation parameters in URLs
- [ ] Support scenario importing

## Non-Functional Requirements

### 1. Performance
- [ ] Fast simulation processing
  - Optimize database queries
  - Efficient in-memory calculations
- [ ] Responsive UI interactions
  - Quick component rendering
  - Smooth transitions
- [ ] Efficient data loading
  - Lazy loading for large datasets
  - Caching strategies

### 2. Scalability
- [ ] Modular architecture
  - Support for new simulation models
  - Extensible asset class system
- [ ] Flexible data structure
  - Accommodate additional historical data
  - Support new calculation methods
- [ ] API readiness
  - Prepared for future external API integration
  - Expandable data sources

### 3. Security & Privacy
- [ ] Local data storage
  - No external data transmission
  - Secure local database handling
- [ ] Data integrity
  - Validation of user inputs
  - Protection against invalid calculations
- [ ] URL security
  - Safe parameter encoding
  - No sensitive data in URLs

### 4. Maintainability
- [ ] Clean code architecture
  - Separation of concerns
  - Clear module boundaries
- [ ] Comprehensive documentation
  - Code comments
  - API documentation
  - User guides
- [ ] Testing coverage
  - Unit tests
  - Integration tests
  - UI component tests

### 5. Accessibility
- [ ] WCAG 2.1 compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] High contrast support

### 6. Browser Compatibility
- [ ] Support modern browsers
  - Chrome
  - Firefox
  - Safari
  - Edge
- [ ] Responsive design
  - Mobile compatibility
  - Tablet optimization
  - Desktop layouts

## Implementation Considerations

### Development Priorities
1. Core simulation engine functionality
2. Basic UI implementation
3. Data visualization components
4. Local storage integration
5. Advanced features and optimizations

### Risk Mitigation
- Regular testing of calculations
- Validation of historical data
- Performance monitoring
- User feedback integration

### Maintenance Guidelines
- Regular code reviews
- Documentation updates
- Performance optimization
- Security assessments

Remember: These requirements serve as a living document and should be reviewed and updated as the project evolves. Regular stakeholder feedback should be incorporated to ensure the application meets user needs effectively.
