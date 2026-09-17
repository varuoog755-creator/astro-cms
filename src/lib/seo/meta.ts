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
  productData?: {
    name: string;
    price: number;
    currency: string;
    sku?: string;
    inStock?: boolean;
    rating?: number;
    reviewCount?: number;
    image?: string;
  };
}

export function generateSeoMetadata(options: SeoOptions) {
  const siteName = 'Teepul Luxury Curtains & Home Decor';
  const fullTitle = `${options.title} | ${siteName}`;
  const description = options.description || 'Teepul Luxury Door Curtains, Sheer Drapery & Ambient Lighting.';
  const defaultSiteUrl = process.env.PUBLIC_SITE_URL || 'https://teepul.com';
  const canonical = options.canonicalUrl || defaultSiteUrl;
  const ogImage = options.ogImage || `${canonical}/teepul-logo.png`;

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

  // Product schema
  if (options.productData) {
    const p = options.productData;
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [p.image || ogImage],
      description,
      sku: p.sku,
      offers: {
        '@type': 'Offer',
        priceCurrency: p.currency || 'INR',
        price: p.price,
        availability: p.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      ...(p.rating ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: p.rating,
          reviewCount: p.reviewCount || 1,
        },
      } : {}),
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
