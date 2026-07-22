function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getStatusLabel(status) {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return 'Completed';
    case 'IN_PRODUCTION': return 'In Production';
    case 'READY_FOR_COLLECTION': return 'Ready for Collection';
    case 'PENDING': return 'Pending';
    case 'CANCELLED': return 'Cancelled';
    default: return status || 'Pending';
  }
}

export function generateInvoicePDF(order, userName, userEmail, userPhone, options = {}) {
  const { cartItems, totalAmount } = options;
  const items = cartItems || order.orderItems || [];
  const subtotal = order.totalAmount || totalAmount || 0;
  const paid = order.paidAmount || 0;
  const balance = order.balance || 0;

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #f0f0f0;font-size:15px;color:#1a1a1a">
        <div style="font-weight:600;margin-bottom:4px">${item.productName || item.type || 'Item'} ${item.variant ? `- ${item.variant}` : ''}</div>
        <div style="color:#888;font-size:13px">${item.color ? item.color + ' · ' : ''}Size: ${item.size || 'N/A'} · Qty: ${item.quantity}</div>
      </td>
      <td style="padding:16px 0;border-bottom:1px solid #f0f0f0;font-size:16px;font-weight:700;text-align:right;color:#1a1a1a">
        $${(item.lineTotal || item.totalPrice || 0).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${order.orderNumber || ''}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1a1a1a; background: #fff; padding: 48px; line-height: 1.6; }
        .container { max-width: 720px; margin: 0 auto; }

        .brand-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding-bottom: 32px; border-bottom: 3px solid #dc2626; margin-bottom: 36px;
        }
        .brand-logo { font-size: 28px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; }
        .brand-tagline { font-size: 12px; color: #999; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
        .invoice-badge {
          background: #dc2626; color: #fff; padding: 8px 20px; border-radius: 8px;
          font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }

        .invoice-title { font-size: 36px; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; letter-spacing: -0.5px; }
        .invoice-subtitle { color: #888; font-size: 15px; font-weight: 500; margin-bottom: 36px; }

        .customer-card {
          background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px;
          padding: 24px; margin-bottom: 32px;
        }
        .customer-card h3 { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
        .customer-card .detail { font-size: 15px; margin-bottom: 6px; }
        .customer-card .detail .label { color: #888; font-weight: 500; display: inline-block; width: 72px; }
        .customer-card .detail strong { font-weight: 600; }

        .meta-row {
          display: flex; flex-wrap: wrap; gap: 32px 56px; padding: 20px 0;
          border-bottom: 1px solid #f0f0f0; margin-bottom: 32px;
        }
        .meta-item .label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .meta-item .value { font-size: 15px; font-weight: 600; color: #1a1a1a; }

        .table-header { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; padding: 0 0 12px 0; border-bottom: 2px solid #f0f0f0; margin-bottom: 4px; }
        .table-header-row { display: flex; justify-content: space-between; }

        .summary { margin-top: 32px; padding-top: 24px; border-top: 2px solid #f0f0f0; }
        .summary-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px; }
        .summary-row .label { color: #666; font-weight: 500; }
        .summary-row .value { font-weight: 600; }
        .summary-row.total {
          border-top: 2px solid #1a1a1a; margin-top: 12px; padding-top: 16px;
          font-size: 20px; font-weight: 800;
        }
        .summary-row.total .value { color: #dc2626; }

        .footer {
          margin-top: 48px; padding-top: 24px; border-top: 1px solid #f0f0f0;
          text-align: center; font-size: 12px; color: #bbb; font-weight: 500;
        }

        @media print { body { padding: 32px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand-header">
          <div>
            <div class="brand-logo">MONISHA</div>
            <div class="brand-tagline">Premium Uniforms</div>
          </div>
          <div class="invoice-badge">Invoice</div>
        </div>

        <div class="invoice-title">Tax Invoice</div>
        <div class="invoice-subtitle">Thank you for your order</div>

        <div class="customer-card">
          <h3>Customer Details</h3>
          <div class="detail"><span class="label">Name:</span> <strong>${userName || order.customerName || 'N/A'}</strong></div>
          ${userEmail ? `<div class="detail"><span class="label">Email:</span> ${userEmail}</div>` : ''}
          ${userPhone ? `<div class="detail"><span class="label">Phone:</span> ${userPhone}</div>` : ''}
        </div>

        <div class="meta-row">
          <div class="meta-item">
            <div class="label">Order Number</div>
            <div class="value">${order.orderNumber || 'N/A'}</div>
          </div>
          <div class="meta-item">
            <div class="label">Date</div>
            <div class="value">${formatDate(order.createdAt)}</div>
          </div>
          <div class="meta-item">
            <div class="label">Status</div>
            <div class="value">${getStatusLabel(order.orderStatus)}</div>
          </div>
          ${order.paymentType ? `<div class="meta-item">
            <div class="label">Payment</div>
            <div class="value">${(order.paymentType || '').replace(/_/g, ' ')}</div>
          </div>` : ''}
        </div>

        <div class="table-header">
          <div class="table-header-row">
            <span>Items</span>
            <span>Amount</span>
          </div>
        </div>
        <table style="width:100%;border-collapse:collapse">${itemsHTML}</table>

        <div class="summary">
          <div class="summary-row">
            <span class="label">Subtotal</span>
            <span class="value">$${subtotal.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span class="label">Shipping</span>
            <span class="value" style="color:#16a34a">Free</span>
          </div>
          ${paid > 0 ? `<div class="summary-row">
            <span class="label">Paid</span>
            <span class="value" style="color:#16a34a">$${paid.toLocaleString()}</span>
          </div>` : ''}
          ${balance > 0 ? `<div class="summary-row">
            <span class="label">Balance Due</span>
            <span class="value" style="color:#dc2626">$${balance.toLocaleString()}</span>
          </div>` : ''}
          <div class="summary-row total">
            <span>Total</span>
            <span class="value">$${subtotal.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          Monisha Premium Uniforms &middot; This is a computer-generated invoice
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 600);
}
