import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../lib/permissions/rbac';
import { createRedirectOnSlugChange } from '../../../lib/seo/meta';
import { logAudit } from '../../../lib/utilities/audit';

export const POST: APIRoute = async (context) => {
  const { request, params, redirect, locals } = context;
  const id = params.id;

  if (!id) return new Response('Missing ID', { status: 400 });

  const formData = await request.formData();
  const methodOverride = formData.get('_method')?.toString();

  if (methodOverride === 'DELETE') {
    return DELETE(context);
  }

  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.POSTS_UPDATE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return redirect('/admin/posts');

    const title = formData.get('title')?.toString().trim();
    let slug = formData.get('slug')?.toString().trim().toLowerCase();
    const excerpt = formData.get('excerpt')?.toString();
    const content = formData.get('content')?.toString() || '[]';
    const status = formData.get('status')?.toString() || existingPost.status;

    const categoryIds = formData.getAll('categories').map((c) => c.toString());
    const tagIds = formData.getAll('tags').map((t) => t.toString());

    if (slug && slug !== existingPost.slug) {
      await createRedirectOnSlugChange(`/blog/${existingPost.slug}`, `/blog/${slug}`);
    }

    // Save revision history before update
    await prisma.revision.create({
      data: {
        entityType: 'post',
        entityId: id,
        title: existingPost.title,
        content: existingPost.content,
        authorId: locals.user.userId,
      },
    });

    // Update categories & tags relations
    await prisma.postCategory.deleteMany({ where: { postId: id } });
    await prisma.postTag.deleteMany({ where: { postId: id } });

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: slug || existingPost.slug,
        excerpt,
        content,
        status,
        publishedAt: status === 'published' && !existingPost.publishedAt ? new Date() : existingPost.publishedAt,
        categories: {
          create: categoryIds.map((cid) => ({ categoryId: cid })),
        },
        tags: {
          create: tagIds.map((tid) => ({ tagId: tid })),
        },
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'post.update',
      entity: 'Post',
      entityId: id,
    });

    return redirect(`/admin/posts/${id}`);
  } catch (err) {
    console.error('Update post error:', err);
    return redirect(`/admin/posts/${id}?error=Update failed`);
  }
};

export const DELETE: APIRoute = async ({ params, locals, redirect }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.POSTS_DELETE)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const id = params.id;
  if (!id) return new Response('Missing ID', { status: 400 });

  await prisma.post.update({
    where: { id },
    data: { status: 'trash' },
  });

  await logAudit({
    userId: locals.user.userId,
    action: 'post.trash',
    entity: 'Post',
    entityId: id,
  });

  return redirect('/admin/posts');
};
