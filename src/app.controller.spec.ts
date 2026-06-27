import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

// Mock PrismaService
const mockPrismaService = {
  tenant: {
    count: jest.fn().mockResolvedValue(23),
    findMany: jest.fn().mockResolvedValue([]),
  },
  user: {
    count: jest.fn().mockResolvedValue(23),
    findMany: jest.fn().mockResolvedValue([]),
  },
  customer: {
    count: jest.fn().mockResolvedValue(12),
    findMany: jest.fn().mockResolvedValue([]),
  },
  subscriptionPlan: {
    count: jest.fn().mockResolvedValue(11),
    findMany: jest.fn().mockResolvedValue([]),
  },
  subscription: {
    count: jest.fn().mockResolvedValue(10),
    findMany: jest.fn().mockResolvedValue([]),
  },
  invoice: {
    count: jest.fn().mockResolvedValue(3),
    findMany: jest.fn().mockResolvedValue([]),
  },
  payment: {
    count: jest.fn().mockResolvedValue(1),
    findMany: jest.fn().mockResolvedValue([]),
  },
  account: {
    count: jest.fn().mockResolvedValue(4),
    findMany: jest.fn().mockResolvedValue([]),
  },
  journalEntry: {
    count: jest.fn().mockResolvedValue(5),
    findMany: jest.fn().mockResolvedValue([]),
  },
  journalLine: {
    count: jest.fn().mockResolvedValue(10),
    findMany: jest.fn().mockResolvedValue([]),
  },
};

// Mock Request
const mockRequest = {
  headers: {
    accept: 'application/json',
  },
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return dashboard data', async () => {
      const mockResponse = {
        json: jest.fn().mockReturnValue({}),
      };
      const result = await appController.getDashboard(
        mockResponse as any,
        mockRequest as any,
      );
      expect(result).toBeDefined();
    });

    it('should have database stats', async () => {
      const mockResponse = {
        json: jest.fn().mockReturnValue({}),
      };
      await appController.getDashboard(mockResponse as any, mockRequest as any);
      expect(mockResponse.json).toHaveBeenCalled();
      const callArg = mockResponse.json.mock.calls[0][0];
      expect(callArg).toHaveProperty('database');
      expect(callArg.database).toHaveProperty('stats');
    });

    it('should have recent activity', async () => {
      const mockResponse = {
        json: jest.fn().mockReturnValue({}),
      };
      await appController.getDashboard(mockResponse as any, mockRequest as any);
      expect(mockResponse.json).toHaveBeenCalled();
      const callArg = mockResponse.json.mock.calls[0][0];
      expect(callArg).toHaveProperty('recentActivity');
    });
  });
});