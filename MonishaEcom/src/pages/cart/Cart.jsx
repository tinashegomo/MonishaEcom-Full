import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus, Plus, Trash2, ShoppingBag, PackageX,
  Heart, ShieldCheck
} from 'lucide-react';
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/EcomHooks';
import { useGetAllProducts } from '@/hooks/EcomHooks';

export default function Cart() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useGetCart();
  const { data: allProducts = [] } = useGetAllProducts();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  const stockMap = useMemo(() => {
    const map = new Map();
    allProducts.forEach((product) => {
      if (product.productSizes) {
        product.productSizes.forEach((size) => {
          if (size.quantity > 0) {
            map.set(`${product.productId}:${size.productSizeId}`, size.quantity);
          }
        });
      }
    });
    return map;
  }, [allProducts]);

  const getMaxAvailable = (item) => {
    return stockMap.get(`${item.imsProductId}:${item.imsProductSizeId}`) ?? 0;
  };

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const item = items.find((i) => i.cartItemId === itemId);
    const maxAvailable = item ? getMaxAvailable(item) : 0;
    const newQty = currentQty + delta;
    if (newQty < 1 || newQty > maxAvailable) return;
    updateCartItem.mutate({ itemId, quantity: newQty });
  };

  const handleRemove = (itemId) => {
    removeCartItem.mutate(itemId);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-7 py-0 animate-fade-in">
        <div className="mb-12">
          <div className="h-9 skeleton rounded w-48" />
        </div>
        <div className="flex gap-11">
          <div className="flex-1 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-10 p-6 bg-surface-default border border-border-default rounded-xl">
                <div className="w-20 h-20 skeleton rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <div className="w-[444px]">
            <div className="h-[572px] skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mb-6">
          <PackageX className="w-9 h-9 text-text-muted" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
        <p className="text-sm text-text-secondary mb-6 max-w-sm">
          Browse our collection and find the perfect uniforms for your school.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold text-sm rounded-full hover:bg-brand-hover transition-colors active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    );
  }

  const shipping = 0;
  const discount = 0;
  const tax = Math.round(totalAmount * 0.01);
  const grandTotal = totalAmount - discount + shipping + tax;

  return (
    <div className="max-w-[1280px] mx-auto px-7 py-0 animate-fade-in">
      {/* Heading */}
      <h1 className="text-[36px] leading-[44px] font-bold text-text-primary mb-12">
        My Shopping Cart
      </h1>

      {/* Content: Product Section + Sidebar */}
      <div className="flex gap-11">
        {/* ── Product Section ──────────────────────────────────────── */}
        <div className="flex-1">
          {/* Header Row */}
          <div className="flex items-center px-6 py-4 mb-3">
            <span className="w-[80px] text-[13px] font-semibold uppercase tracking-wider text-text-muted">Product</span>
            <span className="w-[320px] ml-12 text-[13px] font-semibold uppercase tracking-wider text-text-muted">Details</span>
            <span className="w-[140px] ml-auto text-center text-[13px] font-semibold uppercase tracking-wider text-text-muted">Quantity</span>
            <span className="w-[100px] ml-12 text-right text-[13px] font-semibold uppercase tracking-wider text-text-muted">Price</span>
          </div>

          {/* Product Items */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const maxAvailable = getMaxAvailable(item);
                return (
                  <motion.div
                    key={item.cartItemId}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    className="flex items-center px-6 py-5 bg-surface-default border border-border-default rounded-2xl shadow-elevation-1 hover:shadow-elevation-2 hover:border-border-strong transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="w-[88px] h-[88px] rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-[1.02] transition-transform duration-300">
                      <span className="text-3xl font-bold text-primary-300">{item.productName?.charAt(0) || 'M'}</span>
                    </div>

                    {/* Details */}
                    <div className="w-[320px] ml-12 flex flex-col justify-center">
                      <Link
                        to={`/products/${item.imsProductId}`}
                        className="text-[15px] font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-[13px] text-text-muted mt-1">
                        {item.size ? `Size: ${item.size}` : ''}
                      </p>
                      {/* Action Links */}
                    <div className="flex items-center gap-4 mt-2.5">
                      <button className="inline-flex items-center gap-2 text-[14px] font-medium text-text-muted hover:text-brand-primary transition-colors">
                        <Heart className="w-5 h-5" /> Save
                      </button>
                      <span className="text-border-default">|</span>
                      <button
                        onClick={() => handleRemove(item.cartItemId)}
                        disabled={removeCartItem.isPending}
                        className="inline-flex items-center gap-2 text-[14px] font-medium text-text-muted hover:text-danger-main transition-colors"
                      >
                        <Trash2 className="w-5 h-5" /> Remove
                      </button>
                    </div>
                    </div>

                    {/* Quantity Counter */}
                    <div className="ml-auto w-[140px] flex justify-center">
                      <div className="inline-flex items-center border border-border-strong rounded-xl overflow-hidden h-14 bg-white shadow-sm">
                        <button
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity, -1)}
                          disabled={updateCartItem.isPending || item.quantity <= 1}
                          className="w-14 h-14 flex items-center justify-center text-text-secondary hover:bg-surface-elevated hover:text-brand-primary transition-all duration-200 disabled:opacity-30"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-[52px] text-center text-[17px] font-bold text-text-primary">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity, 1)}
                          disabled={updateCartItem.isPending || item.quantity >= maxAvailable}
                          className="w-14 h-14 flex items-center justify-center text-text-secondary hover:bg-surface-elevated hover:text-brand-primary transition-all duration-200 disabled:opacity-30"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-[100px] ml-12 text-right">
                      <span className="text-[16px] font-bold text-text-primary">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[12px] text-text-muted mt-0.5">${item.unitPrice?.toLocaleString()} each</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Sidebar (444px) ────────────────────────────────────────── */}
        <div className="w-[444px] shrink-0">
          {/* Order Summary */}
          <div className="rounded-2xl overflow-hidden shadow-elevation-2">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-x border-t border-primary-200/50 px-8 py-5">
              <h3 className="text-[17px] font-semibold text-primary-700">Order Summary</h3>
            </div>

            {/* Body */}
            <div className="bg-surface-default border-x border-b border-border-default px-8 py-7">
              {/* Line Items */}
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
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-text-secondary">Tax</span>
                  <span className="font-medium text-text-primary">${tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border-default mb-5" />

              {/* Total */}
              <div className="flex justify-between items-center mb-7">
                <span className="text-[16px] font-semibold text-text-primary">Total</span>
                <span className="text-[24px] font-bold text-text-primary">${grandTotal.toLocaleString()}</span>
              </div>

              {/* Buttons */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full h-14 flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-[16px] rounded-xl hover:bg-brand-hover hover:shadow-elevation-2 transition-all duration-300 press-scale"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="w-full mt-3 flex items-center justify-center h-14 border-2 border-border-default text-text-primary font-semibold text-[16px] rounded-xl hover:bg-surface-elevated hover:border-border-strong transition-all duration-300"
              >
                Continue Shopping
              </Link>

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
    </div>
  );
}
