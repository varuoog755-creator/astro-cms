import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { getSession } from '../../../../lib/auth/session';

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(raw: Date | string): string {
  if (!raw) return '';
  const d = new Date(raw);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  // Master Admin Auth Verification
  const token = cookies.get('cms_session_token')?.value;
  const session = token ? await getSession(token) : null;
  if (!session || session.role?.name !== 'Super Admin') {
    return new Response(JSON.stringify({ error: 'Unauthorized admin access' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const idsParam = url.searchParams.get('ids');
  const selectedIds = idsParam ? idsParam.split(',').filter(Boolean) : [];

  const whereClause = selectedIds.length > 0 ? { id: { in: selectedIds } } : {};

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  const headers = [
    'Order_id',
    'Order_Created_Date',
    'Shipping_Address_FirstName',
    'Shipping_Address_LastName',
    'Shipping_Address',
    'Shipping_Address_Phone',
    'Shipping_Address_Alternate_Phone',
    'Shipping_Address_Pincode/Zipcode',
    'Customer_GSTIN',
    'Line_Item_SKU',
    'Line_Item_HSN',
    'Line_Item_Name',
    'Line_Item_Description',
    'Line_Item_Retail_Price',
    'Line_Item_Tax/VAT_Slab',
    'Shipping_Charges',
    'Line_Item_Quantity',
    'Payment_Mode',
    'Is_Confirmed',
    'Latitude',
    'Longitude',
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  for (const o of orders) {
    const dateStr = formatDate(o.createdAt);
    const nameParts = (o.customerName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullAddress = [o.shippingAddress, o.city, o.state].filter(Boolean).join(', ');
    const phone = o.customerPhone || '';
    const altPhone = '';
    const pincode = o.pincode || '';
    const gstin = '';
    const paymentMode = o.paymentMethod === 'COD' || o.paymentStatus === 'COD_PENDING' ? 'COD' : 'Prepaid';
    const isConfirmed =
      o.paymentStatus === 'PAID' ||
      o.orderStatus === 'PROCESSING' ||
      o.orderStatus === 'SHIPPED' ||
      o.orderStatus === 'DELIVERED'
        ? 'true'
        : 'false';

    const items =
      o.items && o.items.length > 0
        ? o.items
        : [
            {
              productId: 'CURTAIN-PANEL',
              productTitle: 'Luxury Curtain Panel',
              color: 'Standard',
              size: '7ft Door',
              unitPrice: o.totalAmount,
              quantity: 1,
            },
          ];

    for (const item of items) {
      const sku =
        item.productId ||
        'SKU-' +
          (item.productTitle ? item.productTitle.slice(0, 10).replace(/\s+/g, '-').toUpperCase() : 'CURTAIN');
      const hsn = '6303';
      const itemName = item.productTitle || 'Teepul Luxury Curtain Panel';
      const descParts: string[] = [];
      if (item.color) descParts.push(`Color: ${item.color}`);
      if (item.size) descParts.push(`Size: ${item.size}`);
      const itemDesc = descParts.join(', ') || 'Curtains & Drapery';
      const price = item.unitPrice ?? o.totalAmount;
      const taxSlab = 0;
      const shippingCharges = 0;
      const qty = item.quantity ?? 1;

      const row = [
        escapeCsv(o.orderNumber || o.id),
        escapeCsv(dateStr),
        escapeCsv(firstName),
        escapeCsv(lastName),
        escapeCsv(fullAddress),
        escapeCsv(phone),
        escapeCsv(altPhone),
        escapeCsv(pincode),
        escapeCsv(gstin),
        escapeCsv(sku),
        escapeCsv(hsn),
        escapeCsv(itemName),
        escapeCsv(itemDesc),
        escapeCsv(price),
        escapeCsv(taxSlab),
        escapeCsv(shippingCharges),
        escapeCsv(qty),
        escapeCsv(paymentMode),
        escapeCsv(isConfirmed),
        escapeCsv(''),
        escapeCsv(''),
      ];

      rows.push(row.join(','));
    }
  }

  // Prepend UTF-8 BOM so Excel opens Hindi / Indian characters seamlessly
  const csvContent = '\uFEFF' + rows.join('\r\n');
  const filename = `teepul-orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};
