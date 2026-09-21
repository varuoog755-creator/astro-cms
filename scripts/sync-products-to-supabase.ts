import { PrismaClient } from '@prisma/client';
import { PRODUCTS_CATALOG, normalizeProductSizes } from '../src/lib/products.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Supabase Products Catalog Synchronization...');
  console.log(`📦 Total Catalog Products to Sync: ${PRODUCTS_CATALOG.length}`);

  let updatedCount = 0;
  let createdCount = 0;

  for (const cat of PRODUCTS_CATALOG) {
    const normalizedSizes = normalizeProductSizes(cat.sizes, cat.price, cat.originalPrice);

    const dataPayload = {
      name: cat.name,
      tagline: cat.tagline,
      description: cat.description,
      price: cat.price,
      originalPrice: cat.originalPrice || null,
      currency: cat.currency || '₹',
      category: cat.category,
      badge: cat.badge || null,
      rating: cat.rating || 4.5,
      reviewCount: cat.reviewCount || 50,
      inStock: cat.inStock !== false,
      colorsJson: JSON.stringify(cat.colors || []),
      sizesJson: JSON.stringify(normalizedSizes),
      imagesJson: JSON.stringify(cat.images || []),
      featuresJson: JSON.stringify(cat.features || []),
      gsm: cat.fabricSpecs?.gsm || 280,
      material: cat.fabricSpecs?.material || '100% Premium Polyester',
      fit: cat.fabricSpecs?.fit || 'Silver Eyelet Grommets',
      care: cat.fabricSpecs?.care || 'Hand & Machine Wash Cold',
    };

    // First check if product exists by slug
    const existingBySlug = await prisma.product.findUnique({
      where: { slug: cat.slug },
    });

    if (existingBySlug) {
      // Update the existing record in Supabase
      await prisma.product.update({
        where: { id: existingBySlug.id },
        data: dataPayload,
      });
      console.log(`✅ [UPDATED BY SLUG] ${existingBySlug.id} -> ${cat.name} (${cat.category})`);
      updatedCount++;
    } else {
      // Check if product exists by ID
      const existingById = await prisma.product.findUnique({
        where: { id: cat.id },
      });

      if (existingById) {
        await prisma.product.update({
          where: { id: cat.id },
          data: {
            ...dataPayload,
            slug: cat.slug,
          },
        });
        console.log(`✅ [UPDATED BY ID] ${cat.id} -> ${cat.name}`);
        updatedCount++;
      } else {
        await prisma.product.create({
          data: {
            id: cat.id,
            slug: cat.slug,
            ...dataPayload,
          },
        });
        console.log(`✨ [CREATED] ${cat.id} -> ${cat.name}`);
        createdCount++;
      }
    }
  }

  console.log('\n📊 Synchronization Summary:');
  console.log(`- Total Catalog Products: ${PRODUCTS_CATALOG.length}`);
  console.log(`- Updated in Supabase: ${updatedCount}`);
  console.log(`- Newly Created in Supabase: ${createdCount}`);

  // Fetch all products from Supabase to verify
  const allDbProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      category: true,
      price: true,
      sizesJson: true,
    }
  });

  console.log(`\n🎉 Total Products in Supabase PostgreSQL: ${allDbProducts.length}`);
  allDbProducts.forEach((p, idx) => {
    let sizeCount = 0;
    try {
      const s = JSON.parse(p.sizesJson || '[]');
      sizeCount = s.length;
    } catch {}
    console.log(`${idx + 1}. [${p.id}] ${p.name}`);
    console.log(`   📂 Category: ${p.category} | 🏷️ Price: ₹${p.price} | 📏 Sizes: ${sizeCount}`);
    console.log(`   💬 Tagline: ${p.tagline}`);
  });
}

main()
  .catch((err) => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
