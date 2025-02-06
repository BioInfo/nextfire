# nextFire Calculator Technical Stack

## Overview

This document outlines the key technology choices and architectural decisions made for the nextFire Calculator project.

## Frontend Tools

### Framework: Next.js 14
- **Justification**: Next.js provides an excellent developer experience, built-in performance optimizations, and server-side rendering capabilities.
- **Key Features Used**:
  - App Router for improved routing and layouts
  - Server Components for optimal performance
  - Built-in TypeScript support with project references
  - API Routes for backend functionality
  - Client Components for interactive UI elements

### UI Components: shadcn/ui
- **Justification**: Provides a collection of accessible, customizable components that follow modern design principles.
- **Benefits**:
  - Consistent design language
  - Excellent accessibility
  - Easy customization
  - Built with Radix UI primitives

### State Management
- React Context for global state
- React Query for server state management
- Local storage for persistence

## Backend Tools

### Database: SQLite with Prisma
- **Justification**: Local-first architecture requires embedded database
- **Benefits**:
  - Zero-config setup
  - File-based storage
  - Full SQL support
  - Excellent TypeScript integration via Prisma

### ORM: Prisma
- Type-safe database access
- Auto-generated TypeScript types
- Migration management
- Query optimization

### Data Sources
- FRED API for historical market data
  - Reliable source of economic data
  - Well-documented API
  - Regular updates

## Testing Stack

### Unit Testing
- Jest for test runner
- React Testing Library for component testing
- MSW for API mocking

### E2E Testing
- Playwright for end-to-end testing
- Coverage reporting via Jest

## Development Tools

### TypeScript Configuration
- Project references for modular organization
- Separate configs for app and scripts
- ESM module support for Node.js scripts
- Strict type checking enabled

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured
- ESLint integration

### Code Quality
- ESLint for static analysis
- Prettier for code formatting
- Husky for git hooks
- Conventional commits

## Deployment

### Local Development
- `npm run dev` for development server
- Hot module replacement enabled
- Environment variables via `.env`

### Production Build
- `npm run build` for production optimization
- Static export capability
- Environment variable validation

## Security Considerations

### Data Privacy
- Local-first architecture ensures user data stays on device
- No external data storage
- API keys secured via environment variables

### API Security
- Rate limiting implemented
- Error handling for API failures
- Data validation on all inputs

## Performance Optimization

### Build Optimization
- Code splitting enabled
- Image optimization via Next.js
- Font optimization

### Runtime Optimization
- Memoization for expensive calculations
- Debounced user inputs
- Cached API responses

## Future Considerations

### Planned Improvements
- PWA support for offline access
- WebAssembly for computation-heavy simulations
- Data export/import functionality

### Scalability
- Current architecture supports future feature additions
- Modular design allows easy component updates
- Database schema designed for extensibility
