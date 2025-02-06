# Layout Specifications - nextFire Calculator

## Overview
This document outlines the layout specifications for the nextFire Calculator's user interface. Built with Next.js, shadcn/ui, and Tailwind CSS, these layouts ensure a consistent and responsive design that effectively presents complex financial planning information.

## Grid System

### Base Grid
- 12-column grid system using Tailwind CSS
- Container max-widths aligned with design tokens:
  - Small: 640px
  - Medium: 768px
  - Large: 1024px
  - XLarge: 1280px

### Layout Areas
```jsx
// Example main layout structure
<div className="min-h-screen">
  <header className="h-16 border-b">
    {/* Navigation */}
  </header>
  
  <main className="container mx-auto px-4">
    <div className="grid grid-cols-12 gap-6">
      {/* Content */}
    </div>
  </main>
</div>
```

## Page Layouts

### 1. Input Form Layout
```jsx
<div className="grid grid-cols-12 gap-6">
  {/* Main Input Form - 8 columns on desktop */}
  <div className="col-span-12 lg:col-span-8">
    <div className="space-y-6">
      {/* Portfolio Section */}
      <section className="p-6 bg-card rounded-lg">
        <h2>Portfolio Details</h2>
        {/* Form fields */}
      </section>
      
      {/* Spending Section */}
      <section className="p-6 bg-card rounded-lg">
        <h2>Spending Strategy</h2>
        {/* Form fields */}
      </section>
    </div>
  </div>
  
  {/* Summary Sidebar - 4 columns on desktop */}
  <div className="col-span-12 lg:col-span-4">
    <div className="sticky top-6">
      {/* Quick summary cards */}
    </div>
  </div>
</div>
```

### 2. Results Dashboard Layout
```jsx
<div className="space-y-6">
  {/* Summary Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Success rate, median outcome, etc. */}
  </div>
  
  {/* Main Chart Area */}
  <div className="h-[400px] bg-card p-6 rounded-lg">
    {/* Portfolio projection chart */}
  </div>
  
  {/* Additional Charts Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Supporting visualizations */}
  </div>
</div>
```

### 3. Scenario Comparison Layout
```jsx
<div className="space-y-6">
  {/* Tabs Navigation */}
  <nav className="border-b">
    {/* Scenario tabs */}
  </nav>
  
  {/* Comparison Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {/* Scenario cards */}
  </div>
</div>
```

## Component Layouts

### 1. Form Fields
```jsx
<div className="space-y-4">
  {/* Standard form field layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField label="Current Portfolio" />
    <FormField label="Annual Spending" />
  </div>
  
  {/* Full-width fields */}
  <div className="col-span-full">
    <FormField label="Asset Allocation" type="slider" />
  </div>
</div>
```

### 2. Chart Layouts
```jsx
<div className="relative">
  {/* Chart Header */}
  <div className="flex justify-between items-center mb-4">
    <h3>Portfolio Value Over Time</h3>
    <div className="flex gap-2">
      {/* Chart controls */}
    </div>
  </div>
  
  {/* Chart Container */}
  <div className="aspect-[16/9]">
    {/* Chart component */}
  </div>
</div>
```

## Responsive Breakpoints

### Mobile First Approach
- Base styles for mobile (< 640px)
- Tablet adaptations (≥ 768px)
- Desktop layouts (≥ 1024px)
- Wide screen optimizations (≥ 1280px)

### Key Breakpoint Adjustments
```css
/* Mobile (default) */
.input-grid {
  grid-template-columns: 1fr;
}

/* Tablet (md) */
@media (min-width: 768px) {
  .input-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (lg) */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}
```

## Spacing Guidelines

### Vertical Rhythm
- Section spacing: 1.5rem (24px)
- Component spacing: 1rem (16px)
- Form field spacing: 0.75rem (12px)

### Container Padding
- Mobile: 1rem (16px)
- Tablet+: 1.5rem (24px)
- Desktop+: 2rem (32px)

## Layout Best Practices

### 1. Form Organization
- Group related inputs together
- Use progressive disclosure for advanced options
- Maintain clear visual hierarchy
- Provide adequate spacing between sections

### 2. Dashboard Organization
- Place key metrics at the top
- Ensure charts have sufficient breathing room
- Use grid layouts for multiple visualizations
- Maintain consistent card sizes

### 3. Responsive Considerations
- Stack elements vertically on mobile
- Adjust chart dimensions for readability
- Maintain touch-friendly tap targets
- Hide secondary information in expandable sections

## Implementation Examples

### Dashboard Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Success Rate Card */}
  <Card className="p-6">
    <CardHeader>
      <CardTitle>Success Rate</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-success">95%</div>
    </CardContent>
  </Card>
  
  {/* Additional metric cards */}
</div>
```

Remember: These layouts should prioritize clarity and usability while effectively presenting complex financial information. Always test layouts across different screen sizes to ensure a consistent experience.
