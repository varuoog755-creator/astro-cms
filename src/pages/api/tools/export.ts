import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.SETTINGS_MANAGE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const [posts, pages, categories, tags, settings] = await Promise.all([
    prisma.post.findMany({ include: { categories: true, tags: true } }),
    prisma.page.findMany(),
    prisma.category.findMany(),
    prisma.tag.findMany(),
    prisma.setting.findMany(),
  ]);

  const backupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    posts,
    pages,
    categories,
    tags,
    settings,
  };

  return new Response(JSON.stringify(backupData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="astro_cms_backup_${Date.now()}.json"`,
    },
  });
};
