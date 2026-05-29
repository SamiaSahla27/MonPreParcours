import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { sub: 'user123' };
      return true;
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            listForUser: jest.fn(),
            deleteForUser: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('GET /notifications', () => {
    it('should list notifications for user', async () => {
      const mockRequest = {
        user: { sub: 'user123' },
      } as any;

      const mockNotifications = [
        {
          id: '1',
          title: 'Notif 1',
          type: 'mentor_request_pending',
          body: 'Test body',
          userId: 'user123',
          mentorId: null,
          etudiantId: null,
          requestId: null,
          conversationId: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Notif 2',
          type: 'mentor_request_accepted',
          body: 'Test body',
          userId: 'user123',
          mentorId: null,
          etudiantId: null,
          requestId: null,
          conversationId: null,
          createdAt: new Date().toISOString(),
        },
      ];

      const listForUserSpy = jest
        .spyOn(service, 'listForUser')
        .mockResolvedValue(mockNotifications as any);

      const result = await controller.list(mockRequest);

      expect(listForUserSpy).toHaveBeenCalledWith('user123');
      expect(result).toHaveLength(2);
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete notification for user', async () => {
      const mockRequest = {
        user: { sub: 'user123' },
      } as any;

      const deleteForUserSpy = jest
        .spyOn(service, 'deleteForUser')
        .mockResolvedValue({ ok: true });

      const result = await controller.delete(mockRequest, 'notif123');

      expect(deleteForUserSpy).toHaveBeenCalledWith('user123', 'notif123');
      expect(result).toEqual({ ok: true });
    });
  });
});
