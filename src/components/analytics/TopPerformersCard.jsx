import { useMemo, memo } from 'react';
import { Award, Trophy } from 'lucide-react';
import { getTopPerformers } from '../../utils/analyticsHelpers';

// Currency Formatter - defined outside component
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

// Rank Badge color helper - defined outside component
const getRankBadge = (index) => {
  switch (index) {
    case 0:
      return 'bg-amber-100 text-amber-850 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50';
    case 1:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50';
    case 2:
      return 'bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/50';
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-100/50';
  }
};

function TopPerformersCard({ leads = [] }) {
  // Memoize top performers data computation
  const data = useMemo(() => getTopPerformers(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Top Performers
          </h3>
          <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sales owners ranked by Won deal revenue during the period
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No performance records available
        </div>
      ) : (
        <div className="flex-1 mt-6 overflow-y-auto space-y-3.5 max-h-[220px] pr-1 scrollbar-thin">
          {data.map((rep, index) => (
            <div
              key={rep.name}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
            >
              <div className="flex items-center gap-3">
                {/* Rank indicator badge */}
                <div
                  className={`h-7 w-7 rounded-lg border text-2xs font-extrabold flex items-center justify-center shrink-0 ${getRankBadge(
                    index
                  )}`}
                >
                  {index + 1}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {rep.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                    {rep.wonCount} {rep.wonCount === 1 ? 'deal' : 'deals'} won
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                  {formatCurrency(rep.revenue)}
                </span>
                <span className="text-[9px] text-green-500 dark:text-green-400 font-bold flex items-center justify-end gap-0.5">
                  <Award className="h-3 w-3" />
                  Top Performer
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(TopPerformersCard);
