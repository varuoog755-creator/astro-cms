import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions/rbac';
import { logAudit } from '../../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user || !hasPermission(locals.user, PERMISSIONS.POSTS_EDIT)) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const action = formData.get('_action')?.toString() || 'save';
  const id = formData.get('id')?.toString();

  // Delete product action
  if (action === 'delete' && id) {
    await prisma.product.delete({ where: { id } });
    await logAudit({
      userId: locals.user.userId,
      action: 'product.delete',
      entity: 'Product',
      entityId: id,
    });
    return redirect('/admin/products?deleted=true');
  }

  // Save / Update product
  const name = formData.get('name')?.toString().trim();
  const tagline = formData.get('tagline')?.toString().trim() || '';
  const description = formData.get('description')?.toString().trim() || '';
  const price = parseFloat(formData.get('price')?.toString() || '0');
  const originalPriceStr = formData.get('originalPrice')?.toString();
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
  const category = formData.get('category')?.toString() || 'Door Curtains';
  const badge = formData.get('badge')?.toString() || '';
  const gsm = parseInt(formData.get('gsm')?.toString() || '350', 10);
  const material = formData.get('material')?.toString() || 'Micro-Velvet';
  const fit = formData.get('fit')?.toString() || 'Grommet Top';
  const care = formData.get('care')?.toString() || 'Dry Clean';
  const inStock = formData.has('inStock');

  const colorsRaw = formData.get('colors')?.toString() || 'Royal Cream Ivory, Warm Beige';
  const colorsArray = colorsRaw.split(',').map((c) => ({ name: c.trim(), hex: '#d4af37' }));

  const sizesRaw = formData.get('sizes')?.toString() || '7 Foot (Door), 9 Foot (Long Door)';
  const sizesArray = sizesRaw.split(',').map((s) => s.trim());

  const imagesRaw = formData.get('images')?.toString() || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80';
  const imagesArray = imagesRaw.split('\n').map((i) => i.trim()).filter(Boolean);

  const featuresRaw = formData.get('features')?.toString() || '350 GSM Fabric, 99% Thermal Blackout, Brass Ring Grommets';
  const featuresArray = featuresRaw.split(',').map((f) => f.trim());

  if (!name || isNaN(price)) {
    return redirect('/admin/products/new?error=Product Name and Valid Price are required.');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (id) {
    // Update existing product
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        tagline,
        description,
        price,
        originalPrice,
        category,
        badge,
        gsm,
        material,
        fit,
        care,
        inStock,
        colorsJson: JSON.stringify(colorsArray),
        sizesJson: JSON.stringify(sizesArray),
        imagesJson: JSON.stringify(imagesArray),
        featuresJson: JSON.stringify(featuresArray),
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'product.update',
      entity: 'Product',
      entityId: id,
    });
  } else {
    // Create new product
    await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        tagline,
        description,
        price,
        originalPrice,
        category,
        badge,
        gsm,
        material,
        fit,
        care,
        inStock,
        colorsJson: JSON.stringify(colorsArray),
        sizesJson: JSON.stringify(sizesArray),
        imagesJson: JSON.stringify(imagesArray),
        featuresJson: JSON.stringify(featuresArray),
      },
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'product.create',
      entity: 'Product',
    });
  }

  return redirect('/admin/products?saved=true');
};
