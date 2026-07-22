import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Smartphone, ArrowLeft, Check, Loader2,
  ShieldCheck, AlertCircle, Wallet, Receipt
} from 'lucide-react';
import { useGetCart, useCheckout } from '@/hooks/EcomHooks';

const PAYMENT_OPTIONS = [
  {
    value: 'CARD',
    label: 'Card Payment',
    desc: 'Pay securely with your debit or credit card',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  {
    value: 'MOBILE_MONEY',
    label: 'Mobile Money',
    desc: 'Pay via EcoCash, InnBucks, or OneMoney',
    icon: Smartphone,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
  },
];

const MIN_PAYMENT_PERCENT = 0.40;

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const checkoutMutation = useCheckout();

  const [paymentType, setPaymentType] = useState('CARD');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  const minPayment = Math.ceil(totalAmount * MIN_PAYMENT_PERCENT);
  const maxPayment = totalAmount;

  const parsedPaidAmount = useMemo(() => {
    const val = parseFloat(paidAmount);
    return isNaN(val) ? 0 : val;
  }, [paidAmount]);

  const balance = Math.max(0, totalAmount - parsedPaidAmount);
  const paymentPercent = totalAmount > 0 ? Math.min(100, (parsedPaidAmount / totalAmount) * 100) : 0;
  const isValidPayment = parsedPaidAmount >= minPayment && parsedPaidAmount <= maxPayment;
  const isFullPayment = parsedPaidAmount >= totalAmount;

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPaidAmount(val);
    }
  };

  const handleSetMin = () => setPaidAmount(String(minPayment));
  const handleSetFull = () => setPaidAmount(String(totalAmount));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPayment) return;
    checkoutMutation.mutate(
      {
        paymentType,
        paidAmount: parsedPaidAmount,
        notes: notes.trim() || null,
      },
      {
        onSuccess: (orderData) => navigate('/checkout/success', { state: { order: orderData, cartItems: items, totalAmount } }),
      }
    );
  };

  if (cartLoading) {
    return (
      <div className="animate-fade-in">
        <div className="h-8 skeleton rounded w-32 mb-8" />
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
          </div>
          <div className="h-96 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-6">
          <Receipt className="w-9 h-9 text-text-muted" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-text-secondary mb-6">Add items to your cart before checking out.</p>
        <Link to="/products" className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-full hover:bg-brand-hover transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const selectedOption = PAYMENT_OPTIONS.find(o => o.value === paymentType);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium mb-6 lg:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <h1 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight mb-8 lg:mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">

          {/* ── Left Column: Payment & Notes ── */}
          <div className="space-y-6">

            {/* Payment Method */}
            <div className="rounded-2xl bg-surface-default border border-border-default shadow-elevation-1 overflow-hidden">
              <div className="px-6 py-4 border-b border-border-default">
                <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-primary" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = paymentType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPaymentType(opt.value)}
                        className={`relative flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? `border-brand-primary ${opt.bg} ring-2 ${opt.ring}`
                            : 'border-border-default hover:border-brand-primary/30 bg-surface-default'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-text-primary">{opt.label}</p>
                          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{opt.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Partial Payment */}
            <div className="rounded-2xl bg-surface-default border border-border-default shadow-elevation-1 overflow-hidden">
              <div className="px-6 py-4 border-b border-border-default">
                <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-primary" />
                  Payment Amount
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Minimum {Math.round(MIN_PAYMENT_PERCENT * 100)}% required to start production
                </p>
              </div>
              <div className="p-6 space-y-5">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Amount to Pay Now</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-text-muted">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={paidAmount}
                      onChange={handleAmountChange}
                      placeholder={minPayment.toLocaleString()}
                      className="w-full pl-9 pr-4 py-3.5 bg-surface-muted border border-border-default rounded-xl text-xl font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                {/* Quick Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSetMin}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-border-default bg-surface-default text-sm font-medium text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary transition-all"
                  >
                    Minimum ({Math.round(MIN_PAYMENT_PERCENT * 100)}%) — ${minPayment.toLocaleString()}
                  </button>
                  <button
                    type="button"
                    onClick={handleSetFull}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-border-default bg-surface-default text-sm font-medium text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary transition-all"
                  >
                    Pay Full — ${totalAmount.toLocaleString()}
                  </button>
                </div>

                {/* Payment Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                    <span>Payment progress</span>
                    <span className="font-semibold text-text-primary">{paymentPercent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 bg-surface-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-primary to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${paymentPercent}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Validation Message */}
                {paidAmount && !isValidPayment && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">
                      {parsedPaidAmount < minPayment
                        ? `Minimum payment is $${minPayment.toLocaleString()} (40% of total)`
                        : `Amount cannot exceed total of $${totalAmount.toLocaleString()}`
                      }
                    </p>
                  </motion.div>
                )}

                {/* Payment Breakdown */}
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">You pay now</span>
                    <span className="font-bold text-brand-primary text-base">${parsedPaidAmount.toLocaleString()}</span>
                  </div>
                  {!isFullPayment && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Balance due later</span>
                      <span className="font-semibold text-text-primary">${balance.toLocaleString()}</span>
                    </div>
                  )}
                  {isFullPayment && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                      <span className="font-medium text-emerald-600">Fully paid — no balance remaining</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl bg-surface-default border border-border-default shadow-elevation-1 overflow-hidden">
              <div className="px-6 py-4 border-b border-border-default">
                <h2 className="text-base font-semibold text-text-primary">Order Notes (Optional)</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions or delivery notes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-muted border border-border-default rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl overflow-hidden shadow-elevation-2">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-x border-t border-primary-200/50 px-8 py-5">
                <h3 className="text-[17px] font-semibold text-primary-700">Order Summary</h3>
              </div>

              {/* Body */}
              <div className="bg-surface-default border-x border-b border-border-default px-8 py-7">
                {/* Line Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between items-center text-[15px]">
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-text-muted mt-0.5">{item.size} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-text-primary ml-3">${item.lineTotal?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-border-default mb-5" />

                {/* Subtotal */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-semibold text-text-primary">${totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="inline-flex items-center px-2.5 py-1 bg-success-main/10 text-success-main text-[12px] font-bold rounded-full">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-text-secondary">Discount</span>
                    <span className="font-medium text-text-muted">$0.00</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border-default mb-5" />

                {/* Total */}
                <div className="flex justify-between items-center mb-7">
                  <span className="text-[16px] font-semibold text-text-primary">Total</span>
                  <span className="text-[24px] font-bold text-text-primary">${totalAmount.toLocaleString()}</span>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={!isValidPayment || checkoutMutation.isPending}
                  className="w-full h-14 flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-[16px] rounded-xl hover:bg-brand-hover hover:shadow-elevation-2 transition-all duration-300 press-scale disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-primary"
                >
                  {checkoutMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Place Order — ${parsedPaidAmount.toLocaleString()}
                    </>
                  )}
                </button>

                {/* Error */}
                <AnimatePresence>
                  {checkoutMutation.isError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
                        <p className="text-sm text-red-600 font-medium">
                          {checkoutMutation.error.response?.data?.message || 'Checkout failed. Please try again.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Methods */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  {['Card', 'EcoCash', 'InnBucks'].map((method) => (
                    <div
                      key={method}
                      className="px-4 py-2 bg-surface-muted rounded-lg text-[13px] font-bold text-text-secondary"
                    >
                      {method}
                    </div>
                  ))}
                </div>

                {/* Secure Checkout */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-text-muted">
                  <ShieldCheck className="w-5 h-5 text-success-main" />
                  <span>Secure checkout payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
