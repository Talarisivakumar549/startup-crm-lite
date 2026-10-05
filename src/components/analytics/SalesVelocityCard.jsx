import { useMemo, memo } from 'react';
import { getSalesVelocity, getAverageSalesCycle } from '../../utils/analyticsHelpers';

// Currency Formatter - defined outside component
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

function SalesVelocityCard({ leads = [], previousLeads = [] }) {
  // Memoize all intermediate formula calculations
  const stats = useMemo(() => {
    const velocity = getSalesVelocity(leads);
    const cycleDays = getAverageSalesCycle(leads) || 15; // default fallback
    
    // Opportunities = Active leads (not Won, not Lost)
    const opportunities = leads.filter(l => !['Won', 'Lost'].includes(l.status)).length;
    
    // Win Rate = Won leads / Total leads
    const total = leads.length;
    const wonCount = leads.filter(l => l.status === 'Won').length;
    const winRate = total > 0 ? (wonCount / total) * 100 : 0;
    
    // Avg Deal Size
    const wonLeads = leads.filter(l => l.status === 'Won');
    let avgDealSize = 0;
    if (wonLeads.length > 0) {
      const totalWonVal = wonLeads.reduce((sum, l) => sum + Number(l.value || 0), 0);
      avgDealSize = totalWonVal / wonLeads.length;
    } else if (leads.length > 0) {
      const totalVal = leads.reduce((sum, l) => sum + Number(l.value || 0), 0);
      avgDealSize = totalVal / leads.length;
    }

    // Previous period values
    const prevVelocity = getSalesVelocity(previousLeads);

    // Velocity growth trend
    const velocityGrowth = prevVelocity === 0
      ? (velocity > 0 ? 100 : 0)
      : Math.round(((velocity - prevVelocity) / prevVelocity) * 100);

    return {
      velocity,
      cycleDays,
      opportunities,
      winRate,
      avgDealSize,
      velocityGrowth,
    };
  }, [leads, previousLeads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Sales Velocity Widget
          </h3>
          <span className="text-2xs font-semibold text-blue-600 dark:text-blue-400">
            ⚡ Velocity
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Estimated revenue flowing through your sales funnel daily
        </p>
      </div>

      {/* Main Stats Display */}
      <div className="my-auto space-y-4">
        <div>
          <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Current Sales Velocity
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(stats.velocity)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">/ day</span>
          </div>
          <div className="mt-1 text-3xs font-semibold">
            {stats.velocityGrowth === 0 ? (
              <span className="text-slate-400 dark:text-slate-500">0% vs prev period</span>
            ) : (
              <span className={stats.velocityGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {stats.velocityGrowth > 0 ? '+' : ''}{stats.velocityGrowth}% vs prev period
              </span>
            )}
          </div>
        </div>

        {/* Formula variables grid */}
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <span className="text-3xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block mb-2">
            Formula Variables
          </span>
          <div className="grid grid-cols-2 gap-3 text-2xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Opportunities</span>
              <p className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">{stats.opportunities} deals</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Conversion Win Rate</span>
              <p className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">{Math.round(stats.winRate)}%</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Deal Size</span>
              <p className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">{formatCurrency(stats.avgDealSize)}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Sales Cycle</span>
              <p className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">{stats.cycleDays} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Footnote */}
      <div className="border-t border-slate-50 dark:border-slate-800/50 pt-4 text-3xs text-slate-400 dark:text-slate-500 flex items-center justify-between font-medium">
        <span>⚙️ Formula: (Opps * Avg Size * Win Rate) / Cycle</span>
        <span>Real-time calculation</span>
      </div>
    </div>
  );
}

export default memo(SalesVelocityCard);
