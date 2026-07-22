import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles, Ruler, Truck, Shirt, GraduationCap, SportShoe } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/EcomHooks';
import ProductCard from '@/components/product/ProductCard';
import HeroSection from '@/components/landing/HeroSection';

const SCHOOL_COLORS = [
  'from-red-500 to-rose-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
  'from-pink-500 to-fuchsia-600',
  'from-lime-500 to-green-600',
];

const CATEGORY_ICONS = {
  shirt: <Shirt className="w-full h-full" />, blouse: <Shirt className="w-full h-full" />, top: <Shirt className="w-full h-full" />,
  blazer: <Shirt className="w-full h-full" />, jacket: <Shirt className="w-full h-full" />,
  tie: <Shirt className="w-full h-full" />, bow: <Shirt className="w-full h-full" />,
  skirt: <Shirt className="w-full h-full" />, dress: <Shirt className="w-full h-full" />,
  shorts: <SportShoe className="w-full h-full" />, trousers: <SportShoe className="w-full h-full" />, pants: <SportShoe className="w-full h-full" />,
  shoes: <SportShoe className="w-full h-full" />,
  socks: <SportShoe className="w-full h-full" />,
  cap: <GraduationCap className="w-full h-full" />, hat: <GraduationCap className="w-full h-full" />,
};

function getCategoryIcon(type) {
  const lower = type?.toLowerCase() || '';
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return <Shirt className="w-7 h-7" />;
}

const OUTFIT_ITEMS = [
  { label: 'Blazers', icon: <Shirt className="w-7 h-7" />, color: 'from-neutral-700 to-neutral-900' },
  { label: 'Shirts', icon: <Shirt className="w-7 h-7" />, color: 'from-blue-500 to-blue-700' },
  { label: 'T-Shirts', icon: <Shirt className="w-7 h-7" />, color: 'from-sky-500 to-sky-700' },
  { label: 'Ties', icon: <Shirt className="w-7 h-7" />, color: 'from-red-500 to-red-700' },
  { label: 'Skirts', icon: <Shirt className="w-7 h-7" />, color: 'from-violet-500 to-violet-700' },
  { label: 'Dresses', icon: <Shirt className="w-7 h-7" />, color: 'from-pink-500 to-pink-700' },
  { label: 'Trousers', icon: <SportShoe className="w-7 h-7" />, color: 'from-neutral-600 to-neutral-800' },
  { label: 'Tracksuits', icon: <SportShoe className="w-7 h-7" />, color: 'from-emerald-600 to-emerald-800' },
  { label: 'Shoes', icon: <SportShoe className="w-7 h-7" />, color: 'from-amber-600 to-amber-800' },
  { label: 'Caps', icon: <GraduationCap className="w-7 h-7" />, color: 'from-indigo-600 to-indigo-800' },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};


