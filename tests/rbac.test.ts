import { describe, it, expect } from 'vitest';
import { hasPermission, PERMISSIONS } from '../src/lib/permissions/rbac';
import type { UserSession } from '../src/types';

describe('RBAC Authorization Tests', () => {
  const superAdmin: UserSession = {
    userId: '1',
    email: 'admin@test.com',
    username: 'admin',
    displayName: 'Super Admin',
    role: 'Super Admin',
    roleId: 'r1',
    permissions: [],
  };

  const author: UserSession = {
    userId: '2',
    email: 'author@test.com',
    username: 'author',
    displayName: 'Author User',
    role: 'Author',
    roleId: 'r2',
    permissions: [PERMISSIONS.POSTS_CREATE, PERMISSIONS.POSTS_READ],
  };

  it('Super Admin should pass all permission checks unconditionally', () => {
    expect(hasPermission(superAdmin, PERMISSIONS.USERS_MANAGE)).toBe(true);
    expect(hasPermission(superAdmin, PERMISSIONS.SETTINGS_MANAGE)).toBe(true);
    expect(hasPermission(superAdmin, 'any.custom.perm')).toBe(true);
  });

  it('Author should pass granted permissions and fail restricted ones', () => {
    expect(hasPermission(author, PERMISSIONS.POSTS_CREATE)).toBe(true);
    expect(hasPermission(author, PERMISSIONS.USERS_MANAGE)).toBe(false);
    expect(hasPermission(author, PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
  });
});
