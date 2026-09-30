import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, orderStatus } = body;

    if (!orderId || !orderStatus) {
      return new Response(JSON.stringify({ error: 'Missing orderId or orderStatus' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'ARCHIVED'];
    if (!validStatuses.includes(orderStatus)) {
      return new Response(JSON.stringify({ error: 'Invalid order status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
    });

    // Record audit log permanently
    try {
      await prisma.auditLog.create({
        data: {
          action: 'order.status_update',
          entity: 'Order',
          entityId: orderId,
          metadata: JSON.stringify({
            orderNumber: updatedOrder.orderNumber,
            newStatus: orderStatus,
            updatedAt: new Date().toISOString(),
          }),
        },
      });
    } catch (auditErr) {
      console.warn('Audit log creation error:', auditErr);
    }

    return new Response(JSON.stringify({ success: true, order: updatedOrder }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to update order status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
