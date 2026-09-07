import type { APIRoute } from 'astro';
import { getStorefrontProducts } from '../../lib/products';
import { getIntegrationSettings } from '../../lib/settings';

export const GET: APIRoute = async ({ request }) => {
  const settings = await getIntegrationSettings();
  const origin = new URL(request.url).origin;

  const brandName = settings.gmc_brand_name || 'Teepul Streetwear';
  const currency = settings.gmc_currency || 'INR';

  const products = await getStorefrontProducts();
  const itemsXml = products.map((p) => {
    const productUrl = `${origin}/products/${p.slug}`;
    const imageUrl = p.images[0]?.startsWith('http') ? p.images[0] : `${origin}${p.images[0]}`;
    const availability = p.inStock ? 'in_stock' : 'out_of_stock';
    const condition = 'new';
    
    // Clean string for XML
    const escapeXml = (unsafe: string) => unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${p.price}.00 ${currency}</g:price>
      ${p.originalPrice ? `<g:sale_price>${p.price}.00 ${currency}</g:sale_price>` : ''}
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:brand>${escapeXml(brandName)}</g:brand>
      <g:item_group_id>${escapeXml(p.category)}</g:item_group_id>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
  }).join('');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${brandName} Product Catalog Feed</title>
    <link>${origin}/products</link>
    <description>Automated Google Merchant Center Product Feed for ${brandName}</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
