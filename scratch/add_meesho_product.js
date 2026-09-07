import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const name = 'Premium Brown Thermal Blackout Door Curtain';
  const slug = 'premium-brown-thermal-blackout-door-curtain';
  const tagline = 'Pack of 1 | Silver Eyelets 100% Light Blocking Thermal Insulated Curtain';
  const description = 'Transform your bedroom or living room with Teepul Premium Brown Thermal Blackout Curtains. Features heavy-duty silver ring eyelets, 100% noise and light blocking thermal insulation, and rich solid texture.';
  const price = 301;
  const originalPrice = 699;
  const category = 'Door Curtains';
  const badge = 'Meesho Choice';

  const colors = [
    { name: 'Premium Dark Brown', hex: '#3e2723' },
    { name: 'Warm Chocolate', hex: '#4e342e' },
  ];

  const sizes = ['7 Feet (Door Curtain)', '9 Feet (Long Door)'];
  
  const images = [
    'https://images.meesho.com/images/products/1060934359/8exub_512.avif?width=512',
    'https://images.meesho.com/images/products/1060934359/ibskg_512.avif?width=512',
    'https://images.meesho.com/images/products/1060934359/z3epy_512.avif?width=512',
  ];

  const features = [
    '100% Light Blocking Thermal Insulation',
    'Rust-Proof Stainless Steel Eyelet Rings',
    'Noise & Heat Shield Fabric',
    'Machine & Hand Washable',
  ];

  const existing = await prisma.product.findUnique({ where: { slug } });

  if (existing) {
    console.log('Product already exists in DB:', existing.id);
  } else {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        tagline,
        description,
        price,
        originalPrice,
        currency: '₹',
        category,
        badge,
        rating: 4.8,
        reviewCount: 94,
        inStock: true,
        colorsJson: JSON.stringify(colors),
        sizesJson: JSON.stringify(sizes),
        imagesJson: JSON.stringify(images),
        featuresJson: JSON.stringify(features),
        gsm: 320,
        material: 'Polyester Thermal Fabric',
        fit: 'Silver Eyelet Grommets',
        care: 'Hand & Machine Washable',
      },
    });
    console.log('Successfully inserted Meesho product into Teepul Database:', product.id);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