export default function LandingPage() {
  const { data: products = [], isLoading } = useGetAllProducts();

  const recentProducts = useMemo(() => {
    const now = new Date();
    return products
      .filter((p) => {
        if (!p.createdAt || p.totalQuantity <= 0) return false;
        const created = new Date(p.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
  }, [products]);

  const inStockProducts = useMemo(() => {
    return products.filter((p) => p.totalQuantity > 0 && !p.depletedAt).slice(0, 8);
  }, [products]);

  const displayProducts = recentProducts.length > 0 ? recentProducts : inStockProducts;

  const schools = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.schoolName) map.set(p.schoolName, (map.get(p.schoolName) || 0) + 1);
    });
    return Array.from(map.entries()).slice(0, 8);
  }, [products]);

  const types = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.type) map.set(p.type, (map.get(p.type) || 0) + 1);
    });
    return Array.from(map.entries()).slice(0, 6);
  }, [products]);



  return (
    <div>
      <HeroSection />

      {/* ── Trusted Schools — Static Grid ─────────────────── */}
      {schools.length > 0 && (
        <section className="mb-24 lg:mb-32">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-text-muted mb-8">Trusted by leading schools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {schools.map(([school, count], i) => (
              <div
                key={`${school}-${i}`}
                className="flex flex-col items-center w-[100px] px-3 py-4 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SCHOOL_COLORS[i % SCHOOL_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm mb-2.5`}>
                  {school.charAt(0)}
                </div>
                <span className="text-[11px] font-medium text-text-primary text-center leading-tight line-clamp-2">{school}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Complete Uniform Collection — Auto Horizontal Scroll ── */}
      <motion.section
        className="mb-24 lg:mb-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">Complete Uniform Collection</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">Everything your student needs, from head to toe</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-default to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-default to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee gap-4 lg:gap-5 w-max">
            {[...OUTFIT_ITEMS, ...OUTFIT_ITEMS].map((item, i) => (
              <div key={`${item.label}-${i}`} className="flex-shrink-0 w-[150px] sm:w-[170px] lg:w-[190px]">
                <Link
                  to={`/products?type=${encodeURIComponent(item.label.replace(/s$/, ''))}`}
                  className="group relative block rounded-card overflow-hidden aspect-[3/2] active:scale-[0.97] transition-transform"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-0">
                    <div className="w-14 h-14 rounded-card bg-neutral-0/10 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Why Monisha ─────────────────────────────────────────── */}
      <motion.section
        className="mb-24 lg:mb-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">Why Monisha?</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">Premium quality uniforms trusted by schools and parents alike</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {[
            { icon: <Shield className="w-8 h-8" />, title: 'School Approved', desc: 'Officially compliant with dress code standards of leading schools.', stat: '20+', statLabel: 'Schools' },
            { icon: <Sparkles className="w-8 h-8" />, title: 'Premium Fabric', desc: 'Crafted from durable, comfortable fabrics built to last all term.', stat: '100%', statLabel: 'Quality' },
            { icon: <Ruler className="w-8 h-8" />, title: 'Perfect Fit', desc: 'Available in all sizes for every student, guaranteed comfort.', stat: 'All', statLabel: 'Sizes' },
            { icon: <Truck className="w-8 h-8" />, title: 'Fast Delivery', desc: 'Quick and reliable delivery to your doorstep, every time.', stat: '24h', statLabel: 'Dispatch' },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={gridItem}
              className="group relative p-6 lg:p-7 rounded-panel bg-surface-default border border-border-default hover:shadow-elevation-2 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-right">
                <div className="text-xl lg:text-2xl font-black text-brand-primary/20 leading-none">{f.stat}</div>
                <div className="text-[9px] font-semibold text-text-muted/50 uppercase tracking-wider">{f.statLabel}</div>
              </div>
              <div className="w-14 h-14 rounded-card bg-brand-tint text-brand-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>
              <h3 className="font-semibold text-text-primary text-sm lg:text-base mb-2">{f.title}</h3>
              <p className="text-xs lg:text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Browse by School ───────────────────────────────────── */}
      <motion.section
        className="mb-24 lg:mb-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">Browse by School</h2>
            <p className="text-sm text-text-secondary mt-1">Find uniforms for your school</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-hover transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {schools.length === 0 ? (
          <div className="rounded-card border border-border-default bg-surface-muted/50 py-20 text-center">
            <p className="text-lg font-semibold text-text-primary mb-1">No schools available yet</p>
            <p className="text-sm text-text-muted">School uniforms will appear here once they are added.</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3" variants={staggerGrid} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            {schools.map(([school, count], i) => (
              <motion.div key={school} variants={gridItem}>
                <Link
                  to={`/products?school=${encodeURIComponent(school)}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-border-light hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
                    <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${SCHOOL_COLORS[i % SCHOOL_COLORS.length]} flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {school.charAt(0)}
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-brand-primary transition-colors duration-200">{school}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{count} uniforms</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* ── Browse by Category ──────────────────────────────────── */}
      <motion.section
        className="mb-24 lg:mb-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">Browse by Category</h2>
            <p className="text-sm text-text-secondary mt-1">Browse by uniform type</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-hover transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {types.length === 0 ? (
          <div className="rounded-card border border-border-default bg-surface-muted/50 py-20 text-center">
            <p className="text-lg font-semibold text-text-primary mb-1">No categories available yet</p>
            <p className="text-sm text-text-muted">Uniform categories will appear here once they are added.</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3" variants={staggerGrid} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            {types.map(([type, count]) => (
              <motion.div key={type} variants={gridItem}>
                <Link
                  to={`/products?type=${encodeURIComponent(type)}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-border-light hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 flex items-center justify-center text-text-muted group-hover:text-brand-primary group-hover:scale-110 transition-all duration-300">
                      {getCategoryIcon(type)}
                    </div>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-brand-primary transition-colors duration-200">{type}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* ── Recently Added / Featured Products ─────────────────── */}
      <motion.section
        className="mb-24 lg:mb-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              {recentProducts.length > 0 ? 'New This Month' : 'Featured Products'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {recentProducts.length > 0 ? 'Uploaded this month' : 'Popular picks for the new term'}
            </p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-hover transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-card bg-surface-default border border-border-default overflow-hidden">
                <div className="aspect-[3/2] skeleton" />
                <div className="p-16 space-y-12">
                  <div className="skeleton h-16 rounded-chip w-3/4" />
                  <div className="skeleton h-12 rounded-chip w-1/2" />
                  <div className="skeleton h-16 rounded-chip w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="rounded-card border border-border-default bg-surface-muted/50 py-20 text-center">
            <p className="text-lg font-semibold text-text-primary mb-1">No products available yet</p>
            <p className="text-sm text-text-muted">New arrivals will appear here once they are added.</p>
          </div>
        ) : (
          <motion.div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3`} variants={staggerGrid} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
            {displayProducts.map((product) => (
              <motion.div key={product.productId} variants={gridItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={sectionReveal}
      >
        <div className="relative overflow-hidden rounded-panel bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-0 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-12 sm:px-10 sm:py-14">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-0 tracking-tight mb-1">Ready for the New School Term?</h2>
              <p className="text-neutral-400 text-sm">Browse our full collection and find the perfect uniforms.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-neutral-0 font-semibold text-sm rounded-pill hover:bg-brand-hover transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] h-14 whitespace-nowrap">
              Shop Uniforms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-24 lg:mt-32 border-t border-border-default pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl font-bold text-text-primary tracking-tight">MONISHA</span>
              <span className="text-[10px] font-medium text-text-muted tracking-[0.2em] uppercase mt-1">Premium Uniforms</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
              Premium school uniforms crafted for comfort, style, and durability. Trusted by leading schools across Zimbabwe.
            </p>
            <div className="flex items-center gap-3">
              {['W', 'F', 'I'].map((s, i) => (
                <span key={i} className="w-9 h-9 rounded-pill bg-surface-muted border border-border-default flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/20 transition-all duration-200 cursor-pointer text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'Schools', 'Categories', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-text-secondary hover:text-brand-primary transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a href="mailto:info@monisha.co.zw" className="hover:text-brand-primary transition-colors duration-200">info@monisha.co.zw</a>
              </li>
              <li>
                <a href="tel:+263771234567" className="hover:text-brand-primary transition-colors duration-200">+263 77 123 4567</a>
              </li>
              <li className="leading-relaxed">
                123 Samora Machel Ave<br />Harare, Zimbabwe
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Hours</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between"><span className="text-text-secondary">Mon – Fri</span><span className="text-text-primary font-medium">8:00 – 17:00</span></li>
              <li className="flex justify-between"><span className="text-text-secondary">Saturday</span><span className="text-text-primary font-medium">8:00 – 13:00</span></li>
              <li className="flex justify-between"><span className="text-text-secondary">Sunday</span><span className="text-text-muted">Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-default pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-text-muted">&copy; {new Date().getFullYear()} Monisha Premium Uniforms. All rights reserved.</span>
          <div className="flex items-center gap-5 text-xs text-text-muted">
            <Link to="/products" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="/products" className="hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
