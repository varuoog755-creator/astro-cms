import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://teepul.com';

  const content = `# Teepul Luxury Home & Drapery Robots Policy
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /account

# AI & Search Engine Crawlers (AEO / GEO / Search)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

# Sitemaps & Machine-Readable Context
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
