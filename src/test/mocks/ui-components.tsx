import React from 'react';

// Mock UI components
export const Select = ({ children, value, onValueChange }: any) => (
  <select value={value} onChange={e => onValueChange?.(e.target.value)}>
    {children}
  </select>
);

export const SelectTrigger = ({ children }: any) => (
  <div role="combobox">{children}</div>
);

export const SelectValue = ({ children }: any) => <span>{children}</span>;

export const SelectContent = ({ children }: any) => (
  <div role="listbox">{children}</div>
);

export const SelectItem = ({ children, value }: any) => (
  <div role="option" data-value={value}>
    {children}
  </div>
);

export const Switch = ({ checked, onCheckedChange }: any) => (
  <input
    type="checkbox"
    role="switch"
    checked={checked}
    onChange={e => onCheckedChange?.(e.target.checked)}
  />
);

export const Tooltip = ({ children }: any) => <>{children}</>;
export const TooltipTrigger = ({ children }: any) => <>{children}</>;
export const TooltipContent = ({ children }: any) => <>{children}</>;
export const TooltipProvider = ({ children }: any) => <>{children}</>;

// Mock Lucide Icons
export const InfoCircledIcon = () => (
  <svg
    className="h-4 w-4 text-muted-foreground"
    data-testid="info-icon"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="8" />
  </svg>
);

// Re-export everything from @radix-ui/react-icons as a mock
export * from '@radix-ui/react-icons';
