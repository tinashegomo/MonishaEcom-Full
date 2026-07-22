import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, PackageX, Star, Eye } from 'lucide-react';
import { useGetWishlist, useRemoveFromWishlist, useAddToCart } from '@/hooks/EcomHooks';
import { getStoredToken } from '@/utils/tokenUtils';
import { getProductMockup } from '@/components/product/ProductCard';

function Rating({ value }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(value)) {
          return <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" strokeWidth={1.75} />;
        }
        if (star - value === 0.5) {
          return (
            <div key={star} className="relative w-5 h-5">
              <Star className="absolute inset-0 w-5 h-5 text-gray-200" strokeWidth={1.75} />
              <div className="absolute inset-0 w-2.5 h-5 overflow-hidden">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" strokeWidth={1.75} />
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: wishlist = [], isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const [movingId, setMovingId] = useState(null);
  const [notice, setNotice] = useState('');

  const isAuthenticated = !!getStoredToken();

  const handleMoveToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setMovingId(item.wishlistId);
    addToCart.mutate(
      { imsProductId: item.imsProductId, quantity: 1 },
      {
        onSettled: () => {
          removeFromWishlist.mutate(item.wishlistId);
          setMovingId(null);
          setNotice(`${item.productName} added to cart`);
          window.setTimeout(() => setNotice(''), 2200);
        },
      }
    );
  };

  const handleRemove = (itemId) => {
    removeFromWishlist.mutate(itemId);
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1216px]">
        <header className="max-w-[640px]">
          <div className="h-12 skeleton rounded w-48 mb-4" />
          <div className="h-5 skeleton rounded w-96" />
        </header>
        <div className="mt-14 grid grid-cols-1 gap-10 min-[560px]:grid-cols-2 min-[960px]:grid-cols-4 min-[960px]:gap-7">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-[274px] skeleton rounded-lg" />
              <div className="mt-5 space-y-3">
                <div className="h-5 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (wishlist.length === 0) {
    return (
      <section className="mx-auto max-w-[1216px]">
        <header className="max-w-[640px]">
          <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-1.5px] text-text-primary sm:text-5xl sm:leading-[52px]">
            Your Wishlist
          </h1>
        </header>
        <div className="mt-14 rounded-xl border-2 border-dashed border-border-default px-6 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-6">
            <Heart className="w-9 h-9 text-text-muted" />
          </div>
          <h2 className="text-xl font-medium text-text-primary">Your wishlist is empty</h2>
          <p className="mt-2 text-text-secondary">Saved pieces will appear here.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover"
          >
            <ShoppingCart className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1216px]">
      {/* Header */}
      <header className="max-w-[640px]">
        <h1 className="text-[42px] font-semibold leading-[1.08] tracking-[-1.5px] text-text-primary sm:text-5xl sm:leading-[52px]">
          Your Wishlist
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-5 tracking-[-0.2px] text-text-secondary sm:text-base sm:leading-6">
          Save items you love and create collections for future inspiration. Discover new arrivals and explore curated edits to find your perfect pieces.
        </p>
      </header>

      {/* Product Grid */}
      <div className="mt-14 grid grid-cols-1 gap-10 min-[560px]:grid-cols-2 min-[960px]:grid-cols-4 min-[960px]:gap-7">
        <AnimatePresence mode="popLayout">
          {wishlist.map((item) => {
            const mockup = getProductMockup(item.productName);
            return (
              <motion.article
                key={item.wishlistId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="group min-w-0"
              >
                {/* Image Container */}
                <div className="relative h-[274px] overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="w-full h-full flex items-center justify-center">
                    {mockup}
                  </div>

                  {/* Remove Button — top right */}
                  <button
                    onClick={() => handleRemove(item.wishlistId)}
                    disabled={removeFromWishlist.isPending}
                    aria-label={`Remove ${item.productName} from wishlist`}
                    className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-white text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-gray-400 hover:bg-surface-elevated disabled:opacity-50 z-10"
                  >
                    <Trash2 className="h-5 w-5" strokeWidth={1.5} />
                  </button>

                  {/* Hover Overlay — Add to Cart + View */}
                  <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
                    <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden h-14 pointer-events-auto">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={movingId === item.wishlistId || addToCart.isPending}
                        className="flex items-center gap-2.5 px-6 h-full text-base font-semibold text-text-primary hover:bg-gray-50 transition-colors flex-1 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to cart
                      </button>
                      <div className="w-px h-7 bg-gray-200" />
                      <Link
                        to={`/products/${item.imsProductId}`}
                        className="flex items-center justify-center w-14 h-full hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-text-primary" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-start justify-between gap-3 text-base font-medium leading-6 tracking-[-0.2px]">
                    <Link
                      to={`/products/${item.imsProductId}`}
                      className="text-text-secondary hover:text-brand-primary transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <p className="shrink-0 text-text-primary">
                      ${item.productPrice?.toLocaleString()}
                    </p>
                  </div>
                  <Rating value={4} />
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Toast */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {notice}
        </div>
      )}
    </section>
  );
}
