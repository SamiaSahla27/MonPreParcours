import { Test, TestingModule } from '@nestjs/testing';
import { MentorRequestsController } from './mentor-requests.controller';
import { MentorRequestsService } from './mentor-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('MentorRequestsController', () => {
  let controller: MentorRequestsController;
  let service: MentorRequestsService;

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { sub: 'user123', role: 'etudiant' };
      return true;
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorRequestsController],
      providers: [
        {
          provide: MentorRequestsService,
          useValue: {
            createRequest: jest.fn(),
            listIncomingPending: jest.fn(),
            decide: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<MentorRequestsController>(MentorRequestsController);
    service = module.get<MentorRequestsService>(MentorRequestsService);
  });

  describe('POST /mentor-requests', () => {
    it('should call service.createRequest with user ID', async () => {
      const mockRequest = {
        user: { sub: 'etudiant123', role: 'etudiant' },
      } as any;

      const dto = { mentorId: 'mentor123', message: 'Hello' };
      const mockResult = {
        id: 'req123',
        mentorId: 'mentor123',
        etudiantId: 'etudiant123',
        status: 'pending',
        alreadyPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createRequestSpy = jest
        .spyOn(service, 'createRequest')
        .mockResolvedValue(mockResult as any);

      const result = await controller.create(mockRequest, dto);

      expect(createRequestSpy).toHaveBeenCalledWith('etudiant123', dto);
      expect(result.id).toBe('req123');
    });
  });

  describe('GET /mentor-requests/incoming', () => {
    it('should call service.listIncomingPending with user ID', async () => {
      const mockRequest = {
        user: { sub: 'mentor123', role: 'mentor' },
      } as any;

      const mockRequests = [
        {
          id: 'req1',
          status: 'pending',
          mentorId: 'mentor123',
          etudiantId: 'etudiant1',
          etudiantEmail: 'e1@example.com',
          createdAt: new Date(),
        },
        {
          id: 'req2',
          status: 'pending',
          mentorId: 'mentor123',
          etudiantId: 'etudiant2',
          etudiantEmail: 'e2@example.com',
          createdAt: new Date(),
        },
      ];

      const listIncomingPendingSpy = jest
        .spyOn(service, 'listIncomingPending')
        .mockResolvedValue(mockRequests as any);

      const result = await controller.incoming(mockRequest);

      expect(listIncomingPendingSpy).toHaveBeenCalledWith('mentor123');
      expect(result).toHaveLength(2);
    });
  });

  describe('POST /mentor-requests/:id/decision', () => {
    it('should call service.decide with request ID and decision', async () => {
      const mockRequest = {
        user: { sub: 'mentor123', role: 'mentor' },
      } as any;

      const mockResult = {
        id: 'req123',
        status: 'accepted',
        alreadyAnswered: false,
      };

      const decideSpy = jest
        .spyOn(service, 'decide')
        .mockResolvedValue(mockResult as any);

      const result = await controller.decision(mockRequest, 'req123', {
        decision: 'accepted',
      });

      expect(decideSpy).toHaveBeenCalledWith('mentor123', 'req123', 'accepted');
      expect(result.status).toBe('accepted');
    });
  });
});
