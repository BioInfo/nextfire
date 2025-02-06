# nextFire Calculator - Codebase Summary

## Key Components

### Data Processing Layer
- **Data Loader (`src/lib/database/dataLoader.ts`):** 
  - Robust FRED API integration for historical market data
  - Enhanced error handling and validation
  - Transaction-safe database updates
  - Data source abstraction for future Shiller integration
  - Comprehensive data validation pipeline
  - Data merging capabilities
  - Automated update mechanisms

### Simulation Engine
- **Historical Simulation (`src/lib/simulation/engine.ts` & `types.ts`):**
  - Implements cycle-based portfolio simulations
  - Supports multiple withdrawal strategies:
    - Fixed withdrawals
    - Percentage of portfolio
    - Variable spending rules
    - VPW (planned)
  - Handles asset allocation and rebalancing
  - Includes inflation adjustments
  - Provides detailed yearly results
  - Monte Carlo simulation support (planned)

### Database Layer
- **Prisma ORM Integration (`src/lib/database/prisma.ts`):**
  - Singleton pattern for database connections
  - Development logging configuration
  - Type-safe database operations
  - Transaction support
  - Migration management
  - Query optimization
  - Data integrity checks

### UI Components
- **Portfolio Management:**
  - Form components using shadcn/ui
  - Asset allocation controls
  - Input validation
  - State persistence
  - Error handling
  - Accessibility features

- **Visualization (Planned):**
  - Portfolio balance charts
  - Success rate visualization
  - Confidence bands
  - Interactive features
  - Custom reporting

### Testing Infrastructure
- **Unit Tests:**
  - Data processing functions
  - Simulation calculations
  - Database operations
  - Error handling scenarios
  - Financial calculations
  - UI components

- **Integration Tests:**
  - API endpoints
  - Database workflows
  - Data processing pipelines
  - Cross-component interactions

- **E2E Tests:**
  - User workflows
  - Visual regression
  - Performance benchmarks
  - Browser compatibility

## Data Flow
1. Historical data sources:
   - FRED API for recent data
   - Shiller dataset integration (planned)
2. Data processing and validation:
   - Source-specific validation
   - Data normalization
   - Integrity checks
3. Database storage:
   - SQLite via Prisma
   - Transaction safety
   - Data versioning
4. Simulation engine:
   - Historical cycles
   - Monte Carlo projections
   - Custom strategies
5. Results visualization:
   - Interactive charts
   - Detailed analysis
   - Export capabilities

## Dependencies
- Next.js 14+
- Prisma 6.3.1 with SQLite
- shadcn/ui components
- Recharts (planned)
- Jest testing framework
- Playwright for E2E
- TypeScript with strict mode
- ESLint & Prettier
- Husky for git hooks

## Recent Changes
- Enhanced FRED API integration:
  - Switched to annual percentage changes
  - Added robust error handling
  - Implemented data validation pipeline
  - Added transaction support
- Improved portfolio management:
  - Enhanced form components
  - Added validation
  - Implemented state persistence
- Updated documentation:
  - Added API documentation
  - Enhanced development guides
  - Updated testing documentation
- Infrastructure improvements:
  - Enhanced error handling
  - Added logging system
  - Improved type safety

## Code Organization
```
src/
  ├── app/                    # Next.js app router
  │   ├── layout.tsx         # Root layout
  │   ├── page.tsx           # Home page
  │   └── simulation/        # Simulation pages
  ├── components/
  │   ├── forms/             # Input forms
  │   ├── charts/            # Data visualization
  │   └── ui/                # shadcn/ui components
  ├── lib/
  │   ├── database/
  │   │   ├── prisma.ts      # Database client
  │   │   └── dataLoader.ts  # Data processing
  │   ├── simulation/
  │   │   ├── engine.ts      # Simulation logic
  │   │   ├── historical.ts  # Historical calculations
  │   │   └── types.ts       # Type definitions
  │   └── utils/             # Helper functions
  └── types/                 # Global TypeScript types
tests/
  ├── unit/                  # Unit tests
  ├── integration/           # Integration tests
  └── e2e/                   # End-to-end tests
```

## Development Guidelines
1. Maintain strict TypeScript types
2. Add tests for new functionality
3. Follow modular code organization
4. Document significant changes
5. Use conventional commits
6. Ensure accessibility compliance
7. Optimize for performance
8. Handle errors gracefully

## Next Steps
1. Implement Shiller dataset integration
2. Enhance data processing pipeline
3. Add visualization components
4. Expand withdrawal strategies
5. Implement Monte Carlo simulations
6. Add comprehensive testing
7. Set up monitoring system

## User Feedback Integration
- Form validation improvements
- Enhanced error messages
- Better progress indicators
- Improved help documentation
- Accessibility enhancements

Remember: This is a living document that should be updated as the project evolves. Keep it aligned with the current state of the codebase and development priorities.
