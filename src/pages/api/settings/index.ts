import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.SETTINGS_MANAGE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const group = formData.get('group')?.toString() || 'general';

  for (const [key, value] of formData.entries()) {
    if (key === 'group') continue;

    await prisma.setting.upsert({
      where: { key },
      update: { value: value.toString(), group },
      create: { key, value: value.toString(), group },
    });
  }

  await logAudit({
    userId: locals.user.userId,
    action: 'setting.update',
    entity: 'Setting',
    metadata: { group },
  });

  return redirect(`/admin/settings/${group}`);
};
