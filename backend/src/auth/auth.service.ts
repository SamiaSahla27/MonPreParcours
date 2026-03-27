import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db/prisma.service';
import type { JwtPayload, UserRole } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(params: { email: string; password: string; role: UserRole }) {
    const email = params.email?.trim().toLowerCase();
    if (!email) throw new BadRequestException('EMAIL_REQUIRED');
    if (!params.password || params.password.length < 8)
      throw new BadRequestException('PASSWORD_TOO_SHORT');
    if (params.role !== 'mentor' && params.role !== 'etudiant')
      throw new BadRequestException('ROLE_INVALID');

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('EMAIL_ALREADY_USED');

    const passwordHash = await bcrypt.hash(params.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: params.role,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    const token = await this.signToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    return { user, token };
  }

  async login(params: { email: string; password: string }) {
    const email = params.email?.trim().toLowerCase();
    if (!email) throw new BadRequestException('EMAIL_REQUIRED');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const ok = await bcrypt.compare(params.password ?? '', user.passwordHash);
    if (!ok) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const token = await this.signToken({
      sub: user.id,
      role: user.role as any,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException('UNAUTHORIZED');
    return user;
  }

  private async signToken(payload: JwtPayload) {
    return await this.jwt.signAsync(payload);
  }
}
