import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect }) => {
  return redirect('/register?error=Registration has been disabled by the system administrator.');
};
