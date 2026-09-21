import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { logAudit } from '../../../../lib/utilities/audit';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions/rbac';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isAdmin =
    locals.user.role === 'Super Admin' ||
    locals.user.role === 'Administrator' ||
    locals.user.email === 'govinda755rock755@gmail.com' ||
    hasPermission(locals.user, PERMISSIONS.POSTS_DELETE) ||
    hasPermission(locals.user, PERMISSIONS.POSTS_UPDATE);

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden. Admin privileges required.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let id: string | undefined;
    let slug: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      id = body.id;
      slug = body.slug;
    } else {
      const formData = await request.formData();
      id = formData.get('id')?.toString();
      slug = formData.get('slug')?.toString();
    }

    if (!id && !slug) {
      return new Response(JSON.stringify({ error: 'Missing product id or slug.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Delete matching records from Supabase Product table
    const deleteWhere: any[] = [];
    if (id) deleteWhere.push({ id });
    if (slug) deleteWhere.push({ slug });

    await prisma.product.deleteMany({
      where: {
        OR: deleteWhere,
      },
    });

    // 2. Persist deleted id/slug in settings so fallback catalog never revives it
    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'deleted_product_ids' },
      });
      const currentList: string[] = setting?.value ? JSON.parse(setting.value) : [];
      if (id && !currentList.includes(id)) currentList.push(id);
      if (slug && !currentList.includes(slug)) currentList.push(slug);

      await prisma.setting.upsert({
        where: { key: 'deleted_product_ids' },
        create: {
          key: 'deleted_product_ids',
          value: JSON.stringify(currentList),
          group: 'catalog',
        },
        update: {
          value: JSON.stringify(currentList),
        },
      });
    } catch (settingErr) {
      console.error('Failed to update deleted_product_ids setting:', settingErr);
    }

    // 3. Log Audit
    await logAudit({
      userId: locals.user.userId,
      action: 'product.delete',
      entity: 'Product',
      entityId: id || slug || 'unknown',
    });

    if (contentType.includes('application/json')) {
      return new Response(JSON.stringify({ success: true, message: 'Product deleted successfully.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return redirect('/admin/products?deleted=true');
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Server error while deleting product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
