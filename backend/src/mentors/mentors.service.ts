import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class MentorsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProfessions() {
    const rows = await this.prisma.profession.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => r.name);
  }

  async list(params: { query?: string }) {
    const query = params.query?.trim();

    const where = query
      ? {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { profession: { name: { contains: query, mode: 'insensitive' as const } } },
            { skills: { some: { skill: { name: { contains: query, mode: 'insensitive' as const } } } } },
            { location: { label: { contains: query, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const mentors = await this.prisma.mentorProfile.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        profession: true,
        location: true,
        skills: { include: { skill: true } },
      },
    });

    return mentors.map((m) => ({
      id: m.id,
      userId: m.userId,
      fullName: m.fullName,
      profession: m.profession.name,
      description: m.description,
      skills: m.skills.map((s) => s.skill.name),
      location: m.location
        ? {
            label: m.location.label,
            city: m.location.city,
            country: m.location.country,
          }
        : null,
      imageUrl: m.imageUrl,
    }));
  }

  async getById(id: string) {
    const m = await this.prisma.mentorProfile.findUnique({
      where: { id },
      include: {
        profession: true,
        location: true,
        skills: { include: { skill: true } },
      },
    });

    if (!m) return null;

    return {
      id: m.id,
      userId: m.userId,
      fullName: m.fullName,
      profession: m.profession.name,
      description: m.description,
      skills: m.skills.map((s) => s.skill.name),
      location: m.location
        ? {
            label: m.location.label,
            city: m.location.city,
            country: m.location.country,
          }
        : null,
      imageUrl: m.imageUrl,
      phone: m.phone,
      email: m.emailPublic,
    };
  }
}
