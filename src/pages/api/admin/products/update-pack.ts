import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { logAudit } from '../../../../lib/utilities/audit';

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || locals.user.email !== 'govinda755rock755@gmail.com') {
    return new Response(JSON.stringify({ error: 'Unauthorized. Super Admin Govinda access only.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { id, pack } = body;

    if (!id || !pack) {
      return new Response(JSON.stringify({ error: 'Missing id or pack' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const targetPack = pack.toLowerCase().includes('1') ? 'Pack of 1' : 'Pack of 2';

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let newName = product.name;
    if (targetPack === 'Pack of 1') {
      newName = newName
        .replace(/\(Set of 2\)/gi, '(Pack of 1)')
        .replace(/Set of 2/gi, 'Pack of 1')
        .replace(/\(Pack of 2\)/gi, '(Pack of 1)')
        .replace(/Pack of 2/gi, 'Pack of 1');
      if (!newName.toLowerCase().includes('pack of 1')) {
        newName = `${newName} (Pack of 1)`;
      }
    } else {
      newName = newName
        .replace(/\(Pack of 1\)/gi, '(Pack of 2)')
        .replace(/Pack of 1/gi, 'Pack of 2')
        .replace(/Single Panel Curtain/gi, 'Set of 2 Curtains');
      if (!newName.toLowerCase().includes('pack of 2') && !newName.toLowerCase().includes('set of 2')) {
        newName = `${newName} (Pack of 2)`;
      }
    }

    let newTagline = product.tagline || '';
    if (newTagline.includes('Pack of 1/2')) {
      newTagline = newTagline.replace('Pack of 1/2', targetPack);
    } else if (newTagline.includes('Pack of 1') || newTagline.includes('Pack of 2')) {
      newTagline = newTagline.replace(/Pack of [12]/i, targetPack);
    } else if (newTagline) {
      newTagline = `${targetPack} | ${newTagline}`;
    } else {
      newTagline = `${targetPack} | Silver Eyelets Light Filtering & Thermal Insulation`;
    }

    let newDesc = product.description || '';
    if (targetPack === 'Pack of 1') {
      newDesc = newDesc.replace(/Net Quantity \(N\): 2/gi, 'Net Quantity (N): 1');
    } else {
      newDesc = newDesc.replace(/Net Quantity \(N\): 1/gi, 'Net Quantity (N): 2');
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: newName,
        tagline: newTagline,
        description: newDesc,
      }
    });

    await logAudit({
      userId: locals.user.userId,
      action: 'product.update_pack',
      entity: 'Product',
      entityId: id,
      metadata: { pack: targetPack, oldName: product.name, newName },
    });

    return new Response(JSON.stringify({
      success: true,
      id,
      pack: targetPack,
      newName,
      newTagline
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
