import type { APIRoute } from 'astro';
import { getStorefrontProducts } from '../../../lib/products';

export const GET: APIRoute = async () => {
  const products = await getStorefrontProducts();
  return new Response(
    JSON.stringify({
      success: true,
      count: products.length,
      data: products,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
