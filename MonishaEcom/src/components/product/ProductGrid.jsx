import ProductCard from './ProductCard';

/**
 * Product grid container matching Figma specs:
 * - Container: max-width 1280px, padding 0 32px
 * - Card row: gap 28px between cards
 * - 4 columns at desktop, responsive down to 1 column
 */
export default function ProductGrid({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: '1280px', paddingLeft: '32px', paddingRight: '32px' }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '28px',
        }}
      >
        {products.map((product, i) => (
          <ProductCard key={product.productId} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}