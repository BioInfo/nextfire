import { PortfolioContainer } from '@/components/portfolio/portfolio-container';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">nextFire Calculator</h1>
        <PortfolioContainer />
      </div>
    </main>
  );
}
