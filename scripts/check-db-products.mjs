import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('Total products currently in Supabase:', count);
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, tagline: true, category: true, price: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
