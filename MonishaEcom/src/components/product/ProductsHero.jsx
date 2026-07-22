import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';

export default function ProductsHero({ search, setSearch, resultCount }) {
  const [focused, setFocused] = useState(false);

  return (
    <section className="mb-10 lg:mb-14">
      <div className="relative py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle text-brand-primary text-[11px] font-semibold tracking-wide uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              School Uniforms
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4"
          >
            Shop Uniforms
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Find everything your student needs for the new school term.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className={`relative group transition-all duration-300 ${focused ? 'scale-[1.01]' : ''}`}>
              <div className={`absolute -inset-0.5 rounded-2xl transition-opacity duration-300 ${focused ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.05))' }} />
              <div className="relative flex items-center bg-surface-default border border-border-default rounded-2xl shadow-elevation-1 overflow-hidden transition-all duration-300 focus-within:shadow-elevation-2 focus-within:border-brand-primary/30">
                <Search className={`ml-5 w-5 h-5 shrink-0 transition-colors duration-200 ${focused ? 'text-brand-primary' : 'text-text-muted'}`} />
                <input
                  type="text"
                  placeholder="Search by school, uniform type, or colour..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="flex-1 px-4 py-5 bg-transparent text-base text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="mr-3 w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-border-default transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="mr-3 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer hover:bg-brand-hover transition-colors">
                    Search <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-text-muted"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {resultCount} products
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              School approved
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Fast delivery
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
