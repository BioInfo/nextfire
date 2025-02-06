# Local Data Management - nextFire Calculator

## Overview
This document outlines how the nextFire Calculator manages user data in its local-first architecture, focusing on scenario management, data privacy, and local storage practices.

## Local Data Management

### Scenario Management
```typescript
// Types for scenario management
interface ScenarioMetadata {
  id: string;
  name: string;
  createdAt: Date;
  lastModified: Date;
  tags?: string[];
}

interface ScenarioManager {
  listScenarios(): Promise<ScenarioMetadata[]>;
  getScenario(id: string): Promise<SimulationParams>;
  saveScenario(scenario: SimulationParams): Promise<string>;
  deleteScenario(id: string): Promise<void>;
  exportScenarios(): Promise<string>; // Returns JSON
  importScenarios(data: string): Promise<void>;
}

// Implementation
class LocalScenarioManager implements ScenarioManager {
  constructor(private readonly prisma: PrismaClient) {}

  async listScenarios(): Promise<ScenarioMetadata[]> {
    return await this.prisma.userScenario.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        tags: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async saveScenario(scenario: SimulationParams): Promise<string> {
    const result = await this.prisma.userScenario.create({
      data: {
        ...scenario,
        hash: await generateDataHash(scenario)
      }
    });
    return result.id;
  }
}
```

### Data Organization

#### Folder Structure
```typescript
// Local storage organization
interface StorageStructure {
  scenarios: {
    [id: string]: SimulationParams;
  };
  historicalData: {
    lastUpdated: Date;
    data: HistoricalData[];
  };
  preferences: {
    defaultSimulationParams: Partial<SimulationParams>;
    chartPreferences: ChartOptions;
    exportSettings: ExportSettings;
  };
}
```

#### Data Migration
```typescript
// Handle data structure updates
class DataMigration {
  private readonly migrations: Migration[] = [
    {
      version: 1,
      up: async (db: PrismaClient) => {
        // Add new fields, modify structure
      }
    }
    // Additional migrations...
  ];

  async migrateToLatest(db: PrismaClient): Promise<void> {
    const currentVersion = await this.getCurrentVersion(db);
    
    for (const migration of this.migrations) {
      if (migration.version > currentVersion) {
        await migration.up(db);
      }
    }
  }
}
```

## Data Privacy

### Local Storage Security
```typescript
// Secure data handling utilities
const dataPrivacy = {
  // Remove sensitive data before export
  sanitizeForExport(scenario: SimulationParams): ExportableScenario {
    const {
      personalNotes,
      privateData,
      ...exportable
    } = scenario;
    
    return exportable;
  },

  // Validate imported data
  validateImport(data: unknown): SimulationParams {
    const schema = z.object({
      // Define expected structure
      portfolioValue: z.number().positive(),
      annualSpending: z.number().positive(),
      // ... other fields
    });

    return schema.parse(data);
  }
};
```

### Data Backup

#### Export Functionality
```typescript
// Data export utilities
const exportUtils = {
  async exportAllScenarios(): Promise<string> {
    const scenarios = await prisma.userScenario.findMany();
    
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      scenarios: scenarios.map(dataPrivacy.sanitizeForExport)
    };

    return JSON.stringify(exportData, null, 2);
  },

  async importScenarios(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      const validated = z.array(scenarioSchema).parse(data.scenarios);
      
      await prisma.$transaction(
        validated.map(scenario => 
          prisma.userScenario.create({ data: scenario })
        )
      );
    } catch (error) {
      throw new ValidationError('Invalid import data');
    }
  }
};
```

## Data Integrity

### Validation & Sanitization
```typescript
// Input validation utilities
const validation = {
  // Validate scenario data
  validateScenario(data: unknown): SimulationParams {
    return scenarioSchema.parse(data);
  },

  // Sanitize numeric inputs
  sanitizeNumber(value: number): number {
    return Math.max(0, Number(value.toFixed(2)));
  },

  // Validate asset allocation
  validateAllocation(allocation: Record<string, number>): boolean {
    const total = Object.values(allocation)
      .reduce((sum, value) => sum + value, 0);
    return Math.abs(total - 1) < 0.0001;
  }
};
```

### Data Recovery
```typescript
// Recovery utilities
const recovery = {
  // Create backup of current data
  async createBackup(): Promise<void> {
    const data = await exportUtils.exportAllScenarios();
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-');
    
    await fs.writeFile(
      `backup-${timestamp}.json`,
      data
    );
  },

  // Restore from backup
  async restoreFromBackup(filePath: string): Promise<void> {
    const data = await fs.readFile(filePath, 'utf-8');
    await exportUtils.importScenarios(data);
  }
};
```

## Testing

### Data Management Tests
```typescript
describe('Scenario Management', () => {
  test('saves and retrieves scenarios', async () => {
    const manager = new LocalScenarioManager(prisma);
    const scenario = createTestScenario();
    
    const id = await manager.saveScenario(scenario);
    const retrieved = await manager.getScenario(id);
    
    expect(retrieved).toEqual(scenario);
  });

  test('exports scenarios without sensitive data', async () => {
    const exported = await exportUtils.exportAllScenarios();
    const parsed = JSON.parse(exported);
    
    expect(parsed.scenarios).not.toContain('personalNotes');
    expect(parsed.scenarios).not.toContain('privateData');
  });
});
```

Remember: While the nextFire Calculator doesn't have traditional user accounts, proper management of local data is crucial for maintaining privacy and ensuring a good user experience.
