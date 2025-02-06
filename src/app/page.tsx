import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">nextFire Calculator</h1>
        <p className="text-xl text-muted-foreground">
          Test your retirement portfolio with historical market data
        </p>
        <Link href="/simulation">
          <Button size="lg" className="mt-4">
            Start Simulation
          </Button>
        </Link>
      </div>
    </main>
  );
}
