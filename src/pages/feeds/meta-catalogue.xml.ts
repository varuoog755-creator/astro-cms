import type { APIRoute } from 'astro';
import { getStorefrontProducts } from '../../lib/products';
import { normalizeProductSizes } from '../../lib/products';

export const GET: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const products = await getStorefrontProducts();

  const escapeXml = (s: string) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const items: string[] = [];

  for (const p of products) {
    const productUrl = `${origin}/products/${p.slug}`;
    const mainImage = p.images.find((img) => img.startsWith('http')) || `${origin}${p.images[0]}`;
    const availability = p.inStock ? 'in stock' : 'out of stock';

    // Normalize sizes to always have price data
    const sizes = normalizeProductSizes(p.sizes, p.price, p.originalPrice);

    // Multi-color: create one item per color variant (improves match rate)
    const colors = p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Standard', hex: '#000000', images: undefined }];

    for (const color of colors) {
      // Use first color-specific image if available, else product main image
      const colorImage = (color.images && color.images.length > 0)
        ? color.images[0]
        : mainImage;
      const finalImage = colorImage.startsWith('http') ? colorImage : `${origin}${colorImage}`;

      for (const size of sizes) {
        // id format: slug--color--size (unique per variant, URL-safe)
        const sizeKey = size.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const colorKey = color.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const variantId = `${p.slug}--${colorKey}--${sizeKey}`;

        const salePrice = size.price;
        const origPrice = size.originalPrice || salePrice;

        items.push(`
  <item>
    <id>${escapeXml(variantId)}</id>
    <title>${escapeXml(`${p.name} - ${color.name} - ${size.name}`)}</title>
    <description>${escapeXml(p.description || p.name)}</description>
    <link>${escapeXml(productUrl)}</link>
    <image_link>${escapeXml(finalImage)}</image_link>
    <condition>new</condition>
    <availability>${availability}</availability>
    <price>${origPrice}.00 INR</price>
    <sale_price>${salePrice}.00 INR</sale_price>
    <brand>Teepul</brand>
    <item_group_id>${escapeXml(p.slug)}</item_group_id>
    <color>${escapeXml(color.name)}</color>
    <size>${escapeXml(size.name)}</size>
    <google_product_category>602</google_product_category>
    <product_type>Home &amp; Living &gt; Curtains &amp; Window Treatments</product_type>
    <custom_label_0>${escapeXml(p.category || 'Curtains')}</custom_label_0>
  </item>`);
      }
    }

    // Also add a root slug-only item so Pixel events (content_ids: [slug]) match
    const minSize = sizes[0];
    items.push(`
  <item>
    <id>${escapeXml(p.slug)}</id>
    <title>${escapeXml(p.name)}</title>
    <description>${escapeXml(p.description || p.name)}</description>
    <link>${escapeXml(productUrl)}</link>
    <image_link>${escapeXml(mainImage.startsWith('http') ? mainImage : `${origin}${mainImage}`)}</image_link>
    <condition>new</condition>
    <availability>${availability}</availability>
    <price>${minSize?.originalPrice || p.originalPrice || p.price}.00 INR</price>
    <sale_price>${p.price}.00 INR</sale_price>
    <brand>Teepul</brand>
    <item_group_id>${escapeXml(p.slug)}</item_group_id>
    <google_product_category>602</google_product_category>
    <product_type>Home &amp; Living &gt; Curtains &amp; Window Treatments</product_type>
    <custom_label_0>${escapeXml(p.category || 'Curtains')}</custom_label_0>
  </item>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Teepul Meta Commerce Product Catalogue</title>
    <link>${origin}/products</link>
    <description>Meta / Facebook Commerce Catalogue Feed — Teepul Luxury Curtains</description>
    ${items.join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
