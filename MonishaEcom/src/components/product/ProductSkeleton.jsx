export default function ProductSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-7">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-surface-default border border-border-default overflow-hidden">
          <div className="aspect-[3/4] skeleton" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-2.5 rounded w-1/3" />
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-3 rounded w-1/2" />
            <div className="skeleton h-5 rounded w-1/4" />
            <div className="flex gap-1">
              <div className="skeleton h-5 rounded w-8" />
              <div className="skeleton h-5 rounded w-8" />
              <div className="skeleton h-5 rounded w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
