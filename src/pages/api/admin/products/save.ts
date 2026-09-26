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
  const gsm = 150;
  const material = formData.get('material')?.toString() || '100% Premium Polyester';
  const fit = formData.get('fit')?.toString() || 'Stainless Steel Silver Eyelets';
  const care = formData.get('care')?.toString() || 'Hand & Machine Wash Cold';
  const inStock = formData.has('inStock');

  // Find existing product if id is provided
  let existingProduct: any = null;
  if (id) {
    try {
      existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        existingProduct = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: id }] } });
      }
    } catch (e) {
      console.error('Error finding existing product:', e);
    }
  }

  // Preserve existing slug unless explicitly provided
  let slug = formData.get('slug')?.toString().trim();
  if (!slug && existingProduct?.slug) {
    slug = existingProduct.slug;
  }
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Images handling: parse user submitted URLs
  const imagesRaw = formData.get('images')?.toString();
  let imagesArray: string[] = [];
  if (typeof imagesRaw === 'string') {
    imagesArray = imagesRaw
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean)
      .map((i) => {
        if (i.includes('ibb.co/MDrxVyJY')) {
          return '/uploads/grey-eyelet-curtain-front.webp';
        }
        return i;
      });
  }

  // Only fallback if brand new product and no images provided
  if (!id && imagesArray.length === 0) {
    imagesArray = ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'];
  }

  // Colors & Variant Images handling
  let finalColorsArray: any[] = [];
  const colorsJsonRaw = formData.get('colors_json')?.toString();
  if (colorsJsonRaw) {
    try {
      const parsed = JSON.parse(colorsJsonRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        finalColorsArray = parsed.map((c: any) => {
          let cImages: string[] = [];
          if (Array.isArray(c.images)) {
            cImages = c.images.map((img: any) => (typeof img === 'string' ? img.trim() : '')).filter(Boolean);
          } else if (typeof c.images === 'string') {
            cImages = c.images.split('\n').map((img: string) => img.trim()).filter(Boolean);
          }
          return {
            name: (c.name || 'Color').toString().trim(),
            hex: (c.hex || '#d4af37').toString().trim(),
            images: cImages,
          };
        });
      }
    } catch (e) {
      console.error('Error parsing colors_json:', e);
    }
  }

  // If no structured colors_json provided, fallback to comma-separated colors
  if (finalColorsArray.length === 0) {
    const colorsRaw = formData.get('colors')?.toString() || '';
    const colorNames = colorsRaw.split(',').map((c) => c.trim()).filter(Boolean);

    if (existingProduct?.colorsJson) {
      try {
        const parsed = JSON.parse(existingProduct.colorsJson);
        if (Array.isArray(parsed)) finalColorsArray = parsed;
      } catch (e) {}
    }

    if (finalColorsArray.length === 0 && colorNames.length > 0) {
      finalColorsArray = colorNames.map((cName) => ({
        name: cName,
        hex: '#d4af37',
        images: [...imagesArray],
      }));
    } else if (finalColorsArray.length === 0) {
      finalColorsArray = [
        {
          name: 'Standard',
          hex: '#d4af37',
          images: [...imagesArray],
        },
      ];
    }
  }

  // Aggregate all variant images into imagesArray if imagesArray is empty
  const variantAllImages: string[] = [];
  finalColorsArray.forEach((c) => {
    if (Array.isArray(c.images)) {
      c.images.forEach((img: string) => {
        if (img && !variantAllImages.includes(img)) variantAllImages.push(img);
      });
    }
  });

  if (imagesArray.length === 0 && variantAllImages.length > 0) {
    imagesArray = [...variantAllImages];
  } else if (variantAllImages.length > 0) {
    // Ensure variant images are also present in imagesArray
    variantAllImages.forEach((vImg) => {
      if (!imagesArray.includes(vImg)) imagesArray.push(vImg);
    });
  }

  // If a color variant has empty images, give it imagesArray as default
  finalColorsArray = finalColorsArray.map((c) => ({
    ...c,
    images: (Array.isArray(c.images) && c.images.length > 0) ? c.images : [...imagesArray],
  }));

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
    const sizesRaw = formData.get('sizes')?.toString() || '5 Feet, 7 Feet, 9 Feet';
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

  const featuresRaw = formData.get('features')?.toString() || '100% Heavyweight Polyester, 99% Thermal Blackout, Stainless Steel Eyelets';
  const featuresArray = featuresRaw.split(',').map((f) => f.trim());

  if (!name || isNaN(price)) {
    return redirect('/admin/products/new?error=Product Name and Valid Price are required.');
  }

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
        colorsJson: JSON.stringify(finalColorsArray),
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
        colorsJson: JSON.stringify(finalColorsArray),
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
        colorsJson: JSON.stringify(finalColorsArray),
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

  invalidateCache(); // Full cache clear so all products and categories update immediately
  return redirect('/admin/products?saved=true');
};
