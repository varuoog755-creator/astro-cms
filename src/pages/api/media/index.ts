import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { validateAndSaveFile } from '../../../lib/media/storage';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.MEDIA_UPLOAD)) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return redirect('/admin/media?error=No file selected');
    }

    const saved = await validateAndSaveFile(file);

    const mediaRecord = await prisma.media.create({
      data: {
        filename: saved.filename,
        originalName: file.name,
        mimeType: saved.mimeType,
        size: saved.size,
        url: saved.url,
        path: saved.path,
        uploaderId: locals.user.userId,
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'media.upload',
      entity: 'Media',
      entityId: mediaRecord.id,
      metadata: { filename: saved.filename, size: saved.size },
    });

    return redirect('/admin/media');
  } catch (err: any) {
    console.error('Upload error:', err);
    return redirect(`/admin/media?error=${encodeURIComponent(err.message)}`);
  }
};
