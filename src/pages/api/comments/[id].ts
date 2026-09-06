import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';

export const POST: APIRoute = async ({ params, request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.COMMENTS_MODERATE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const id = params.id;
  if (!id) return new Response('Missing ID', { status: 400 });

  const formData = await request.formData();
  const action = formData.get('action')?.toString();

  let targetStatus = 'pending';
  if (action === 'approve') targetStatus = 'approved';
  if (action === 'spam') targetStatus = 'spam';
  if (action === 'trash') targetStatus = 'trash';

  await prisma.comment.update({
    where: { id },
    data: { status: targetStatus },
  });

  return redirect(`/admin/comments?status=${targetStatus}`);
};
