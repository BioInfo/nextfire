import { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/test/setup.ts'
  ],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/ui/select$': '<rootDir>/src/test/mocks/ui-components.tsx',
    '^@/components/ui/switch$': '<rootDir>/src/test/mocks/ui-components.tsx',
    '^@/components/ui/tooltip$': '<rootDir>/src/test/mocks/ui-components.tsx',
    '^@radix-ui/react-icons$': '<rootDir>/src/test/mocks/ui-components.tsx',
    '^lucide-react$': '<rootDir>/src/test/mocks/ui-components.tsx'
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@radix-ui|lucide-react|class-variance-authority)/)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
