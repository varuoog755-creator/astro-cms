import prisma from '../db';

export interface SeoOptions {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  preloadLcpImage?: string;
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
  const defaultSiteUrl = (process.env.PUBLIC_SITE_URL || 'https://teepul.com').replace(/\/+$/, '');
  
  // Clean canonical URL: ensure https, proper root, and no trailing slash unless homepage
  let canonical = defaultSiteUrl;
  if (options.canonicalUrl) {
    if (options.canonicalUrl.startsWith('http')) {
      canonical = options.canonicalUrl;
    } else {
      const cleanPath = options.canonicalUrl.startsWith('/') ? options.canonicalUrl : `/${options.canonicalUrl}`;
      canonical = `${defaultSiteUrl}${cleanPath}`;
    }
  }
  // Strip trailing slashes except for root
  if (canonical.length > defaultSiteUrl.length && canonical.endsWith('/')) {
    canonical = canonical.slice(0, -1);
  }

  const ogImage = options.ogImage || `${defaultSiteUrl}/teepul-header-logo.png`;
  const robots = options.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

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
      telephone: '+91-9896374239',
      email: 'Teepul755@gmail.com',
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

  const normalizeCurrency = (curr?: string) => {
    if (!curr || curr === '₹' || curr.toLowerCase().includes('rs')) return 'INR';
    return curr.toUpperCase();
  };

  // 4. Enhanced E-Commerce Product Schema (Rich Results, Brand, Merchant Return & Shipping)
  if (options.productData) {
    const p = options.productData;
    const currency = normalizeCurrency(p.currency);
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [p.image || ogImage],
      description,
      sku: p.sku || 'TP-CURTAIN',
      productID: p.sku || 'TP-CURTAIN',
      mpn: p.sku || 'TP-CURTAIN',
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
        priceCurrency: currency,
        price: typeof p.price === 'number' ? p.price.toFixed(2) : String(p.price),
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

  const productMeta = options.productData ? {
    retailerItemId: options.productData.sku || 'TP-CURTAIN',
    priceAmount: typeof options.productData.price === 'number' ? options.productData.price.toFixed(2) : String(options.productData.price),
    priceCurrency: normalizeCurrency(options.productData.currency),
    availability: options.productData.inStock !== false ? 'in stock' : 'out of stock',
    condition: 'new',
    brand: 'Teepul',
    category: options.productData.category || 'Home & Living > Curtains & Window Treatments',
  } : null;

  return {
    title: fullTitle,
    description,
    canonical,
    robots,
    ogImage,
    type: options.type || (options.productData ? 'product' : 'website'),
    siteName,
    preloadLcpImage: options.preloadLcpImage,
    jsonLd: JSON.stringify(jsonLd),
    productMeta,
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
