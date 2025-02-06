import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';

interface CustomRenderResult extends RenderResult {
  user: UserEvent;
}

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
): CustomRenderResult => {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => children,
      ...options,
    }),
  };
};

export * from '@testing-library/react';
export { customRender as render };
