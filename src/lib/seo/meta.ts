import prisma from '../db';

export interface SeoOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  productData?: {
    name: string;
    price: number;
    currency: string;
    sku?: string;
    inStock?: boolean;
    rating?: number;
    reviewCount?: number;
    image?: string;
    category?: string;
  };
}

export function generateSeoMetadata(options: SeoOptions) {
  const siteName = 'Teepul Luxury Curtains & Home Decor';
  const fullTitle = `${options.title} | ${siteName}`;
  const description = options.description || 'Teepul Luxury Door Curtains, French Sheer Drapery & Ambient Home Lighting. Panipat Factory Direct.';
  const defaultSiteUrl = process.env.PUBLIC_SITE_URL || 'https://teepul.com';
  const canonical = options.canonicalUrl || defaultSiteUrl;
  const ogImage = options.ogImage || `${defaultSiteUrl}/teepul-header-logo.png`;

  const jsonLd: Record<string, any>[] = [];

  // 1. Organization & Local Business Manufacturer Schema (Crucial for GEO & Entity Authority)
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: 'Teepul',
    legalName: 'Ashank Ecommerce Private Limited',
    url: defaultSiteUrl,
    logo: `${defaultSiteUrl}/teepul-logo-transparent.png`,
    image: `${defaultSiteUrl}/panipat-factory-unit.jpg`,
    description: 'Direct manufacturer and online retailer of luxury thermal blackout curtains, light filtering polyester drapery, and ambient home decor in Panipat, Haryana.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 25, HSIIDC Industrial Area',
      addressLocality: 'Panipat',
      addressRegion: 'Haryana',
      postalCode: '132103',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.3909,
      longitude: 76.9635,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash on Delivery, Credit Card, Debit Card, UPI, Paytm, NetBanking',
  });

  // 2. WebSite Schema with Sitelinks SearchBox
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: defaultSiteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultSiteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

  // 3. Article Schema (for Blog Posts)
  if (options.type === 'article') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.title,
      description,
      image: [ogImage],
      datePublished: options.publishedTime || new Date().toISOString(),
      dateModified: options.modifiedTime || options.publishedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: options.authorName || 'Teepul Home Styling Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Teepul',
        logo: {
          '@type': 'ImageObject',
          url: `${defaultSiteUrl}/teepul-logo-transparent.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
    });
  }

  // 4. Enhanced E-Commerce Product Schema (Rich Results, Brand, Merchant Return & Shipping)
  if (options.productData) {
    const p = options.productData;
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [p.image || ogImage],
      description,
      sku: p.sku || 'TP-CURTAIN',
      brand: {
        '@type': 'Brand',
        name: 'Teepul',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Ashank Ecommerce Private Limited',
      },
      category: p.category || 'Home & Living > Curtains & Window Treatments',
      offers: {
        '@type': 'Offer',
        priceCurrency: p.currency || 'INR',
        price: p.price,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: p.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: canonical,
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'INR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'd',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 5,
              unitCode: 'd',
            },
          },
        },
      },
      ...(p.rating ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: p.rating,
          reviewCount: p.reviewCount || 42,
          bestRating: '5',
          worstRating: '1',
        },
      } : {}),
    });
  }

  // 5. FAQPage Schema (AEO / Answer Engine Optimization for Rich Snippets)
  if (options.faqs && options.faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: options.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  // 6. BreadcrumbList Schema
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `${defaultSiteUrl}${b.url}`,
      })),
    });
  }

  return {
    title: fullTitle,
    description,
    canonical,
    ogImage,
    type: options.type || 'website',
    siteName,
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
