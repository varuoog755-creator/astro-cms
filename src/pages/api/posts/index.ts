import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { logAudit } from '../../../lib/utilities/audit';

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published' },
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { author: true, categories: { include: { category: true } } },
    }),
    prisma.post.count({ where: { status: 'published' } }),
  ]);

  return new Response(
    JSON.stringify({
      success: true,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.POSTS_CREATE)) {
    return new Response(JSON.stringify({ error: 'Unauthorized permission' }), { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString().trim();
    let slug = formData.get('slug')?.toString().trim().toLowerCase();
    const excerpt = formData.get('excerpt')?.toString();
    const content = formData.get('content')?.toString() || '[]';
    const status = formData.get('status')?.toString() || 'draft';
    const seoTitle = formData.get('seoTitle')?.toString();
    const metaDescription = formData.get('metaDescription')?.toString();

    const categoryIds = formData.getAll('categories').map((c) => c.toString());
    const tagIds = formData.getAll('tags').map((t) => t.toString());

    if (!title) {
      return redirect('/admin/posts/new?error=Title is required.');
    }

    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Slug collision handling
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        status,
        publishedAt: status === 'published' ? new Date() : null,
        authorId: locals.user.userId,
        categories: {
          create: categoryIds.map((cid) => ({ categoryId: cid })),
        },
        tags: {
          create: tagIds.map((tid) => ({ tagId: tid })),
        },
      },
    });

    if (seoTitle || metaDescription) {
      await prisma.seoMetadata.create({
        data: {
          entityType: 'post',
          entityId: post.id,
          seoTitle,
          metaDescription,
        },
      });
    }

    await logAudit({
      userId: locals.user.userId,
      action: 'post.create',
      entity: 'Post',
      entityId: post.id,
      metadata: { title, status },
    });

    return redirect('/admin/posts');
  } catch (err: any) {
    console.error('Create post error:', err);
    return redirect('/admin/posts/new?error=Failed to create post.');
  }
};
