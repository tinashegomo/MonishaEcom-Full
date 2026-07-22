import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Download, ShoppingCart } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/EcomHooks';
import { getProductMockup } from '@/components/product/ProductCard';
import { generateInvoicePDF } from '@/utils/invoice';

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

function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return 'text-emerald-600 bg-emerald-50';
    case 'IN_PRODUCTION': return 'text-blue-600 bg-blue-50';
    case 'READY_FOR_COLLECTION': return 'text-amber-600 bg-amber-50';
    case 'PENDING': return 'text-gray-600 bg-gray-50';
    case 'CANCELLED': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CheckoutSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;
  const { data: allProducts = [] } = useGetAllProducts();

  const items = cartItems.length > 0 ? cartItems : (order?.orderItems || []);
  const orderTotal = order?.totalAmount || totalAmount;
  const orderPaid = order?.paidAmount || 0;
  const orderBalance = order?.balance || 0;

  const handleDownloadInvoice = () => {
    const userName = localStorage.getItem('ecom_user_name') || order.customerName || '';
    const userEmail = localStorage.getItem('ecom_email') || '';
    const userPhone = order.customerPhone || '';
    generateInvoicePDF(order, userName, userEmail, userPhone, { cartItems: cartItems.length > 0 ? cartItems : null, totalAmount });
  };

  // Fallback if no order data (direct URL access)
  if (!order) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-6">
          <Package className="w-9 h-9 text-text-muted" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">No order data</h2>
        <p className="text-text-secondary mb-6">Please place an order first.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold text-sm rounded-full hover:bg-brand-hover transition-colors">
          <ShoppingCart className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-[870px] mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
        style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <h1 className="text-[48px] leading-[52px] font-semibold text-text-primary" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Thanks For Ordering
        </h1>
        <p className="text-sm leading-5 text-text-secondary" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: '420px' }}>
          Your order has been confirmed and will be shipping soon. A confirmation email has been sent to your email.
        </p>
      </motion.div>

      {/* ── Section Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Top Row: Order ID, Date, Status, Download ── */}
        <div
          className="flex flex-wrap items-center justify-between"
          style={{ padding: '24px 0', borderBottom: '1px solid #E5E7EB', gap: '44px' }}
        >
          <div className="flex flex-wrap items-center" style={{ gap: '44px' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
              <span style={{ color: '#6B7280' }}>Order ID:</span>
              <span style={{ color: '#1F2937', fontWeight: 600 }}>{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
              <span style={{ color: '#6B7280' }}>Order Date:</span>
              <span style={{ color: '#1F2937', fontWeight: 600 }}>{formatDate(order.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
              <span style={{ color: '#6B7280' }}>Order status:</span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                {getStatusLabel(order.orderStatus)}
              </span>
            </div>
          </div>
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-border-light rounded-xl bg-white text-text-primary text-sm font-bold hover:bg-surface-muted hover:border-primary-200 transition-all duration-200"
          >
            <Download className="w-4 h-4" /> Download Invoice
          </button>
        </div>

        {/* ── Customer Details ── */}
        <div
          style={{ padding: '24px 0', borderBottom: '1px solid #E5E7EB', display: 'flex', flexWrap: 'wrap', gap: '44px' }}
        >
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
            <span style={{ color: '#6B7280' }}>Customer:</span>
            <span style={{ color: '#1F2937', fontWeight: 600 }}>{order.customerName || localStorage.getItem('ecom_user_name') || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
            <span style={{ color: '#6B7280' }}>Email:</span>
            <span style={{ color: '#1F2937', fontWeight: 600 }}>{localStorage.getItem('ecom_email') || 'N/A'}</span>
          </div>
          {order.customerPhone && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '16px', lineHeight: '24px' }}>
              <span style={{ color: '#6B7280' }}>Phone:</span>
              <span style={{ color: '#1F2937', fontWeight: 600 }}>{order.customerPhone}</span>
            </div>
          )}
        </div>

        {/* ── Product Rows ── */}
        <div>
          {items.map((item, idx) => {
            const product = allProducts.find(p => String(p.productId) === String(item.imsProductId || item.productId));
            const mockup = product ? getProductMockup(product.type, product.color) : getProductMockup(item.type, item.color);
            const itemName = item.productName || product?.productName || item.type || 'Product';
            const itemColor = item.color || product?.color || '';
            const itemSize = item.size || '';
            const itemQty = item.quantity || 1;
            const itemPrice = item.lineTotal || item.totalPrice || 0;

            return (
              <div
                key={item.cartItemId || item.orderItemId || idx}
                className="flex items-center justify-between"
                style={{
                  padding: '24px 0',
                  borderBottom: items.length > 1 && idx < items.length - 1 ? '1px solid #F3F4F6' : 'none',
                  gap: '22px',
                }}
              >
                {/* Product Info */}
                <div className="flex items-center" style={{ gap: '16px', flex: 1 }}>
                  <div
                    className="shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ width: '72px', height: '72px', borderRadius: '8px', background: '#F3F4F6' }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-2">
                      {mockup}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: '#1F2937' }}>
                      {itemName}
                    </p>
                    <p style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px', fontSize: '12px', lineHeight: '16px', color: '#6B7280' }}>
                      {itemColor && <span>{itemColor}</span>}
                      {itemColor && <span>·</span>}
                      <span>{itemQty}x</span>
                      {itemSize && <span>·</span>}
                      {itemSize && <span>Size {itemSize}</span>}
                    </p>
                    <p style={{ marginTop: '4px', fontSize: '14px', lineHeight: '20px', fontWeight: 600, color: '#374151' }}>
                      ${itemPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center" style={{ gap: '32px' }}>
                  <Link
                    to={`/my-orders/${order.orderId}`}
                    style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', lineHeight: '20px', fontWeight: 500 }}
                    className="hover:text-brand-primary transition-colors"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Amount Section ── */}
        <div style={{ marginTop: '16px' }}>
          {/* Calculation Rows */}
          <div
            className="flex flex-col"
            style={{ gap: '20px', padding: '24px 0 28px', borderBottom: '1px solid #E5E7EB' }}
          >
            <div className="flex justify-between items-start" style={{ gap: '24px', width: '100%' }}>
              <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: '#374151' }}>
                Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
              <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: '#1F2937', whiteSpace: 'nowrap' }}>
                ${orderTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-start" style={{ gap: '24px', width: '100%' }}>
              <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: '#374151' }}>Shipping</span>
              <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: '#059669', whiteSpace: 'nowrap' }}>Free</span>
            </div>
            {orderPaid > 0 && (
              <div className="flex justify-between items-start" style={{ gap: '24px', width: '100%' }}>
                <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: '#374151' }}>Paid</span>
                <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: '#059669', whiteSpace: 'nowrap' }}>${orderPaid.toLocaleString()}</span>
              </div>
            )}
            {orderBalance > 0 && (
              <div className="flex justify-between items-start" style={{ gap: '24px', width: '100%' }}>
                <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: '#374151' }}>Balance Due</span>
                <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: '#DC2626', whiteSpace: 'nowrap' }}>${orderBalance.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div
            className="flex justify-between items-center"
            style={{ padding: '28px 0' }}
          >
            <span style={{ fontSize: '18px', lineHeight: '28px', fontWeight: 600, color: '#1F2937' }}>Total</span>
            <span style={{ fontSize: '18px', lineHeight: '28px', fontWeight: 700, color: '#1F2937' }}>${orderTotal.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Navigation Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap gap-4 mt-8 pb-12"
      >
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold text-sm rounded-xl hover:bg-brand-hover hover:shadow-lg transition-all duration-200"
        >
          <Package className="w-4 h-4" /> View My Orders
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface-default border-2 border-border-light text-text-primary font-semibold text-sm rounded-xl hover:bg-surface-muted hover:border-primary-200 transition-all duration-200"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
