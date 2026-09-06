import type { APIRoute } from 'astro';
import prisma from '../lib/db';

export const GET: APIRoute = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

  const [posts, pages] = await Promise.all([
    prisma.post.findMany({ where: { status: 'published' } }),
    prisma.page.findMany({ where: { status: 'published' } }),
  ]);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${posts
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${(p.updatedAt || p.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${pages
    .map(
      (pg) => `
  <url>
    <loc>${baseUrl}/${pg.slug}</loc>
    <lastmod>${(pg.updatedAt || pg.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
