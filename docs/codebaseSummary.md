# Codebase Summary - nextFire Calculator

## Key Components

### 1. Project Structure
```
nextFire/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── forms/       # Input forms
│   │   ├── charts/      # Data visualization
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Core utilities
│   │   ├── simulation/  # Simulation engine
│   │   ├── database/    # Prisma client
│   │   └── utils/       # Helper functions
│   └── types/           # TypeScript definitions
├── prisma/              # Database schema
├── public/              # Static assets
└── tests/              # Test files
```

### 2. Core Components
- **Database Layer:**
  - Prisma client setup
  - SQLite configuration
  - Model definitions for scenarios and historical data
- **Simulation Engine:**
  - Historical simulation placeholder
  - Type definitions for calculations
  - Future Monte Carlo support
- **UI Components:**
  - Next.js app router setup
  - shadcn/ui integration
  - Responsive layout structure

## Data Flow

### 1. User Input Flow
```
User Input -> Form Components -> Validation -> 
Simulation Engine -> Database Storage -> 
Results Calculation -> Visualization
```

### 2. Database Operations
```
Historical Data -> SQLite -> 
Prisma Client -> Simulation Engine -> 
Results Storage -> User Interface
```

## External Dependencies

### 1. Core Dependencies
- Next.js 14+
- React 18+
- TypeScript 5+
- Prisma ORM
- shadcn/ui
- Tailwind CSS
- next-themes

### 2. Development Dependencies
- ESLint
- TypeScript compiler
- Prisma CLI
- Testing frameworks (planned)

## Recent Changes

### 1. Initial Setup
- Project initialization with Next.js
- Database schema design
- Basic UI structure
- Component organization

### 2. Infrastructure
- Prisma integration
- shadcn/ui setup
- Project structure creation
- TypeScript configuration

## Active Development Areas

### 1. Current Focus
- Historical data integration
- Basic simulation engine
- Form components
- Data visualization

### 2. Planned Features
- Monte Carlo simulations
- Advanced withdrawal strategies
- Scenario management
- Data export capabilities

## User Feedback Integration
- No user feedback yet - initial development phase

## Related Documentation
- [Project Roadmap](projectRoadmap.md)
- [Current Task](currentTask.md)
- [Technical Stack](architecture/tech-stack.md)
- [Development Guide](development/README.md)

## Notes for Developers
1. Run `npm install` to install dependencies
2. Set up `.env` file with DATABASE_URL
3. Run Prisma migrations with `npx prisma migrate dev`
4. Start development server with `npm run dev`

Remember: This is a living document. Update it as the codebase evolves to maintain accurate documentation of the system's current state.