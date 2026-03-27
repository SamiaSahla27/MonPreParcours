import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe(AuthService.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('register hashes password and returns token', async () => {
    const jwt = new JwtService({ secret: 'test' });
    const svc = new AuthService(prismaMock as any, jwt);

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockImplementation(async ({ data, select }: any) => ({
      id: 'u1',
      email: data.email,
      role: data.role,
      createdAt: new Date(),
    }));

    const res = await svc.register({ email: 'test@example.com', password: 'password123', role: 'mentor' });
    expect(res.user.email).toBe('test@example.com');
    expect(typeof res.token).toBe('string');
  });

  it('login rejects invalid password', async () => {
    const jwt = new JwtService({ secret: 'test' });
    const svc = new AuthService(prismaMock as any, jwt);

    const hash = await bcrypt.hash('goodpass123', 10);
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', role: 'mentor', passwordHash: hash, createdAt: new Date() });

    await expect(svc.login({ email: 'a@b.com', password: 'bad' })).rejects.toBeDefined();
  });
});
