# Component Library - nextFire Calculator

## Overview
This document details the component library used in the nextFire Calculator project. Built with shadcn/ui components and advanced charting libraries, these components ensure a consistent, accessible, and powerful user interface for financial planning.

## Core Components

### 1. Input Forms (shadcn/ui)
- **Text Inputs**
  - Portfolio value entry
  - Annual spending input
  - Custom income/expense streams
  - Tax rate input
- **Number Fields**
  - Asset allocation percentages
  - Withdrawal rates
  - Floor/ceiling limits
- **Select Menus**
  - Simulation mode selection
  - Withdrawal strategy choice
  - Asset class selection
- **Date Pickers**
  - Custom start/end dates for income/expense streams
- **Sliders**
  - Asset allocation adjustment
  - Withdrawal rate fine-tuning
- **Toggle Groups**
  - Simulation mode switches
  - View mode selection

### 2. Data Visualization
- **Line Charts (Recharts/D3.js)**
  - Portfolio value over time
  - Withdrawal amounts visualization
  - Success rate trends
- **Histograms**
  - Distribution of outcomes
  - Monte Carlo simulation results
- **Area Charts**
  - Asset allocation visualization
  - Probability bands
- **Interactive Elements**
  - Tooltips on hover
  - Click-through for detailed data
  - Zoom controls for timeline exploration

### 3. Navigation & Layout
- **Tabs**
  - Scenario management
  - Different simulation views
- **Progress Tracker**
  - Checkboxes for completed steps
  - Status indicators
- **Cards**
  - Summary statistics
  - Scenario comparison views
- **Modals**
  - Detailed data views
  - Configuration dialogs
- **Tooltips**
  - Financial term explanations
  - Input guidance

### 4. Action Components
- **Buttons**
  - Primary: Run simulation, Save scenario
  - Secondary: Reset, Clear inputs
  - Icon buttons: Export, Share
- **Loading States**
  - Simulation progress indicator
  - Data loading spinners
- **Alerts**
  - Success/error messages
  - Warning notifications
- **Dialogs**
  - Confirmation prompts
  - Advanced settings

## Implementation Guidelines

### Using shadcn/ui Components
```jsx
// Example of form input implementation
<Form>
  <FormField
    control={form.control}
    name="portfolioValue"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Current Portfolio Value</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder="Enter amount"
            {...field}
          />
        </FormControl>
        <FormDescription>
          Enter your current total investment portfolio value
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Chart Implementation
```jsx
// Example of portfolio value chart
<LineChart
  data={portfolioData}
  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
>
  <XAxis dataKey="year" />
  <YAxis />
  <Tooltip />
  <Line
    type="monotone"
    dataKey="value"
    stroke="#8884d8"
    strokeWidth={2}
  />
  <ReferenceLine y={0} stroke="#666" />
</LineChart>
```

## Best Practices
- Use consistent component patterns across the application
- Implement proper loading and error states
- Ensure all components are keyboard accessible
- Maintain responsive behavior across screen sizes
- Follow shadcn/ui theming guidelines

## Performance Guidelines
- Lazy load heavy components (especially charts)
- Implement virtualization for large datasets
- Optimize chart rerendering
- Use proper memoization for complex calculations

## Accessibility Requirements
- Maintain ARIA labels and roles
- Ensure keyboard navigation
- Provide sufficient color contrast
- Include screen reader support

## Component Directory Structure
```
components/
├── forms/
│   ├── PortfolioInput.tsx
│   ├── SpendingInput.tsx
│   └── SimulationConfig.tsx
├── charts/
│   ├── PortfolioChart.tsx
│   ├── OutcomeDistribution.tsx
│   └── WithdrawalChart.tsx
├── navigation/
│   ├── ScenarioTabs.tsx
│   └── ProgressTracker.tsx
└── common/
    ├── Button.tsx
    ├── Card.tsx
    └── Alert.tsx
```

Remember: All components should prioritize both usability and accuracy in financial calculations while maintaining a clean, professional appearance.
