import type { APIRoute } from 'astro';
import { getStorefrontProducts } from '../../lib/products';
import { normalizeProductSizes } from '../../lib/products';

export const GET: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const products = await getStorefrontProducts();

  const escapeCsv = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${clean}"`;
  };

  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'sale_price',
    'link',
    'image_link',
    'brand',
    'item_group_id',
    'color',
    'size',
    'google_product_category',
    'fb_product_category',
  ];

  const rows: string[] = [headers.join(',')];

  for (const p of products) {
    const productUrl = `${origin}/products/${p.slug}`;
    const mainImage = p.images.find((img) => img.startsWith('http')) || `${origin}${p.images[0]}`;
    const availability = p.inStock ? 'in stock' : 'out of stock';
    const sizes = normalizeProductSizes(p.sizes, p.price, p.originalPrice);
    const colors = p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Standard', hex: '#000000', images: undefined }];

    // 1. Root slug item (exact match for pixel events)
    const minSize = sizes[0];
    const rootOrigPrice = `${minSize?.originalPrice || p.originalPrice || p.price}.00 INR`;
    const rootSalePrice = `${p.price}.00 INR`;

    rows.push([
      escapeCsv(p.slug),
      escapeCsv(p.name),
      escapeCsv(p.description || p.name),
      escapeCsv(availability),
      escapeCsv('new'),
      escapeCsv(rootOrigPrice),
      escapeCsv(rootSalePrice),
      escapeCsv(productUrl),
      escapeCsv(mainImage.startsWith('http') ? mainImage : `${origin}${mainImage}`),
      escapeCsv('Teepul'),
      escapeCsv(p.slug),
      escapeCsv(''),
      escapeCsv(''),
      escapeCsv('602'),
      escapeCsv('Home & Garden > Linens & Bedding > Window Treatments > Curtains & Drapes'),
    ].join(','));

    // 2. Per-variant items
    for (const color of colors) {
      const colorImage = (color.images && color.images.length > 0) ? color.images[0] : mainImage;
      const finalImage = colorImage.startsWith('http') ? colorImage : `${origin}${colorImage}`;

      for (const size of sizes) {
        const sizeKey = size.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const colorKey = color.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const variantId = `${p.slug}--${colorKey}--${sizeKey}`;

        const salePrice = `${size.price}.00 INR`;
        const origPrice = `${size.originalPrice || size.price}.00 INR`;

        rows.push([
          escapeCsv(variantId),
          escapeCsv(`${p.name} - ${color.name} - ${size.name}`),
          escapeCsv(p.description || p.name),
          escapeCsv(availability),
          escapeCsv('new'),
          escapeCsv(origPrice),
          escapeCsv(salePrice),
          escapeCsv(productUrl),
          escapeCsv(finalImage),
          escapeCsv('Teepul'),
          escapeCsv(p.slug),
          escapeCsv(color.name),
          escapeCsv(size.name),
          escapeCsv('602'),
          escapeCsv('Home & Garden > Linens & Bedding > Window Treatments > Curtains & Drapes'),
        ].join(','));
      }
    }
  }

  return new Response(rows.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
