# nextFire Calculator Documentation

## Overview
Welcome to the nextFire Calculator documentation! This modern FIRE (Financial Independence, Retire Early) planning tool helps users simulate retirement scenarios using historical market data from 1871 to present. Built with Next.js, it features a local-first architecture for privacy and powerful financial calculations.

## Key Features

### 1. Retirement Simulations
- Historical cycle simulations (1871-present)
- Monte Carlo projections
- Fixed-rate calculations
- Multiple withdrawal strategies:
  - Fixed withdrawals
  - Variable spending
  - Percentage of portfolio
  - VPW (Variable Percentage Withdrawal)

### 2. Portfolio Management
- Asset allocation planning
- Custom income/expense streams
- Tax considerations
- Inflation adjustments

### 3. Data Visualization
- Interactive portfolio projections
- Success rate analysis
- Scenario comparisons
- Exportable charts and data

## Technical Stack

### Core Technologies
- **Frontend:** Next.js with TypeScript
- **UI Components:** shadcn/ui and Tailwind CSS
- **Data Visualization:** Recharts/D3.js
- **Database:** Local SQLite with Prisma ORM
- **Historical Data:** Shiller dataset (1871-present)

## Documentation Sections

### 1. User Interface & Design
- [UI/UX Guide](ui/README.md) - Design principles and patterns
- [Component Library](ui/components.md) - shadcn/ui components and usage
- [Design System](ui/design-system.md) - Visual language and tokens
- [Layout Specifications](ui/layouts.md) - Responsive design guidelines

### 2. Feature Specifications
- [User Stories](features/user-stories.md) - User-centric scenarios
- [Requirements](features/requirements.md) - Functional and non-functional specs
- [Testing Guidelines](features/testing.md) - Testing strategies and practices

### 3. Architecture & Implementation
- [Project Architecture](architecture/README.md) - System design and components
- [Technical Stack](architecture/tech-stack.md) - Technology choices
- [API Reference](architecture/api-reference.md) - Next.js API routes
- [Database Design](architecture/database.md) - SQLite schema and Prisma models

### 4. Security & Data Management
- [Security Overview](security/README.md) - Security principles
- [Local Data Access](security/auth-implementation.md) - Data handling
- [Data Management](security/user-management.md) - Scenario management

### 5. Development
- [Development Guide](development/README.md) - Setup and workflows
- [Workflow Guide](development/workflow.md) - Development processes
- [Best Practices](development/best-practices.md) - Coding standards

## Getting Started

### 1. Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/nextfire.git
cd nextfire

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Load historical data
npm run load-historical-data

# Start development server
npm run dev
```

### 2. Project Structure
```
nextFire/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/             # Core utilities
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── public/             # Static assets
└── tests/              # Test files
```

## Core Features Implementation

### 1. Simulation Engine
The calculator uses historical market data to simulate retirement scenarios:
- Historical cycles from 1871 to present
- Monte Carlo simulations for randomized scenarios
- Customizable withdrawal strategies
- Inflation-adjusted calculations

### 2. Data Management
- Local SQLite database for scenario storage
- Historical market data from Shiller dataset
- Efficient data querying with Prisma ORM
- Data export/import capabilities

### 3. User Interface
- Clean, modern interface with shadcn/ui
- Responsive design with Tailwind CSS
- Interactive charts with Recharts/D3.js
- Accessible form controls

## Contributing

### Documentation Updates
1. Review existing documentation
2. Follow established format
3. Update relevant sections
4. Submit changes for review

### Code Contributions
1. Follow TypeScript standards
2. Maintain test coverage
3. Update documentation
4. Submit pull requests

## Best Practices

### Development Standards
- Use TypeScript for type safety
- Follow React best practices
- Write comprehensive tests
- Document code changes

### Financial Calculations
- Validate all inputs
- Handle edge cases
- Document assumptions
- Test with known scenarios

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Recharts Docs](https://recharts.org)

### Tools
- VS Code with recommended extensions
- Prisma Studio for database management
- React Developer Tools
- Chrome DevTools

Remember: The nextFire Calculator handles critical financial planning calculations. Always maintain high standards for accuracy, testing, and documentation.
