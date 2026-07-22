import { X } from 'lucide-react';

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-brand-primary text-white shadow-sm'
          : 'bg-surface-muted text-text-secondary hover:bg-surface-default border border-border-default'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductsToolbar({
  schools, types, sortBy, setSortBy,
  selectedSchool, setSelectedSchool,
  selectedType, setSelectedType,
  activeFilterCount, clearFilters,
}) {
  return (
    <div className="sticky top-[72px] z-30 bg-bg-default/90 backdrop-blur-xl border-b border-border-default/50 -mx-5 md:-mx-8 lg:-mx-12 px-5 md:px-8 lg:px-12 py-3 mb-8">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-surface-default border border-border-default rounded-full text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer whitespace-nowrap"
        >
          <option value="name">Name A-Z</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>

        <div className="w-px h-6 bg-border-default shrink-0" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider shrink-0">School</span>
          <div className="flex gap-1.5">
            <Chip active={!selectedSchool} onClick={() => setSelectedSchool('')}>All</Chip>
            {schools.slice(0, 5).map((s) => (
              <Chip key={s} active={selectedSchool === s} onClick={() => setSelectedSchool(selectedSchool === s ? '' : s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-border-default shrink-0" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider shrink-0">Type</span>
          <div className="flex gap-1.5">
            <Chip active={!selectedType} onClick={() => setSelectedType('')}>All</Chip>
            {types.slice(0, 5).map((t) => (
              <Chip key={t} active={selectedType === t} onClick={() => setSelectedType(selectedType === t ? '' : t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>

        {activeFilterCount > 0 && (
          <>
            <div className="w-px h-6 bg-border-default shrink-0" />
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-danger-main hover:text-danger-hover transition-colors whitespace-nowrap"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          </>
        )}
      </div>
    </div>
  );
}
