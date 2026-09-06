import type { APIRoute } from 'astro';
import { PRODUCTS_CATALOG } from '../lib/products';
import prisma from '../lib/db';

export const GET: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;

  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    select: { slug: true, updatedAt: true },
  });

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/products', priority: '0.9', changefreq: 'daily' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
  ];

  const productUrls = PRODUCTS_CATALOG.map((p) => ({
    loc: `/products/${p.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const postUrls = posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticUrls, ...productUrls, ...postUrls];

  const urlXml = allUrls.map((u) => `
  <url>
    <loc>${origin}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlXml}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
