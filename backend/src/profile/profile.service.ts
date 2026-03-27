import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyMentorProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('FORBIDDEN');
    if (user.role !== 'mentor') throw new ForbiddenException('FORBIDDEN');

    const profile = await this.prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        profession: true,
        location: true,
        skills: { include: { skill: true } },
      },
    });

    if (!profile) return null;

    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      description: profile.description,
      phone: profile.phone,
      imageUrl: profile.imageUrl,
      emailPublic: profile.emailPublic,
      professionName: profile.profession?.name ?? null,
      skills: profile.skills.map((s) => s.skill.name),
      location: profile.location
        ? {
            label: profile.location.label,
            city: profile.location.city,
            country: profile.location.country,
          }
        : null,
    };
  }

  private async upsertProfession(name?: string) {
    const trimmed = name?.trim();
    if (!trimmed) return null;
    return await this.prisma.profession.upsert({
      where: { name: trimmed },
      update: {},
      create: { name: trimmed },
    });
  }

  private async createLocation(params: {
    label?: string;
    city?: string;
    country?: string;
  }) {
    const label = params.label?.trim();
    if (!label) return null;
    return await this.prisma.location.create({
      data: {
        label,
        city: params.city?.trim() || null,
        country: params.country?.trim() || null,
      },
    });
  }

  private normalizeSkills(skills?: string[]) {
    if (!skills) return null;
    const normalized = skills
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30);
    return Array.from(new Set(normalized));
  }

  async updateMyMentorProfile(
    userId: string,
    body: {
      fullName?: string;
      professionName?: string;
      description?: string;
      skills?: string[];
      locationLabel?: string;
      city?: string;
      country?: string;
      phone?: string;
      imageUrl?: string;
      emailPublic?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('FORBIDDEN');
    if (user.role !== 'mentor') throw new ForbiddenException('FORBIDDEN');

    const existing = await this.prisma.mentorProfile.findUnique({ where: { userId } });
    const profession = await this.upsertProfession(body.professionName);

    let locationId: string | null | undefined = undefined;
    if (body.locationLabel !== undefined) {
      const loc = await this.createLocation({
        label: body.locationLabel,
        city: body.city,
        country: body.country,
      });
      locationId = loc?.id ?? null;
    }

    const fullName = body.fullName?.trim();
    if (fullName !== undefined && !fullName)
      throw new BadRequestException('FULLNAME_REQUIRED');

    const profile = existing
      ? await this.prisma.mentorProfile.update({
          where: { userId },
          data: {
            fullName: fullName ?? undefined,
            description: body.description?.trim() ?? undefined,
            phone: body.phone?.trim() ?? undefined,
            imageUrl: body.imageUrl?.trim() ?? undefined,
            emailPublic: body.emailPublic?.trim() ?? undefined,
            professionId: profession?.id ?? undefined,
            locationId,
          },
        })
      : await this.prisma.mentorProfile.create({
          data: {
            userId,
            fullName: fullName || user.email,
            description: body.description?.trim() || '',
            phone: body.phone?.trim() || null,
            imageUrl: body.imageUrl?.trim() || null,
            emailPublic: body.emailPublic?.trim() || null,
            professionId:
              profession?.id ?? (await this.prisma.profession.upsert({
                where: { name: 'Mentor' },
                update: {},
                create: { name: 'Mentor' },
              })).id,
            locationId: locationId ?? null,
          },
        });

    const skills = this.normalizeSkills(body.skills);
    if (skills) {
      const skillRecords = await Promise.all(
        skills.map((name) =>
          this.prisma.skill.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      await this.prisma.mentorSkill.deleteMany({ where: { mentorProfileId: profile.id } });
      await this.prisma.mentorSkill.createMany({
        data: skillRecords.map((s) => ({ mentorProfileId: profile.id, skillId: s.id })),
        skipDuplicates: true,
      });
    }

    return await this.getMyMentorProfile(userId);
  }
}
