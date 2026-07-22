import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, Download, User, Mail, Phone, CreditCard, MapPin } from 'lucide-react';
import { useGetMyOrders, useGetAllProducts } from '@/hooks/EcomHooks';
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

function getStatusConfig(status) {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'IN_PRODUCTION':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
    case 'READY_FOR_COLLECTION':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'PENDING':
      return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
    case 'CANCELLED':
      return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
  }
}

function getStatusIcon(status) {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
    case 'IN_PRODUCTION': return <Truck className="w-4 h-4" />;
    case 'READY_FOR_COLLECTION': return <Package className="w-4 h-4" />;
    case 'PENDING': return <Clock className="w-4 h-4" />;
    case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetails() {
  const { id } = useParams();
  const { data: orders = [], isLoading, error } = useGetMyOrders();
  const { data: allProducts = [] } = useGetAllProducts();

  const order = orders.find(o => String(o.orderId) === String(id));
  const userName = localStorage.getItem('ecom_user_name') || order?.customerName || '';
  const userEmail = localStorage.getItem('ecom_email') || '';
  const userPhone = order?.customerPhone || '';

  if (isLoading) {
    return (
      <div className="animate-fade-in max-w-[860px]">
        <div className="h-6 w-32 bg-surface-muted rounded-lg mb-8 animate-pulse" />
        <div className="h-64 bg-surface-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="animate-fade-in max-w-[860px]">
        <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="text-center py-24 bg-white rounded-2xl border border-border-light">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-text-secondary text-lg font-medium">Order not found</p>
        </div>
      </div>
    );
  }

  const statusCfg = getStatusConfig(order.orderStatus);

  return (
    <div className="animate-fade-in max-w-[860px]">
      {/* Back Link */}
      <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Order Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border-light p-7 mb-5"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Order {order.orderNumber}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {getStatusLabel(order.orderStatus)}
              </span>
            </div>
            <p className="text-sm text-text-muted font-medium">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        {/* Order Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-1">Items</p>
            <p className="text-lg font-extrabold text-text-primary">{order.orderItems?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-1">Payment</p>
            <p className="text-lg font-extrabold text-text-primary">{(order.paymentType || '').replace(/_/g, ' ')}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-1">Total</p>
            <p className="text-lg font-extrabold text-text-primary">${order.totalAmount?.toLocaleString()}</p>
          </div>
          <div className={`rounded-xl p-4 ${order.balance > 0 ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'}`}>
            <p className="text-[11px] font-bold uppercase tracking-wide mb-1 ${order.balance > 0 ? 'text-red-500' : 'text-emerald-600'}">Balance</p>
            <p className={`text-lg font-extrabold ${order.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              ${order.balance?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Customer Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-border-light p-7 mb-5"
      >
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-5">Customer Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-0.5">Full Name</p>
              <p className="text-sm font-semibold text-text-primary truncate">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm font-semibold text-text-primary truncate">{userEmail || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-text-primary truncate">{userPhone || '-'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Order Items Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border-light overflow-hidden mb-5"
      >
        <div className="px-7 py-5 border-b border-border-light">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">Order Items</h2>
        </div>

        <div className="divide-y divide-border-light">
          {order.orderItems?.map((item, idx) => {
            const product = allProducts.find(p => String(p.productId) === String(item.productId));
            const mockup = product ? getProductMockup(product.type, product.color) : getProductMockup(item.type, item.color);
            const itemName = product?.productName || item.type || 'Product';

            return (
              <div key={item.orderItemId || idx} className="px-7 py-5 flex items-center gap-5">
                <div className="shrink-0 w-[72px] h-[72px] rounded-xl bg-surface-muted flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center p-2">
                    {mockup}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-text-primary truncate">{itemName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.color && <span className="text-xs font-medium text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">{item.color}</span>}
                    {item.size && <span className="text-xs font-medium text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">Size {item.size}</span>}
                    <span className="text-xs font-medium text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">Qty {item.quantity}</span>
                  </div>
                </div>
                <div className="text-lg font-extrabold text-text-primary shrink-0">
                  ${(item.totalPrice || 0).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Order Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-border-light p-7 mb-5"
      >
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-5">Order Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-[15px]">
            <span className="text-text-secondary font-medium">Subtotal</span>
            <span className="text-text-primary font-bold">${order.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[15px]">
            <span className="text-text-secondary font-medium">Shipping</span>
            <span className="font-bold text-emerald-600">Free</span>
          </div>
          {order.paidAmount > 0 && (
            <div className="flex justify-between text-[15px]">
              <span className="text-text-secondary font-medium">Paid</span>
              <span className="font-bold text-emerald-600">${order.paidAmount.toLocaleString()}</span>
            </div>
          )}
          {order.balance > 0 && (
            <div className="flex justify-between text-[15px]">
              <span className="text-text-secondary font-medium">Balance Due</span>
              <span className="font-bold text-red-600">${order.balance.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-4 border-t-2 border-border-light">
            <span className="text-lg font-bold text-text-primary">Total</span>
            <span className="text-xl font-extrabold text-text-primary">${order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 pb-12"
      >
        <button
          onClick={() => generateInvoicePDF(order, userName, userEmail, userPhone)}
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-white border-2 border-border-light text-text-primary text-sm font-bold rounded-xl hover:bg-surface-muted hover:border-primary-200 transition-all duration-200"
        >
          <Download className="w-4 h-4" /> Download Invoice
        </button>
        <Link
          to="/products"
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-hover hover:shadow-lg transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
