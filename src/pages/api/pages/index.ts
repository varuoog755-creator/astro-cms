import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.PAGES_CREATE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    let slug = formData.get('slug')?.toString().trim().toLowerCase();
    const content = formData.get('content')?.toString() || '[]';
    const parentId = formData.get('parentId')?.toString() || null;
    const template = formData.get('template')?.toString() || 'default';

    if (!title) return redirect('/admin/pages/new?error=Title is required');

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        parentId: parentId || null,
        template,
        authorId: locals.user.userId,
        status: 'published',
        publishedAt: new Date(),
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'page.create',
      entity: 'Page',
      entityId: page.id,
    });

    return redirect('/admin/pages');
  } catch (err) {
    console.error('Create page error:', err);
    return redirect('/admin/pages/new?error=Creation failed');
  }
};
