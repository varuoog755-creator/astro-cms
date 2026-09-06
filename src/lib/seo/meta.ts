import prisma from '../db';

export interface SeoOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function generateSeoMetadata(options: SeoOptions) {
  const siteName = 'Astro CMS';
  const fullTitle = `${options.title} | ${siteName}`;
  const description = options.description || 'A modern Astro & TypeScript Content Management System.';
  const canonical = options.canonicalUrl || 'http://localhost:4321';
  const ogImage = options.ogImage || `${canonical}/images/og-default.png`;

  const jsonLd: Record<string, any>[] = [];

  // WebSite schema
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: canonical,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonical}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

  // Article schema if type is article
  if (options.type === 'article') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.title,
      description,
      image: [ogImage],
      datePublished: options.publishedTime,
      dateModified: options.modifiedTime || options.publishedTime,
      author: {
        '@type': 'Person',
        name: options.authorName || 'Editor',
      },
    });
  }

  // Breadcrumb schema
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  return {
    title: fullTitle,
    description,
    canonical,
    ogImage,
    type: options.type || 'website',
    jsonLd: JSON.stringify(jsonLd),
  };
}

export async function createRedirectOnSlugChange(sourceUrl: string, targetUrl: string) {
  if (sourceUrl === targetUrl) return;
  try {
    await prisma.redirect.upsert({
      where: { sourceUrl },
      update: { targetUrl },
      create: { sourceUrl, targetUrl, statusCode: 301 },
    });
  } catch (err) {
    console.error('Failed to create redirect:', err);
  }
}
