import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Minus, Plus, Check, AlertCircle, Box, Star, ThumbsUp, ThumbsDown, ShieldCheck, Search } from 'lucide-react';
import { useGetProductById, useGetAllProducts, useAddToCart, useAddToWishlist } from '@/hooks/EcomHooks';
import { getStoredToken } from '@/utils/tokenUtils';
import ProductCard, { getProductMockup, getColorDot } from '@/components/product/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProductById(id);
  const { data: allProducts = [] } = useGetAllProducts();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  const isAuthenticated = !!getStoredToken();

  const availableSizes = useMemo(() => {
    if (!product?.productSizes) return [];
    return product.productSizes.filter((s) => s.quantity > 0);
  }, [product]);

  const allSizes = useMemo(() => {
    if (!product?.productSizes) return [];
    return product.productSizes;
  }, [product]);

  const isDepleted = product?.depletedAt != null || product?.totalQuantity === 0;
  const colorDot = getColorDot(product?.color);

  const mockReviews = [
    { id: 1, author: 'Sarah M.', rating: 5, date: '2 weeks ago', comment: 'Excellent quality! The fabric feels premium and the fit is perfect. My son loves his new school uniform.', helpful: 12, unhelpful: 1 },
    { id: 2, author: 'James K.', rating: 4, date: '1 month ago', comment: 'Good value for money. The color has held up well after multiple washes. Slightly runs large, consider sizing down.', helpful: 8, unhelpful: 2 },
    { id: 3, author: 'Priya N.', rating: 5, date: '3 weeks ago', comment: 'Beautiful design and very comfortable. The stitching is excellent. Will definitely order again.', helpful: 15, unhelpful: 0 },
  ];

  const avgRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.productId !== product.productId && (p.schoolName === product.schoolName || p.type === product.type) && !p.depletedAt && p.totalQuantity > 0)
      .slice(0, 4);
  }, [product, allProducts]);

  const selectedSizeObj = availableSizes.find((s) => s.productSizeId === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    const size = product.productSizes.find((s) => s.productSizeId === selectedSize);
    if (!size) return;
    addToCart.mutate(
      { imsProductId: product.productId, imsProductSizeId: selectedSize, size: size.size, quantity },
      { onSuccess: () => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); } }
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    addToWishlist.mutate(
      { imsProductId: product.productId },
      { onSuccess: () => { setAddedToWishlist(true); setTimeout(() => setAddedToWishlist(false), 2000); } }
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-[1216px] mx-auto">
        <div className="rounded-2xl bg-surface-default p-4 sm:p-5 lg:p-8">
          <div className="grid gap-9 lg:grid-cols-[594px_minmax(0,1fr)]">
            <div>
              <div className="aspect-[594/665] skeleton rounded-xl" />
              <div className="mt-5 grid grid-cols-5 gap-3">
                {[1,2,3,4,5].map((i) => <div key={i} className="aspect-[1.05] skeleton rounded-xl" />)}
              </div>
            </div>
            <div className="space-y-4 pt-2 lg:py-5">
              <div className="h-10 skeleton rounded w-3/4" />
              <div className="h-5 skeleton rounded w-1/3" />
              <div className="h-8 skeleton rounded w-1/4" />
              <div className="h-20 skeleton rounded w-full" />
              <div className="flex gap-2">
                {[1,2,3].map((i) => <div key={i} className="h-10 skeleton rounded-xl w-16" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Box className="w-16 h-16 text-text-muted mb-4" />
        <h2 className="text-xl font-semibold text-text-primary mb-2">Product not found</h2>
        <p className="text-text-secondary mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="px-6 py-2.5 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-hover transition-colors">Browse Products</Link>
      </div>
    );
  }

  const specifications = [
    product.schoolName && ['School', product.schoolName],
    product.type && ['Type', product.type],
    product.variant && ['Variant', product.variant],
    product.color && ['Color', product.color],
    product.totalQuantity != null && ['Total Stock', `${product.totalQuantity} units`],
    product.createdAt && ['Added', new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
  ].filter(Boolean);

  const productViews = [
    { transform: 'scale(1)', label: 'Full view' },
    { transform: 'scale(1.5) translate(-8%, -5%)', label: 'Detail top' },
    { transform: 'scale(1.8) translate(5%, -20%)', label: 'Detail close' },
    { transform: 'scale(1.4) translate(10%, 5%)', label: 'Side view' },
    { transform: 'scale(1.6) translate(-5%, 10%)', label: 'Bottom detail' },
  ];

  return (
    <div className="mx-auto max-w-[1216px]">
      {/* ── Back button ── */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium mb-6 lg:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

        {/* ── Product card ── */}
        <section className="rounded-2xl bg-surface-default p-4 sm:p-5 lg:p-8 shadow-elevation-1">
          <div className="grid gap-9 lg:grid-cols-[594px_minmax(0,1fr)] lg:gap-9">
            {/* ── Left: Image gallery ── */}
            <div className="min-w-0">
              {/* Main image */}
              <div className="group relative aspect-[594/665] overflow-hidden rounded-xl bg-surface-muted">
                <div
                  className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 lg:p-16"
                  style={{
                    transform: productViews[selectedImage].transform,
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div className="w-full h-full max-w-[400px] max-h-[400px]" style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.15))' }}>
                    {getProductMockup(product.type, product.color)}
                  </div>
                </div>
                {/* Zoom button */}
                <button
                  aria-label="Zoom product image"
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-text-primary shadow-sm transition hover:scale-105 z-10"
                >
                  <Search size={16} />
                </button>
                {isDepleted && (
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                    <span className="px-6 py-3 bg-gray-900/80 text-white font-semibold rounded-full text-lg">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="mt-5 grid grid-cols-5 gap-3 sm:gap-5">
                {productViews.map((view, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`aspect-[1.05] overflow-hidden rounded-xl bg-surface-muted transition ${
                      selectedImage === index
                        ? 'ring-2 ring-brand-primary ring-offset-2'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center p-2"
                      style={{ transform: view.transform, transformOrigin: 'center' }}
                    >
                      <div className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                        {getProductMockup(product.type, product.color)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Details ── */}
            <div className="flex max-w-[546px] flex-col pt-2 lg:py-5">
              {/* Title */}
              <h1 className="text-[30px] sm:text-[34px] font-bold leading-[1.03] tracking-[-0.045em] text-text-primary">
                {product.productName}
              </h1>

              {/* Rating */}
              <div className="mt-6 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-amber-400 fill-current' : 'text-neutral-300'}`} />
                  ))}
                </div>
                <span className="font-medium text-text-primary">{avgRating.toFixed(1)}</span>
                <span className="text-text-muted">({mockReviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-xl font-bold tracking-[-0.03em] text-text-primary">${product.productPrice?.toLocaleString()}</span>
              </div>

              {/* Description */}
              <p className="mt-8 max-w-[490px] text-sm leading-[1.65] text-text-secondary">
                {product.description || 'No description available for this product.'}
              </p>

              {/* ── Options ── */}
              <div className="mt-10 space-y-10">
                {/* Size */}
                {!isDepleted && availableSizes.length > 0 && (
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-text-primary">Size</legend>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size.productSizeId}
                          onClick={() => { setSelectedSize(size.productSizeId); setQuantity(1); }}
                          className={`rounded-md border px-5 py-3 text-sm font-medium transition ${
                            selectedSize === size.productSizeId
                              ? 'border-brand-primary bg-brand-tint text-brand-primary ring-1 ring-brand-primary'
                              : 'border-border-default hover:border-neutral-300 text-text-primary'
                          }`}
                        >
                          {size.size} ({size.quantity})
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {/* Quantity */}
                {!isDepleted && (
                  <div>
                    <span className="mb-3 block text-sm font-semibold text-text-primary">Quantity</span>
                    <div className="flex h-10 w-[124px] overflow-hidden rounded-md border border-border-default">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="grid w-10 place-items-center text-text-secondary hover:bg-surface-muted transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="grid flex-1 place-items-center border-x border-border-default text-sm font-medium text-text-primary">{quantity}</span>
                      <button
                        onClick={() => { const max = selectedSizeObj?.quantity || 99; setQuantity(Math.min(max, quantity + 1)); }}
                        className="grid w-10 place-items-center text-text-secondary hover:bg-surface-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Action buttons ── */}
              <div className="mt-10 flex items-center gap-4">
                {!isDepleted ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || addToCart.isPending}
                    className="h-14 flex-1 rounded-lg bg-brand-primary text-sm font-medium text-white shadow-[0_5px_13px_rgba(230,0,0,0.2)] transition hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addedToCart ? 'Added to Cart' : addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                  </button>
                ) : (
                  <div className="h-14 flex-1 flex items-center justify-center gap-2 rounded-lg bg-surface-muted text-text-muted font-medium text-sm">
                    <AlertCircle size={16} /> Currently Unavailable
                  </div>
                )}
                <button
                  onClick={handleAddToWishlist}
                  disabled={addToWishlist.isPending}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border transition ${
                    addedToWishlist
                      ? 'border-danger-main bg-danger-bg text-danger-main'
                      : 'border-border-default hover:bg-surface-muted'
                  }`}
                  aria-label="Save product"
                >
                  <Heart size={20} fill={addedToWishlist ? 'currentColor' : 'none'} strokeWidth={1.7} />
                </button>
              </div>

              {/* Secure checkout */}
              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-text-muted">
                <ShieldCheck size={15} className="text-success-main" /> Secure checkout with encrypted payment processing
              </p>
            </div>
          </div>
        </section>

        {/* ── Specifications ── */}
        {specifications.length > 0 && (
          <section className="mt-8 rounded-2xl bg-surface-default p-5 sm:p-8 shadow-elevation-1">
            <h2 className="text-2xl font-bold tracking-[-0.035em] text-text-primary">Specifications</h2>
            <div className="mt-7 grid gap-x-12 gap-y-1 md:grid-cols-2" style={{ maxWidth: '1152px' }}>
              {specifications.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-border-default text-sm"
                  style={{ height: '44px', paddingTop: '10px', paddingBottom: '10px' }}
                >
                  <span className="text-text-secondary">{label}</span>
                  <span className="font-medium text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Customer Reviews ── */}
        <section className="mt-8 rounded-2xl bg-surface-default p-5 sm:p-8 shadow-elevation-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em] text-text-primary">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-amber-400 fill-current' : 'text-neutral-300'}`} />
                ))}
              </div>
              <span className="text-sm text-text-muted">{avgRating.toFixed(1)} ({mockReviews.length} reviews)</span>
            </div>
          </div>

          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="p-6 bg-surface-elevated rounded-xl border border-border-default">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-text-primary">{review.author}</span>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{review.comment}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-success-main transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-danger-main transition-colors">
                    <ThumbsDown className="w-3.5 h-3.5" /> Not helpful ({review.unhelpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em] text-text-primary mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
              {relatedProducts.map((p) => <ProductCard key={p.productId} product={p} />)}
            </div>
          </section>
        )}
    </div>
  );
}
