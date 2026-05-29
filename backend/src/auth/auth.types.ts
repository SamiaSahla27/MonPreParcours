export type UserRole = 'mentor' | 'etudiant';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
}
