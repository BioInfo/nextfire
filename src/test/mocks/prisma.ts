export const mockPrisma = {
  historicalData: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn()
  }
};

jest.mock('@/lib/database/prisma', () => ({
  prisma: mockPrisma
}));
