import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.POSTS_CREATE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const name = formData.get('name')?.toString().trim();
  let slug = formData.get('slug')?.toString().trim().toLowerCase();
  const description = formData.get('description')?.toString();

  if (!name) return redirect('/admin/tags?error=Name required');

  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  await prisma.tag.create({
    data: {
      name,
      slug,
      description,
    },
  });

  return redirect('/admin/tags');
};
