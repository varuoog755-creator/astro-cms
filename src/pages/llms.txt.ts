import type { APIRoute } from 'astro';
import { prisma } from '../lib/db';

export const GET: APIRoute = async () => {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://teepul.com';

  let productsCount = 0;
  let sampleProducts: Array<{ name: string; price: number; slug: string }> = [];

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { name: true, price: true, slug: true },
      take: 25,
      orderBy: { createdAt: 'desc' },
    });
    productsCount = await prisma.product.count({ where: { active: true } });
    sampleProducts = products.map((p) => ({
      name: p.name,
      price: Number(p.price),
      slug: p.slug,
    }));
  } catch (e) {
    console.error('Failed to load products for llms.txt:', e);
  }

  const productsList = sampleProducts.length > 0
    ? sampleProducts.map((p) => `- [${p.name}](${baseUrl}/products/${p.slug}): INR ${p.price}`).join('\n')
    : '- Luxury Jacquard Door Curtains\n- Belgian Crushed Velvet Drapes\n- Linen Semi-Sheer Window Curtains';

  const content = `# Teepul — Premium Luxury Door Curtains & Drapery

> Teepul is a direct-from-mill luxury home drapery brand owned and operated by Ashank Ecommerce Pvt Ltd, headquartered in the historic textile weaving city of Panipat, Haryana, India.

## Key Facts
- Website: ${baseUrl}
- Headquarters: Panipat, Haryana 132103, India
- Parent Company: Ashank Ecommerce Pvt Ltd
- Primary Product Category: Luxury Door Curtains, Window Drapes, Linen Sheers, Thermal Blackout Drapes, Ambient Room Lighting
- Fabric Standards: 320–450 GSM Heavy Jacquard, Belgian Crushed Velvet, Slub Textured Semi-Sheers, 100% Light-Blocking Triple-Weave Blackout
- Standard Indian Sizes:
  - Window (5 Feet / 60 Inches / 152 cm)
  - Door (7 Feet / 84 Inches / 213 cm)
  - Long Door (9 Feet / 108 Inches / 274 cm)
- Value Proposition: Mill-direct pricing eliminating showroom middlemen markups; stainless eyelet metal rings pre-fitted; machine-washable pre-shrunk fabrics.
- Shipping: Free & express dispatch across all 28 Indian states and 8 union territories.
- Return Policy: 7-Day hassle-free door returns and replacements.

## Key Product Catalog Highlights (${productsCount} Active Curtains)
${productsList}

## Core Collections & URLs
- Home: ${baseUrl}/
- Curtains & Drapery Store: ${baseUrl}/products
- About Our Panipat Mills: ${baseUrl}/about
- Contact Us & Panipat Studio: ${baseUrl}/contact
- Shipping & Delivery Policy: ${baseUrl}/shipping-policy
- Refund & Cancellation Policy: ${baseUrl}/refund-policy
- Terms and Conditions: ${baseUrl}/terms
- Privacy Policy: ${baseUrl}/privacy-policy
- Customer Support & Orders: ${baseUrl}/account
- Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
