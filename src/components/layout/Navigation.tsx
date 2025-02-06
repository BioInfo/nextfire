'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              nextFire
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/simulation" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/simulation' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              Simulation
            </Link>
            <Link 
              href="/analysis" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/analysis' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              Analysis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
