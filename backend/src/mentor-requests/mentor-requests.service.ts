import {
  AppNotificationType,
  MentorContactRequestStatus,
} from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MentorRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private toDto(request: {
    id: string;
    mentorId: string;
    etudiantId: string;
    message: string | null;
    status: MentorContactRequestStatus;
    createdAt: Date;
    respondedAt: Date | null;
    etudiant: { email: string };
  }) {
    return {
      id: request.id,
      mentorId: request.mentorId,
      etudiantId: request.etudiantId,
      etudiantEmail: request.etudiant.email,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      respondedAt: request.respondedAt?.toISOString() ?? null,
      conversationId: `mentor:${request.mentorId}|etudiant:${request.etudiantId}`,
    };
  }

  async createRequest(
    etudiantId: string,
    params: { mentorId: string; message?: string },
  ) {
    const mentorId = params.mentorId?.trim();
    if (!mentorId) throw new BadRequestException('MENTOR_ID_REQUIRED');
    if (mentorId === etudiantId)
      throw new BadRequestException('INVALID_PAIRING');

    const [etudiant, mentor] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: etudiantId } }),
      this.prisma.user.findUnique({ where: { id: mentorId } }),
    ]);

    if (!etudiant || etudiant.role !== 'etudiant') {
      throw new ForbiddenException('FORBIDDEN');
    }
    if (!mentor || mentor.role !== 'mentor') {
      throw new BadRequestException('MENTOR_NOT_FOUND');
    }

    const existingPending = await this.prisma.mentorContactRequest.findFirst({
      where: {
        mentorId,
        etudiantId,
        status: MentorContactRequestStatus.pending,
      },
      include: { etudiant: { select: { email: true } } },
    });

    if (existingPending) {
      return {
        ...this.toDto(existingPending),
        alreadyPending: true,
      };
    }

    const created = await this.prisma.mentorContactRequest.create({
      data: {
        mentorId,
        etudiantId,
        message: params.message?.trim() || null,
      },
      include: {
        etudiant: { select: { email: true } },
      },
    });

    await this.notifications.createAndDispatch({
      userId: mentorId,
      type: AppNotificationType.mentor_request_pending,
      title: 'Nouvelle demande de contact',
      body: `${etudiant.email} souhaite vous contacter.`,
      mentorId,
      etudiantId,
      requestId: created.id,
      realtimePayload: {
        requesterEmail: etudiant.email,
        requestStatus: created.status,
      },
    });

    return {
      ...this.toDto(created),
      alreadyPending: false,
    };
  }

  async listIncomingPending(mentorId: string) {
    const mentor = await this.prisma.user.findUnique({
      where: { id: mentorId },
    });
    if (!mentor || mentor.role !== 'mentor')
      throw new ForbiddenException('FORBIDDEN');

    const requests = await this.prisma.mentorContactRequest.findMany({
      where: {
        mentorId,
        status: MentorContactRequestStatus.pending,
      },
      include: {
        etudiant: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => this.toDto(r));
  }

  async decide(
    mentorId: string,
    requestId: string,
    decision: 'accepted' | 'refused',
  ) {
    const mentor = await this.prisma.user.findUnique({
      where: { id: mentorId },
    });
    if (!mentor || mentor.role !== 'mentor')
      throw new ForbiddenException('FORBIDDEN');

    const request = await this.prisma.mentorContactRequest.findUnique({
      where: { id: requestId },
      include: {
        etudiant: { select: { email: true } },
      },
    });

    if (!request) throw new NotFoundException('REQUEST_NOT_FOUND');
    if (request.mentorId !== mentorId)
      throw new ForbiddenException('FORBIDDEN');

    if (request.status !== MentorContactRequestStatus.pending) {
      return {
        ...this.toDto(request),
        alreadyAnswered: true,
      };
    }

    const nextStatus =
      decision === 'accepted'
        ? MentorContactRequestStatus.accepted
        : MentorContactRequestStatus.refused;

    const updated = await this.prisma.mentorContactRequest.update({
      where: { id: request.id },
      data: {
        status: nextStatus,
        respondedAt: new Date(),
      },
      include: {
        etudiant: { select: { email: true } },
      },
    });

    if (nextStatus === MentorContactRequestStatus.accepted) {
      await this.prisma.conversation.upsert({
        where: {
          mentorId_etudiantId: {
            mentorId: updated.mentorId,
            etudiantId: updated.etudiantId,
          },
        },
        update: {},
        create: {
          mentorId: updated.mentorId,
          etudiantId: updated.etudiantId,
        },
      });
    }

    await this.notifications.clearRequestNotifications(updated);

    await this.notifications.createAndDispatch({
      userId: updated.etudiantId,
      type:
        nextStatus === MentorContactRequestStatus.accepted
          ? AppNotificationType.mentor_request_accepted
          : AppNotificationType.mentor_request_refused,
      title:
        nextStatus === MentorContactRequestStatus.accepted
          ? 'Demande acceptée'
          : 'Demande refusée',
      body:
        nextStatus === MentorContactRequestStatus.accepted
          ? 'Le mentor a accepté votre demande. Vous pouvez ouvrir le chat ou la visio.'
          : 'Le mentor a refusé votre demande de contact.',
      mentorId: updated.mentorId,
      etudiantId: updated.etudiantId,
      requestId: updated.id,
      realtimePayload: {
        requestStatus: updated.status,
      },
    });

    return {
      ...this.toDto(updated),
      alreadyAnswered: false,
    };
  }
}
