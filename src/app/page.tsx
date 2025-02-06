'use client';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">nextFire Calculator</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Financial Inputs</h2>
            <div className="space-y-4">
              {/* TODO: Add input form components */}
              <p className="text-sm text-muted-foreground">
                Enter your financial details to simulate retirement scenarios using historical market data from 1871 to present.
              </p>
            </div>
          </section>

          <section className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Results Overview</h2>
            <div className="space-y-4">
              {/* TODO: Add visualization components */}
              <p className="text-sm text-muted-foreground">
                View detailed simulation results, success rates, and portfolio projections based on historical market cycles.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
