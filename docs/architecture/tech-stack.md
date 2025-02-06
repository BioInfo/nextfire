# Technical Stack - nextFire Calculator

## Overview
This document details the technical stack used in the nextFire Calculator, a modern FIRE planning tool built with Next.js. The stack emphasizes local-first architecture, type safety, and high-performance financial calculations.

## Frontend Technologies

### Core Framework
- **Next.js**
  - React-based framework
  - Server-side rendering capabilities
  - API routes for local calculations
  - File-system based routing
  - TypeScript support

### UI Components & Styling
- **shadcn/ui**
  - Modern, accessible component library
  - Customizable design system
  - Built on Radix UI primitives
  - Consistent theming

- **Tailwind CSS**
  - Utility-first CSS framework
  - Responsive design utilities
  - Custom design token integration
  - JIT (Just-In-Time) compilation

### Data Visualization
- **Primary: Recharts**
  - React-based charting library
  - Responsive charts
  - Customizable components
  - Smooth animations
  - TypeScript support

- **Alternative Options:**
  - **D3.js** for custom visualizations
  - **Plotly.js** for complex financial charts

## Backend Technologies

### Database
- **SQLite**
  - Local-first database
  - ACID compliance
  - Simple deployment
  - No server required

### ORM
- **Prisma**
  - Type-safe database access
  - Schema management
  - Migration system
  - Query optimization

### API Layer
- **Next.js API Routes**
  - Local API endpoints
  - TypeScript support
  - Request validation
  - Error handling

## Development Tools

### Core Tools
- **TypeScript**
  - Static type checking
  - Enhanced IDE support
  - Type-safe development
  - Better code organization

- **ESLint & Prettier**
  - Code style enforcement
  - Automatic formatting
  - Best practices validation

### Testing Framework
- **Jest**
  - Unit testing
  - Snapshot testing
  - Code coverage

- **React Testing Library**
  - Component testing
  - User interaction testing
  - Accessibility testing

- **Cypress**
  - End-to-end testing
  - Component testing
  - Visual regression testing

### Development Environment
- **Node.js**
  - Runtime environment
  - Package management
  - Script execution

- **npm/yarn**
  - Dependency management
  - Script running
  - Package versioning

## Project Structure
```
nextFire/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── public/             # Static assets
└── tests/              # Test files
```

## Key Dependencies

### Production Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "recharts": "^2.9.0",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "prisma": "^5.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "cypress": "^13.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Technology Decisions

### Why Next.js?
- **Server-side Rendering:** Improved initial load performance
- **API Routes:** Simplified backend implementation
- **File-system Routing:** Intuitive page organization
- **Built-in TypeScript Support:** Enhanced type safety
- **Excellent Developer Experience:** Hot reloading, error handling

### Why SQLite + Prisma?
- **Local-first:** No server deployment needed
- **Type Safety:** Prisma provides type-safe database access
- **Simple Setup:** Minimal configuration required
- **Reliable:** ACID compliance for data integrity
- **Portable:** Single file database

### Why shadcn/ui + Tailwind CSS?
- **Modern Design:** Contemporary component library
- **Accessibility:** Built-in accessibility features
- **Customization:** Easy theming and styling
- **Developer Experience:** Excellent documentation
- **Performance:** Small bundle size

### Why Recharts?
- **React Integration:** Native React components
- **Performance:** Efficient rendering
- **Customization:** Flexible styling options
- **TypeScript Support:** Type-safe props
- **Active Community:** Regular updates and support

## Development Workflow

### 1. Local Development
```bash
# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 2. Testing
```bash
# Run unit tests
npm test

# Run E2E tests
npm run cypress

# Check types
npm run type-check
```

### 3. Building
```bash
# Create production build
npm run build

# Start production server
npm start
```

## Performance Considerations

### Frontend
- Code splitting
- Image optimization
- Component lazy loading
- Memoization of calculations

### Data Management
- Efficient database queries
- Result caching
- Batch operations
- Progressive loading

Remember: This tech stack is designed for a local-first application, prioritizing performance and user experience while maintaining simplicity in deployment and maintenance.
