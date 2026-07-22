export function getAvailableSizes(product) {
  if (!product.productSizes) return [];
  return product.productSizes.filter((s) => s.quantity > 0);
}

export function getLowStock(product) {
  if (!product.productSizes) return false;
  const total = product.productSizes.reduce((sum, s) => sum + s.quantity, 0);
  return total > 0 && total <= 5;
}

export function isDepleted(product) {
  return product.depletedAt != null || product.totalQuantity === 0;
}
