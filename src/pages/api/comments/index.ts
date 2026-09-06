import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const postId = formData.get('postId')?.toString();
    const authorName = formData.get('authorName')?.toString().trim();
    const authorEmail = formData.get('authorEmail')?.toString().trim();
    const content = formData.get('content')?.toString().trim();
    const websiteHoneypot = formData.get('website')?.toString(); // Honeypot field for anti-spam

    if (!postId || !authorName || !authorEmail || !content) {
      return redirect(`/blog?error=Missing required comment fields`);
    }

    // Anti-spam check: if honeypot is filled, silent reject or mark as spam
    const status = websiteHoneypot ? 'spam' : 'pending';

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return redirect('/blog');

    await prisma.comment.create({
      data: {
        postId,
        authorName,
        authorEmail,
        content,
        status,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
      },
    });

    return redirect(`/blog/${post.slug}?comment=submitted`);
  } catch (err) {
    console.error('Comment submission error:', err);
    return redirect('/blog');
  }
};
