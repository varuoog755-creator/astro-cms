import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { hasPermission, PERMISSIONS } from '../../../../lib/permissions/rbac';
import { logAudit } from '../../../../lib/utilities/audit';
import { invalidateCache } from '../../../../lib/cache';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 403 });
  }

  const isAdmin = locals.user.role === 'Super Admin' || locals.user.role === 'Administrator' || hasPermission(locals.user, PERMISSIONS.POSTS_UPDATE);
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 403 });
  }

  const formData = await request.formData();
  const action = formData.get('_action')?.toString() || 'save';
  const id = formData.get('id')?.toString();

  // Delete product action
  if (action === 'delete' && id) {
    try {
      await prisma.product.deleteMany({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });
    } catch (err) {
      console.error('Failed to delete product from DB:', err);
    }

    try {
      const setting = await prisma.setting.findUnique({
        where: { key: 'deleted_product_ids' },
      });
      const currentList: string[] = setting?.value ? JSON.parse(setting.value) : [];
      if (!currentList.includes(id)) currentList.push(id);

      await prisma.setting.upsert({
        where: { key: 'deleted_product_ids' },
        create: {
          key: 'deleted_product_ids',
          value: JSON.stringify(currentList),
          group: 'catalog',
        },
        update: {
          value: JSON.stringify(currentList),
        },
      });
    } catch (settingErr) {
      console.error('Failed to update deleted_product_ids setting:', settingErr);
    }

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
  const packSize = formData.get('pack_size')?.toString().trim() || '';
  let finalTagline = tagline;
  if (packSize) {
    if (finalTagline.includes('Pack of')) {
      finalTagline = finalTagline.replace(/Pack of [0-9\/]+/i, packSize);
    } else if (finalTagline) {
      finalTagline = `${packSize} | ${finalTagline}`;
    } else {
      finalTagline = `${packSize} | Silver Eyelets Light Filtering & Thermal Insulation`;
    }
  }

  const description = formData.get('description')?.toString().trim() || '';
  const price = parseFloat(formData.get('price')?.toString() || '0');
  const originalPriceStr = formData.get('originalPrice')?.toString();
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
  const category = formData.get('category')?.toString() || 'Door Curtains';
  const badge = formData.get('badge')?.toString() || '';
  const gsm = 280;
  const material = formData.get('material')?.toString() || '100% Premium Polyester';
  const fit = formData.get('fit')?.toString() || 'Stainless Steel Silver Eyelets';
  const care = formData.get('care')?.toString() || 'Hand & Machine Wash Cold';
  const inStock = formData.has('inStock');

  const colorsRaw = formData.get('colors')?.toString() || 'Royal Cream Ivory, Warm Beige';
  const colorsArray = colorsRaw.split(',').map((c) => ({ name: c.trim(), hex: '#d4af37' }));

  let sizesArray: { name: string; price: number; originalPrice?: number; stock?: number; inStock?: boolean }[] = [];

  // 1. Check if structured JSON was submitted
  const sizesJsonRaw = formData.get('sizes_json')?.toString();
  if (sizesJsonRaw) {
    try {
      const parsed = JSON.parse(sizesJsonRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sizesArray = parsed
          .filter((item: any) => item && typeof item === 'object' && item.name?.toString().trim())
          .map((item: any) => ({
            name: item.name.toString().trim(),
            price: !isNaN(parseFloat(item.price)) ? parseFloat(item.price) : price,
            originalPrice: !isNaN(parseFloat(item.originalPrice)) ? parseFloat(item.originalPrice) : (originalPrice || undefined),
            stock: !isNaN(parseInt(item.stock, 10)) ? parseInt(item.stock, 10) : 50,
            inStock: item.inStock !== false && item.inStock !== 'false',
          }));
      }
    } catch (e) {
      console.error('Failed to parse sizes_json:', e);
    }
  }

  // 2. Check if multi-field inputs were submitted
  if (sizesArray.length === 0) {
    const sizeNames = formData.getAll('size_name').map((s) => s.toString().trim()).filter(Boolean);
    const sizePrices = formData.getAll('size_price').map((p) => parseFloat(p.toString()));
    const sizeOrigPrices = formData.getAll('size_original_price').map((p) => parseFloat(p.toString()));
    const sizeStocks = formData.getAll('size_stock').map((s) => parseInt(s.toString(), 10));
    const sizeInStocks = formData.getAll('size_in_stock').map((s) => s.toString() !== 'false');

    if (sizeNames.length > 0) {
      sizesArray = sizeNames.map((sName, i) => ({
        name: sName,
        price: !isNaN(sizePrices[i]) ? sizePrices[i] : price,
        originalPrice: !isNaN(sizeOrigPrices[i]) ? sizeOrigPrices[i] : (originalPrice || undefined),
        stock: !isNaN(sizeStocks[i]) ? sizeStocks[i] : 50,
        inStock: sizeInStocks[i] !== undefined ? sizeInStocks[i] : true,
      }));
    }
  }

  // 3. Fallback to comma/colon string format e.g. "5 Feet: 499, 7 Feet: 699" or "5 Feet, 7 Feet"
  if (sizesArray.length === 0) {
    const sizesRaw = formData.get('sizes')?.toString() || '5 Feet, 6 Feet, 7 Feet, 9 Feet';
    sizesArray = sizesRaw.split(',').map((s) => {
      const trimmed = s.trim();
      if (trimmed.includes(':')) {
        const [sName, sPrice] = trimmed.split(':');
        const pVal = parseFloat(sPrice?.trim() || '');
        return {
          name: sName.trim(),
          price: !isNaN(pVal) ? pVal : price,
          originalPrice: originalPrice || undefined,
          stock: 50,
          inStock: true,
        };
      }
      return {
        name: trimmed,
        price,
        originalPrice: originalPrice || undefined,
        stock: 50,
        inStock: true,
      };
    }).filter((s) => Boolean(s.name));
  }

  const imagesRaw = formData.get('images')?.toString() || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80';
  const imagesArray = imagesRaw
    .split('\n')
    .map((i) => {
      const trimmed = i.trim();
      if (trimmed.includes('ibb.co/MDrxVyJY')) {
        return '/uploads/grey-eyelet-curtain-front.webp';
      }
      return trimmed;
    })
    .filter(Boolean);

  const featuresRaw = formData.get('features')?.toString() || '100% Heavyweight Polyester, 99% Thermal Blackout, Stainless Steel Eyelets';
  const featuresArray = featuresRaw.split(',').map((f) => f.trim());

  if (!name || isNaN(price)) {
    return redirect('/admin/products/new?error=Product Name and Valid Price are required.');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (id) {
    // Upsert existing product (works even if loaded from initial catalog)
    await prisma.product.upsert({
      where: { id },
      create: {
        id,
        name,
        slug,
        tagline: finalTagline,
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
      update: {
        name,
        slug,
        tagline: finalTagline,
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
        tagline: finalTagline,
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

  invalidateCache('storefront_products');
  return redirect('/admin/products?saved=true');
};
