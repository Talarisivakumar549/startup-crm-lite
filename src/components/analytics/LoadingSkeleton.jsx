
/**
 * Skeleton component representing the full analytics dashboard layout.
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Date Filter skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-9 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* KPI Cards Skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-6 w-12 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Big Card Skeletons Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Row 1: Pie / Funnel */}
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-96 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-56 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            
            {/* Visual placeholder inside the card */}
            <div className="flex-1 my-4 flex items-center justify-center">
              {idx === 0 && (
                // Doughnut chart placeholder
                <div className="relative h-44 w-44 rounded-full border-12 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <div className="h-8 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
                </div>
              )}
              {idx === 1 && (
                // Funnel chart placeholder
                <div className="w-full max-w-xs space-y-3.5">
                  <div className="h-7 w-full rounded-md bg-slate-200 dark:bg-slate-800" style={{ width: '100%' }} />
                  <div className="h-7 w-full rounded-md bg-slate-200 dark:bg-slate-800" style={{ width: '80%', margin: '0 auto' }} />
                  <div className="h-7 w-full rounded-md bg-slate-200 dark:bg-slate-800" style={{ width: '60%', margin: '0 auto' }} />
                  <div className="h-7 w-full rounded-md bg-slate-200 dark:bg-slate-800" style={{ width: '40%', margin: '0 auto' }} />
                  <div className="h-7 w-full rounded-md bg-slate-200 dark:bg-slate-800" style={{ width: '20%', margin: '0 auto' }} />
                </div>
              )}
              {idx > 1 && (
                // Graph placeholder
                <div className="w-full h-full flex items-end justify-between gap-4 pt-8">
                  <div className="w-full h-1/3 rounded-t-md bg-slate-200 dark:bg-slate-800" />
                  <div className="w-full h-2/3 rounded-t-md bg-slate-200 dark:bg-slate-800" />
                  <div className="w-full h-1/2 rounded-t-md bg-slate-200 dark:bg-slate-800" />
                  <div className="w-full h-5/6 rounded-t-md bg-slate-200 dark:bg-slate-800" />
                  <div className="w-full h-3/4 rounded-t-md bg-slate-200 dark:bg-slate-800" />
                  <div className="w-full h-full rounded-t-md bg-slate-200 dark:bg-slate-800" />
                </div>
              )}
            </div>

            <div className="h-4 w-full border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
              <div className="h-3.5 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
