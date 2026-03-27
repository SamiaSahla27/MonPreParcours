import { JwtSocketAuthService } from './jwt-socket-auth.service';

describe(JwtSocketAuthService.name, () => {
  it('rejects missing token', () => {
    const jwt = { verify: jest.fn() } as any;
    const svc = new JwtSocketAuthService(jwt);
    expect(svc.authenticate(undefined)).toBeNull();
  });

  it('accepts valid token with sub and role', () => {
    const jwt = {
      verify: jest.fn().mockReturnValue({ sub: 'u1', role: 'mentor' }),
    } as any;
    const svc = new JwtSocketAuthService(jwt);
    expect(svc.authenticate('token')).toEqual({ userId: 'u1', role: 'mentor' });
  });

  it('rejects token with invalid role', () => {
    const jwt = {
      verify: jest.fn().mockReturnValue({ sub: 'u1', role: 'admin' }),
    } as any;
    const svc = new JwtSocketAuthService(jwt);
    expect(svc.authenticate('token')).toBeNull();
  });

  it('rejects invalid token (verify throws)', () => {
    const jwt = {
      verify: jest.fn(() => {
        throw new Error('bad token');
      }),
    } as any;
    const svc = new JwtSocketAuthService(jwt);
    expect(svc.authenticate('token')).toBeNull();
  });
});
