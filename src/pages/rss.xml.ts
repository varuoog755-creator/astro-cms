import type { APIRoute } from 'astro';
import prisma from '../lib/db';

export const GET: APIRoute = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: { author: true },
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Astro CMS Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Modern Astro &amp; TypeScript Content Management System</description>
    <language>en-us</language>
    ${posts
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description><![CDATA[${p.excerpt || ''}]]></description>
      <pubDate>${(p.publishedAt || p.createdAt).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${p.slug}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
