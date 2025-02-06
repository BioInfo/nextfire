# Design System - nextFire Calculator

## Overview
This design system defines the visual language and interaction patterns for the nextFire Calculator, built with shadcn/ui components and Tailwind CSS. It ensures consistency and accessibility across the application while maintaining a professional appearance suitable for financial planning tools.

## Design Tokens

### Colors
```css
/* Base colors from shadcn/ui with financial-specific semantic usage */
:root {
  /* Primary - Used for key actions and important data */
  --primary: hsl(221.2 83.2% 53.3%);
  --primary-foreground: hsl(210 40% 98%);
  
  /* Secondary - Used for supporting elements */
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  
  /* Accent - Used for highlighting and interactions */
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  
  /* Data Visualization Colors */
  --chart-positive: hsl(142.1 76.2% 36.3%);
  --chart-negative: hsl(346.8 77.2% 49.8%);
  --chart-neutral: hsl(221.2 83.2% 53.3%);
  
  /* Status Colors */
  --success: hsl(142.1 76.2% 36.3%);
  --warning: hsl(48 96% 53%);
  --error: hsl(346.8 77.2% 49.8%);
  
  /* Background & Surface Colors */
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);
  
  /* Border & Separator Colors */
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(221.2 83.2% 53.3%);
}

/* Dark mode color adjustments */
[data-theme="dark"] {
  /* Dark mode color values... */
}
```

### Typography
```css
/* Font Families */
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Form labels, secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Section headers */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Page headers */
--text-3xl: 1.875rem;  /* 30px - Main titles */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing & Layout
```css
/* Base spacing unit: 4px */
--spacing-px: 1px;
--spacing-0.5: 0.125rem;  /* 2px */
--spacing-1: 0.25rem;     /* 4px */
--spacing-2: 0.5rem;      /* 8px */
--spacing-3: 0.75rem;     /* 12px */
--spacing-4: 1rem;        /* 16px */
--spacing-6: 1.5rem;      /* 24px */
--spacing-8: 2rem;        /* 32px */
--spacing-12: 3rem;       /* 48px */
--spacing-16: 4rem;       /* 64px */

/* Container widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

### Border Radius
```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-full: 9999px;
```

## Component-Specific Tokens

### Charts & Data Visualization
- **Line Charts**
  - Line thickness: 2px
  - Grid color: var(--border)
  - Axis labels: var(--text-sm)
  - Tooltip background: var(--card)
  
- **Success Rate Indicators**
  - High: var(--success)
  - Medium: var(--warning)
  - Low: var(--error)

### Forms & Inputs
- Input height: 2.5rem (40px)
- Label size: var(--text-sm)
- Helper text: var(--text-xs)
- Focus ring: 2px solid var(--ring)

### Cards & Containers
- Card padding: var(--spacing-6)
- Card shadow: 0 1px 3px rgba(0,0,0,0.1)
- Border radius: var(--radius-lg)

## Animation & Transitions
```css
/* Transition timing */
--transition-fast: 150ms;
--transition-normal: 250ms;
--transition-slow: 350ms;

/* Easing functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

## Responsive Breakpoints
```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## Implementation Guidelines

### Using Design Tokens
```jsx
// Example of using design tokens with Tailwind CSS
<div className="bg-background text-foreground p-6 rounded-lg">
  <h2 className="text-2xl font-semibold mb-4">Portfolio Summary</h2>
  <div className="text-success">+2.5% Growth</div>
</div>
```

### Accessibility
- Minimum contrast ratio: 4.5:1 for normal text
- Interactive elements: Clear focus states
- Color not used as sole indicator
- Screen reader friendly text alternatives

### Responsive Design
- Mobile-first approach
- Fluid typography scaling
- Flexible grid systems
- Breakpoint-specific layouts

## File Structure
```
styles/
├── tokens/
│   ├── colors.css
│   ├── typography.css
│   └── spacing.css
├── components/
│   ├── charts.css
│   └── forms.css
└── themes/
    ├── light.css
    └── dark.css
```

Remember: Consistency in applying these design tokens is crucial for maintaining a professional and cohesive user interface across the nextFire Calculator application.
