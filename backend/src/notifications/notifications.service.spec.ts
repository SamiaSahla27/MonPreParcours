import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../db/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';
import { AppNotificationType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;
  let realtimeEvents: RealtimeEventsService;

  const mockPrisma = {
    appNotification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockRealtimeEvents = {
    emitToUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RealtimeEventsService, useValue: mockRealtimeEvents },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
    realtimeEvents = module.get<RealtimeEventsService>(RealtimeEventsService);
  });

  describe('createAndDispatch', () => {
    it('should create notification and emit via realtime', async () => {
      const userId = 'user123';
      const notifId = 'notif123';

      mockPrisma.appNotification.create.mockResolvedValueOnce({
        id: notifId,
        userId,
        type: AppNotificationType.mentor_request_pending,
        title: 'Test notification',
        body: 'Test body',
        mentorId: null,
        etudiantId: null,
        requestId: null,
        conversationId: null,
        createdAt: new Date(),
      });

      const result = await service.createAndDispatch({
        userId,
        type: AppNotificationType.mentor_request_pending,
        title: 'Test notification',
        body: 'Test body',
      });

      expect(result.id).toBe(notifId);
      expect(result.type).toBe(AppNotificationType.mentor_request_pending);
      expect(mockRealtimeEvents.emitToUser).toHaveBeenCalledWith(
        userId,
        'notification.created',
        expect.any(Object),
      );
    });

    it('should include mentor/etudiant IDs and request ID', async () => {
      const userId = 'mentor123';

      mockPrisma.appNotification.create.mockResolvedValueOnce({
        id: 'notif123',
        userId,
        type: AppNotificationType.mentor_request_accepted,
        title: 'Accepté',
        mentorId: 'mentor123',
        etudiantId: 'etudiant123',
        requestId: 'request123',
        conversationId: 'mentor:mentor123|etudiant:etudiant123',
        createdAt: new Date(),
      });

      const result = await service.createAndDispatch({
        userId,
        type: AppNotificationType.mentor_request_accepted,
        title: 'Accepté',
        mentorId: 'mentor123',
        etudiantId: 'etudiant123',
        requestId: 'request123',
      });

      expect(result.mentorId).toBe('mentor123');
      expect(result.etudiantId).toBe('etudiant123');
      expect(result.requestId).toBe('request123');
    });

    it('should include custom realtime payload', async () => {
      const userId = 'user123';

      mockPrisma.appNotification.create.mockResolvedValueOnce({
        id: 'notif123',
        userId,
        type: AppNotificationType.mentor_request_pending,
        title: 'Pending',
        createdAt: new Date(),
      });

      await service.createAndDispatch({
        userId,
        type: AppNotificationType.mentor_request_pending,
        title: 'Pending',
        realtimePayload: { customField: 'customValue' },
      });

      expect(mockRealtimeEvents.emitToUser).toHaveBeenCalledWith(
        userId,
        'notification.created',
        expect.objectContaining({
          customField: 'customValue',
        }),
      );
    });
  });

  describe('listForUser', () => {
    it('should list notifications in descending order', async () => {
      const userId = 'user123';

      mockPrisma.appNotification.findMany.mockResolvedValueOnce([
        {
          id: '2',
          title: 'Second',
          type: AppNotificationType.mentor_request_accepted,
          userId,
          createdAt: new Date(),
        },
        {
          id: '1',
          title: 'First',
          type: AppNotificationType.mentor_request_pending,
          userId,
          createdAt: new Date(),
        },
      ]);

      const list = await service.listForUser(userId);

      expect(list).toHaveLength(2);
      expect(list[0].title).toBe('Second');
      expect(list[1].title).toBe('First');
      expect(mockPrisma.appNotification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });

    it('should return empty list if no notifications', async () => {
      const userId = 'user123';

      mockPrisma.appNotification.findMany.mockResolvedValueOnce([]);

      const list = await service.listForUser(userId);

      expect(list).toHaveLength(0);
    });

    it('should limit to 50 notifications', async () => {
      const userId = 'user123';

      mockPrisma.appNotification.findMany.mockResolvedValueOnce(
        Array.from({ length: 50 }, (_, i) => ({
          id: String(i),
          title: `Notif ${i}`,
          userId,
          createdAt: new Date(),
        })),
      );

      const list = await service.listForUser(userId);

      expect(list).toHaveLength(50);
      expect(mockPrisma.appNotification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });
  });

  describe('deleteForUser', () => {
    it('should delete notification for user', async () => {
      const userId = 'user123';
      const notifId = 'notif123';

      mockPrisma.appNotification.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      const result = await service.deleteForUser(userId, notifId);

      expect(result.ok).toBe(true);
      expect(mockPrisma.appNotification.deleteMany).toHaveBeenCalledWith({
        where: { id: notifId, userId },
      });
    });

    it('should not delete if userId does not match', async () => {
      mockPrisma.appNotification.deleteMany.mockResolvedValueOnce({
        count: 0,
      });

      await expect(service.deleteForUser('user123', 'notif123')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrisma.appNotification.deleteMany).toHaveBeenCalledWith({
        where: { id: 'notif123', userId: 'user123' },
      });
    });

    it('should throw if notification not found', async () => {
      mockPrisma.appNotification.deleteMany.mockResolvedValueOnce({
        count: 0,
      });

      await expect(service.deleteForUser('user123', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearRequestNotifications', () => {
    it('should delete pending notifications for a request', async () => {
      const requestId = 'req123';
      const userId = 'user123';

      const request = {
        id: requestId,
        mentorId: userId,
        etudiantId: 'etudiant123',
        createdAt: new Date(),
        message: null,
        status: 'pending' as any,
        updatedAt: new Date(),
        respondedAt: null,
      };

      mockPrisma.appNotification.deleteMany.mockResolvedValueOnce({
        count: 1,
      });

      await service.clearRequestNotifications(request);

      expect(mockPrisma.appNotification.deleteMany).toHaveBeenCalledWith({
        where: {
          requestId,
          type: AppNotificationType.mentor_request_pending,
        },
      });
    });

    it('should only delete pending notifications', async () => {
      const requestId = 'req123';

      const request = {
        id: requestId,
        mentorId: 'mentor123',
        etudiantId: 'etudiant123',
        createdAt: new Date(),
        message: null,
        status: 'pending' as any,
        updatedAt: new Date(),
        respondedAt: null,
      };

      mockPrisma.appNotification.deleteMany.mockResolvedValueOnce({
        count: 0,
      });

      await service.clearRequestNotifications(request);

      expect(mockPrisma.appNotification.deleteMany).toHaveBeenCalledWith({
        where: {
          requestId,
          type: AppNotificationType.mentor_request_pending,
        },
      });
    });
  });
});
