import type { UserSession } from '../../types';

export const PERMISSIONS = {
  POSTS_CREATE: 'posts.create',
  POSTS_READ: 'posts.read',
  POSTS_UPDATE: 'posts.update',
  POSTS_DELETE: 'posts.delete',
  POSTS_PUBLISH: 'posts.publish',

  PAGES_CREATE: 'pages.create',
  PAGES_READ: 'pages.read',
  PAGES_UPDATE: 'pages.update',
  PAGES_DELETE: 'pages.delete',
  PAGES_PUBLISH: 'pages.publish',

  MEDIA_UPLOAD: 'media.upload',
  MEDIA_DELETE: 'media.delete',

  COMMENTS_MODERATE: 'comments.moderate',
  COMMENTS_DELETE: 'comments.delete',

  USERS_MANAGE: 'users.manage',
  USERS_READ: 'users.read',

  SETTINGS_MANAGE: 'settings.manage',
  PLUGINS_MANAGE: 'plugins.manage',
  THEMES_MANAGE: 'themes.manage',

  ANALYTICS_VIEW: 'analytics.view',
  AUDIT_VIEW: 'audit.view',
} as const;

export function hasPermission(session: UserSession | null, permission: string): boolean {
  if (!session) return false;
  if (session.role === 'Super Admin') return true;
  return session.permissions.includes(permission);
}

export function hasAnyPermission(session: UserSession | null, permissions: string[]): boolean {
  if (!session) return false;
  if (session.role === 'Super Admin') return true;
  return permissions.some((perm) => session.permissions.includes(perm));
}

export function hasAllPermissions(session: UserSession | null, permissions: string[]): boolean {
  if (!session) return false;
  if (session.role === 'Super Admin') return true;
  return permissions.every((perm) => session.permissions.includes(perm));
}
