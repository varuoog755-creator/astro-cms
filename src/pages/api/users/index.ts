import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hashPassword } from '../../../lib/auth/session';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.USERS_MANAGE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const formData = await request.formData();
    const displayName = formData.get('displayName')?.toString().trim();
    const username = formData.get('username')?.toString().trim().toLowerCase();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const password = formData.get('password')?.toString();
    const roleId = formData.get('roleId')?.toString();

    if (!displayName || !username || !email || !password || !roleId) {
      return redirect('/admin/users/new?error=Missing required fields');
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        displayName,
        username,
        email,
        passwordHash,
        roleId,
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'user.create',
      entity: 'User',
      entityId: newUser.id,
      metadata: { username, roleId },
    });

    return redirect('/admin/users');
  } catch (err) {
    console.error('Create user error:', err);
    return redirect('/admin/users/new?error=Failed to create user');
  }
};
