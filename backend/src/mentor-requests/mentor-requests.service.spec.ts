import { Test, TestingModule } from '@nestjs/testing';
import { MentorRequestsService } from './mentor-requests.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../db/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MentorContactRequestStatus } from '@prisma/client';

describe('MentorRequestsService', () => {
  let service: MentorRequestsService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    mentorContactRequest: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    conversation: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
    appNotification: {
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockNotifications = {
    createAndDispatch: jest.fn(),
    clearRequestNotifications: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorRequestsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<MentorRequestsService>(MentorRequestsService);
  });

  describe('createRequest', () => {
    it('should create a mentor request and dispatch notification', async () => {
      const etudiantId = 'etudiant123';
      const mentorId = 'mentor123';

      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: etudiantId, role: 'etudiant' })
        .mockResolvedValueOnce({ id: mentorId, role: 'mentor' });

      mockPrisma.mentorContactRequest.findFirst.mockResolvedValueOnce(null);

      mockPrisma.mentorContactRequest.create.mockResolvedValueOnce({
        id: 'req123',
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
        message: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date(),
        respondedAt: null,
        etudiant: { email: 'etudiant@example.com' },
      });

      mockNotifications.createAndDispatch.mockResolvedValueOnce({
        id: 'notif123',
      });

      const result = await service.createRequest(etudiantId, {
        mentorId,
        message: 'Test message',
      });

      expect(result).toMatchObject({
        id: 'req123',
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
        alreadyPending: false,
      });

      expect(mockNotifications.createAndDispatch).toHaveBeenCalled();
    });

    it('should return alreadyPending if request already exists', async () => {
      const etudiantId = 'etudiant123';
      const mentorId = 'mentor123';

      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: etudiantId, role: 'etudiant' })
        .mockResolvedValueOnce({ id: mentorId, role: 'mentor' });

      const existingRequest = {
        id: 'req456',
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        respondedAt: null,
        etudiant: { email: 'etudiant@example.com' },
      };

      mockPrisma.mentorContactRequest.findFirst.mockResolvedValueOnce(
        existingRequest,
      );

      const result = await service.createRequest(etudiantId, { mentorId });

      expect(result.id).toBe('req456');
      expect(result.alreadyPending).toBe(true);
      expect(mockPrisma.mentorContactRequest.create).not.toHaveBeenCalled();
    });

    it('should reject if user is not an etudiant', async () => {
      const mentorId = 'mentor123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: mentorId,
        role: 'mentor',
      });

      await expect(
        service.createRequest(mentorId, { mentorId: 'other' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('listIncomingPending', () => {
    it('should list pending requests for mentor', async () => {
      const mentorId = 'mentor123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: mentorId,
        role: 'mentor',
      });

      const requests = [
        {
          id: 'req1',
          mentorId,
          etudiantId: 'etudiant1',
          status: MentorContactRequestStatus.pending,
          message: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          respondedAt: null,
          etudiant: { email: 'e1@example.com' },
        },
        {
          id: 'req2',
          mentorId,
          etudiantId: 'etudiant2',
          status: MentorContactRequestStatus.pending,
          message: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          respondedAt: null,
          etudiant: { email: 'e2@example.com' },
        },
      ];

      mockPrisma.mentorContactRequest.findMany.mockResolvedValueOnce(requests);

      const result = await service.listIncomingPending(mentorId);

      expect(result).toHaveLength(2);
      expect(mockPrisma.mentorContactRequest.findMany).toHaveBeenCalled();
    });

    it('should reject if user is not a mentor', async () => {
      const etudiantId = 'etudiant123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: etudiantId,
        role: 'etudiant',
      });

      await expect(service.listIncomingPending(etudiantId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('decide', () => {
    it('should accept request and create conversation', async () => {
      const mentorId = 'mentor123';
      const etudiantId = 'etudiant123';
      const requestId = 'req123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: mentorId,
        role: 'mentor',
      });

      const request = {
        id: requestId,
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
        respondedAt: null,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        etudiant: { email: 'etudiant@example.com' },
      };

      mockPrisma.mentorContactRequest.findUnique.mockResolvedValueOnce(request);

      mockPrisma.mentorContactRequest.update.mockResolvedValueOnce({
        ...request,
        status: MentorContactRequestStatus.accepted,
        respondedAt: new Date(),
      });

      mockPrisma.conversation.upsert.mockResolvedValueOnce({
        mentorId,
        etudiantId,
      });

      mockNotifications.createAndDispatch.mockResolvedValueOnce({
        id: 'notif123',
      });

      mockNotifications.clearRequestNotifications.mockResolvedValueOnce(
        undefined,
      );

      const result = await service.decide(mentorId, requestId, 'accepted');

      expect(result.status).toBe(MentorContactRequestStatus.accepted);
      expect(mockPrisma.conversation.upsert).toHaveBeenCalled();
      expect(mockNotifications.createAndDispatch).toHaveBeenCalled();
    });

    it('should refuse request without creating conversation', async () => {
      const mentorId = 'mentor123';
      const etudiantId = 'etudiant123';
      const requestId = 'req123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: mentorId,
        role: 'mentor',
      });

      const request = {
        id: requestId,
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
        respondedAt: null,
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        etudiant: { email: 'etudiant@example.com' },
      };

      mockPrisma.mentorContactRequest.findUnique.mockResolvedValueOnce(request);

      mockPrisma.mentorContactRequest.update.mockResolvedValueOnce({
        ...request,
        status: MentorContactRequestStatus.refused,
        respondedAt: new Date(),
      });

      mockNotifications.createAndDispatch.mockResolvedValueOnce({
        id: 'notif123',
      });

      mockNotifications.clearRequestNotifications.mockResolvedValueOnce(
        undefined,
      );

      const result = await service.decide(mentorId, requestId, 'refused');

      expect(result.status).toBe(MentorContactRequestStatus.refused);
      expect(mockPrisma.conversation.upsert).not.toHaveBeenCalled();
    });

    it('should reject if request not found', async () => {
      const mentorId = 'mentor123';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: mentorId,
        role: 'mentor',
      });

      mockPrisma.mentorContactRequest.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.decide(mentorId, 'nonexistent', 'accepted'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject if not the mentor', async () => {
      const requestId = 'req123';

      const request = {
        id: requestId,
        mentorId: 'other-mentor',
        etudiantId: 'etudiant123',
        status: MentorContactRequestStatus.pending,
        etudiant: { email: 'etudiant@example.com' },
        message: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        respondedAt: null,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'mentor123',
        role: 'mentor',
      });

      mockPrisma.mentorContactRequest.findUnique.mockResolvedValueOnce(request);

      await expect(
        service.decide('mentor123', requestId, 'accepted'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
