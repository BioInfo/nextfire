# nextFire Calculator - Codebase Summary

## Key Components

### Data Processing Layer
- **Data Loader (`src/lib/database/dataLoader.ts`):** 
  - Robust FRED API integration for historical market data
  - Fetches annual percentage changes for:
    - S&P 500 (equity returns)
    - CPI (inflation rates)
    - 10-Year Treasury (bond yields)
  - Enhanced error handling with detailed error messages
  - Transaction-safe database updates
  - Comprehensive data validation and filtering

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
- Enhanced FRED API integration:
  - Switched to annual percentage changes for more accurate returns
  - Added robust error handling and data validation
  - Implemented transactional database updates
  - Created comprehensive FRED data documentation
- Added new documentation in `docs/FRED_DATA.md`
- Improved data processing reliability and error reporting
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