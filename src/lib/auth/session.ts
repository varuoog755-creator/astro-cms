import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import prisma from '../db';
import type { UserSession } from '../../types';

export const SESSION_COOKIE_NAME = 'cms_session_token';
export const CSRF_COOKIE_NAME = 'cms_csrf_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const token = generateToken(40);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return token;
}

export async function getSession(token?: string): Promise<UserSession | null> {
  if (!token) return null;

  const sessionRecord = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
    if (sessionRecord) {
      await prisma.session.delete({ where: { id: sessionRecord.id } }).catch(() => {});
    }
    return null;
  }

  const { user } = sessionRecord;
  if (user.status !== 'active') return null;

  const permissions = user.role.permissions.map((rp) => rp.permission.code);

  return {
    userId: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role: user.role.name as any,
    roleId: user.role.id,
    permissions,
    avatar: user.avatar || undefined,
  };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );

  return cookies[SESSION_COOKIE_NAME] || null;
}
