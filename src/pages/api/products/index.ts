import type { APIRoute } from 'astro';
import { PRODUCTS_CATALOG } from '../../../lib/products';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      count: PRODUCTS_CATALOG.length,
      data: PRODUCTS_CATALOG,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
