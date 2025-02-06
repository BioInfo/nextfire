# nextFire Calculator - Codebase Summary

## Key Components

### Data Processing Layer
- **Data Loader (`src/lib/database/dataLoader.ts`):** 
  - Integrates with FRED API for historical market data
  - Fetches S&P 500, CPI, and Treasury rates
  - Includes error handling and rate limiting
  - Processes and normalizes data for database storage

### Simulation Engine
- **Historical Simulation (`src/lib/simulation/engine.ts` & `types.ts`):**
  - Implements cycle-based portfolio simulations
  - Supports multiple withdrawal strategies:
    - Fixed withdrawals
    - Percentage of portfolio
  - Handles asset allocation and rebalancing
  - Includes inflation adjustments
  - Provides detailed yearly results

### Database Layer
- **Prisma ORM Integration (`src/lib/database/prisma.ts`):**
  - Singleton pattern for database connections
  - Development logging configuration
  - Type-safe database operations

### Testing Infrastructure
- Jest with TypeScript support
- Comprehensive test coverage for:
  - Data processing functions
  - Simulation calculations
  - Database operations
  - Error handling scenarios

## Data Flow
1. Historical data is loaded and processed through dataLoader
2. Processed data is stored in SQLite via Prisma
3. Simulation engine fetches data for calculations
4. Results are computed and returned for visualization

## Dependencies
- Next.js 15.1.6
- Prisma 6.3.1 with SQLite
- CSV parsing utilities
- Jest testing framework
- TypeScript with strict mode

## Recent Changes
- Migration from Shiller dataset to FRED API
- Implementation of historical cycle simulation engine
- Addition of comprehensive project documentation
- Creation of simulation test infrastructure

## Code Organization
```
src/
  ├── lib/
  │   ├── database/
  │   │   ├── prisma.ts      # Database client
  │   │   └── dataLoader.ts  # Data processing
  │   └── simulation/
  │       └── historical.ts  # Simulation logic
  └── types/                 # TypeScript definitions
tests/
  └── unit/
      ├── database/         # Data processing tests
      └── simulation/       # Simulation logic tests
```

## Development Guidelines
1. Maintain strict TypeScript types
2. Add tests for new functionality
3. Follow modular code organization
4. Document significant changes

## Next Steps
1. Implement portfolio value and asset allocation inputs
2. Add visualization components for simulation results
3. Expand withdrawal strategy options
4. Set up continuous integration

## User Feedback Integration
- TBD - Awaiting initial user testing phase

Remember: This is a living document that should be updated as the project evolves.