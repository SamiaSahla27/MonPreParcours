import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AppNotificationType,
  type AppNotification,
  type MentorContactRequest,
} from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { RealtimeEventsService } from '../realtime/realtime-events.service';

function buildConversationId(
  mentorId?: string | null,
  etudiantId?: string | null,
) {
  if (!mentorId || !etudiantId) return null;
  return `mentor:${mentorId}|etudiant:${etudiantId}`;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeEvents: RealtimeEventsService,
  ) {}

  private toDto(notification: AppNotification) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      mentorId: notification.mentorId,
      etudiantId: notification.etudiantId,
      requestId: notification.requestId,
      conversationId: buildConversationId(
        notification.mentorId,
        notification.etudiantId,
      ),
      createdAt: notification.createdAt.toISOString(),
    };
  }

  async listForUser(userId: string) {
    const notifications = await this.prisma.appNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((n) => this.toDto(n));
  }

  async createAndDispatch(params: {
    userId: string;
    type: AppNotificationType;
    title: string;
    body?: string;
    mentorId?: string;
    etudiantId?: string;
    requestId?: string;
    realtimePayload?: Record<string, unknown>;
  }) {
    const created = await this.prisma.appNotification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        mentorId: params.mentorId,
        etudiantId: params.etudiantId,
        requestId: params.requestId,
      },
    });

    const payload = {
      ...this.toDto(created),
      ...(params.realtimePayload ?? {}),
    };

    this.realtimeEvents.emitToUser(
      created.userId,
      'notification.created',
      payload,
    );

    return payload;
  }

  async deleteForUser(userId: string, notificationId: string) {
    const deleted = await this.prisma.appNotification.deleteMany({
      where: { id: notificationId, userId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('NOTIFICATION_NOT_FOUND');
    }

    return { ok: true };
  }

  async clearRequestNotifications(request: MentorContactRequest) {
    await this.prisma.appNotification.deleteMany({
      where: {
        requestId: request.id,
        type: AppNotificationType.mentor_request_pending,
      },
    });
  }
}
