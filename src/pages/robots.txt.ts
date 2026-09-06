import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
