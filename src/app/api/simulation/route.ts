import { NextResponse } from 'next/server';
import { SimulationEngine } from '@/lib/simulation/engine';
import type { SimulationParams } from '@/lib/simulation/types';

export async function POST(request: Request) {
  try {
    const params = await request.json() as SimulationParams;
    const engine = new SimulationEngine();
    const result = await engine.runSimulation(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run simulation' },
      { status: 500 }
    );
  }
}
