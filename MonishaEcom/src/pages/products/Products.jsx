import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllProducts } from '@/hooks/EcomHooks';
import ProductsHero from '@/components/product/ProductsHero';
import ProductsToolbar from '@/components/product/ProductsToolbar';
import ProductGrid from '@/components/product/ProductGrid';
import ProductSkeleton from '@/components/product/ProductSkeleton';

export default function Products() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedSchool, setSelectedSchool] = useState(searchParams.get('school') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setSelectedSchool(searchParams.get('school') || '');
    setSelectedType(searchParams.get('type') || '');
    setSortBy(searchParams.get('sort') || 'name');
  }, []);

  const schools = useMemo(() => {
    const set = new Set();
    products.forEach((p) => { if (p.schoolName) set.add(p.schoolName); });
    return Array.from(set).sort();
  }, [products]);

  const types = useMemo(() => {
    const set = new Set();
    products.forEach((p) => { if (p.type) set.add(p.type); });
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => !p.depletedAt && p.totalQuantity > 0);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.productName?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.variant?.toLowerCase().includes(q) ||
        p.color?.toLowerCase().includes(q) ||
        p.schoolName?.toLowerCase().includes(q)
      );
    }
    if (selectedSchool) result = result.filter((p) => p.schoolName === selectedSchool);
    if (selectedType) result = result.filter((p) => p.type === selectedType);
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.productPrice || 0) - (b.productPrice || 0);
        case 'price-desc': return (b.productPrice || 0) - (a.productPrice || 0);
        default: return (a.productName || '').localeCompare(b.productName || '');
      }
    });
    return result;
  }, [products, search, selectedSchool, selectedType, sortBy]);

  const activeFilterCount = [selectedSchool, selectedType].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setSelectedSchool('');
    setSelectedType('');
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in">
      <ProductsHero search={search} setSearch={setSearch} resultCount={filtered.length} />

      <ProductsToolbar
        schools={schools}
        types={types}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        activeFilterCount={activeFilterCount}
        clearFilters={clearFilters}
      />

      {isLoading ? (
        <ProductSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🧥</div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">No uniforms found</h3>
          <p className="text-sm text-text-secondary mb-5">Try changing your search or filters</p>
          <button onClick={clearFilters} className="px-6 py-3 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-hover transition-colors active:scale-[0.98]">
            Reset filters
          </button>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}
