import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Truck, CheckCircle, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { useGetMyOrders } from '@/hooks/EcomHooks';

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

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyOrders() {
  const { data: orders = [], isLoading, error } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="h-9 w-48 bg-surface-muted rounded-xl mb-8 animate-pulse" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-surface-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight mb-8">My Orders</h1>
        <div className="text-center py-20 bg-white rounded-2xl border border-border-light">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-text-secondary text-lg font-medium">Failed to load orders</p>
          <p className="text-text-muted text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight mb-8">My Orders</h1>
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-border-light">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-brand-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No orders yet</h2>
          <p className="text-text-secondary mb-8 max-w-sm">Start shopping to see your orders appear here.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-full hover:bg-brand-hover hover:shadow-lg transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight">My Orders</h1>
        <span className="text-sm font-medium text-text-muted bg-surface-muted px-3 py-1.5 rounded-full">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => {
          const statusCfg = getStatusConfig(order.orderStatus);
          return (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <Link
                to={`/my-orders/${order.orderId}`}
                className="group block bg-white rounded-2xl border border-border-light hover:border-primary-300 hover:shadow-elevation-2 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Left: Order info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-base font-bold text-text-primary">{order.orderNumber}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>{formatDate(order.createdAt)}</span>
                        {order.createdAt && <span className="text-text-muted/50">at {formatTime(order.createdAt)}</span>}
                      </div>
                    </div>

                    {/* Right: Price + Arrow */}
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className="text-xl font-extrabold text-text-primary">${order.totalAmount?.toLocaleString()}</p>
                        {order.balance > 0 && (
                          <p className="text-xs font-medium text-red-500 mt-0.5">Balance: ${order.balance.toLocaleString()}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>

                  {/* Bottom row: Items + Payment type */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border-light">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary truncate">
                        {order.orderItems?.length || 0} {(order.orderItems?.length || 0) === 1 ? 'item' : 'items'}
                        {order.orderItems && order.orderItems.length > 0 && (
                          <span className="text-text-muted"> · {order.orderItems.map(item => item.type || item.variant || 'Item').join(', ')}</span>
                        )}
                      </p>
                    </div>
                    {order.paymentType && (
                      <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full shrink-0">
                        {order.paymentType.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
