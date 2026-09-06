import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken } from '../src/lib/auth/session';

describe('Authentication Unit Tests', () => {
  it('should hash and verify passwords correctly', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    expect(await verifyPassword(rawPassword, hash)).toBe(true);
    expect(await verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('should generate secure random session tokens', () => {
    const token1 = generateToken();
    const token2 = generateToken();

    expect(token1).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });
});
