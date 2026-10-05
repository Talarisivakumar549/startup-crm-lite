import { memo } from 'react';
import { Calendar } from 'lucide-react';

const PRESETS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom Range'];

/**
 * AnalyticsFilters component.
 * Allows filtering leads data by standard pre-sets or a custom calendar range.
 */
function AnalyticsFilters({
  filterType,
  setFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 transition-all sm:flex-row sm:items-center sm:justify-between">
      {/* Preset tabs selector */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 max-w-max">
        {PRESETS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterType(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filterType === tab
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Custom range calendar inputs */}
      {filterType === 'Custom Range' && (
        <div className="flex flex-wrap items-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none dark:text-slate-200"
              aria-label="Start Date"
            />
          </div>
          <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500">to</span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none dark:text-slate-200"
              aria-label="End Date"
            />
          </div>
        </div>
      )}

      {/* Calculated label */}
      <div className="text-2xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Calculated in real-time
      </div>
    </div>
  );
}

export default memo(AnalyticsFilters);
