import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retirement Simulation - NextFire',
  description: 'Run historical cycle simulations to test your retirement portfolio',
};

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
