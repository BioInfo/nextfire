import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';

interface CustomRenderResult extends RenderResult {
  user: UserEvent;
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="light"
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
): CustomRenderResult => {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: Providers,
      ...options,
    })
  };
};

export * from '@testing-library/react';
export { customRender as render };
