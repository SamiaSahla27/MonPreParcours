import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtClaims, SocketUser } from '../types/realtime.types';

@Injectable()
export class JwtSocketAuthService {
  constructor(private readonly jwt: JwtService) {}

  authenticate(token: string | undefined): SocketUser | null {
    if (!token) return null;

    const normalized = token.startsWith('Bearer ') ? token.slice('Bearer '.length) : token;

    try {
      const claims = this.jwt.verify<JwtClaims>(normalized);
      if (!claims?.sub || (claims.role !== 'mentor' && claims.role !== 'etudiant')) return null;
      return { userId: claims.sub, role: claims.role };
    } catch {
      return null;
    }
  }
}
