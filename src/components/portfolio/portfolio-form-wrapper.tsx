'use client';

import dynamic from 'next/dynamic';
import type { PortfolioConfig } from '@/types/portfolio';

const PortfolioFormClient = dynamic(
  () => import('./portfolio-form').then(mod => ({ default: mod.PortfolioForm })),
  { ssr: false }
);

interface PortfolioFormWrapperProps {
  onSubmit: (config: PortfolioConfig) => void;
  initialConfig?: PortfolioConfig;
}

export function PortfolioFormWrapper({ onSubmit, initialConfig }: PortfolioFormWrapperProps) {
  return (
    <PortfolioFormClient
      onSubmit={onSubmit}
      initialConfig={initialConfig}
    />
  );
}
