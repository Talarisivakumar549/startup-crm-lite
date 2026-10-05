import { useMemo, memo } from 'react';
import { getForecastRevenue, getRevenueByMonth } from '../../utils/analyticsHelpers';

// Currency Formatter - defined outside component
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

function ForecastCard({ leads = [] }) {
  // Memoize forecast metrics and confidence logic
  const stats = useMemo(() => {
    const predictedRevenue = getForecastRevenue(leads);
    const totalLeads = leads.length;
    const wonLeadsCount = leads.filter(l => l.status === 'Won').length;
    const wonRate = totalLeads > 0 ? (wonLeadsCount / totalLeads) * 100 : 0;

    let confidenceLabel = 'Low Confidence / Volatile';
    let confidencePercentage = 35;
    let confidenceColorClass = 'text-amber-500';
    let progressColorClass = 'bg-amber-500';

    if (wonRate >= 40) {
      confidenceLabel = 'High Confidence / Stable';
      confidencePercentage = 85;
      confidenceColorClass = 'text-green-500';
      progressColorClass = 'bg-green-500';
    } else if (wonRate >= 20) {
      confidenceLabel = 'Medium Confidence / Stable';
      confidencePercentage = 60;
      confidenceColorClass = 'text-blue-500';
      progressColorClass = 'bg-blue-500';
    }

    // Calculate growth trend compared to current month's revenue
    const monthlyRevenue = getRevenueByMonth(leads);
    let growthTrend = 0;
    if (monthlyRevenue.length > 0) {
      const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
      growthTrend = currentMonthRevenue === 0
        ? (predictedRevenue > 0 ? 100 : 0)
        : Math.round(((predictedRevenue - currentMonthRevenue) / currentMonthRevenue) * 100);
    }

    return {
      predictedRevenue,
      wonLeadsCount,
      confidenceLabel,
      confidencePercentage,
      confidenceColorClass,
      progressColorClass,
      growthTrend,
    };
  }, [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Revenue Forecast
          </h3>
          <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500">
            Next Month
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Projections computed from historical closed-won sales run-rate
        </p>
      </div>

      <div className="my-auto space-y-6">
        <div>
          <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Predicted Revenue Next Month
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(stats.predictedRevenue)}
          </div>
          <div className="mt-1 text-3xs font-semibold">
            {stats.growthTrend === 0 ? (
              <span className="text-slate-400 dark:text-slate-500">Flat vs current month</span>
            ) : (
              <span className={stats.growthTrend > 0 ? 'text-green-500' : 'text-red-500'}>
                {stats.growthTrend > 0 ? '▲' : '▼'} {Math.abs(stats.growthTrend)}% growth trend vs current month
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-2xs font-semibold">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">Forecast Confidence</span>
            <span className={`${stats.confidenceColorClass}`}>{stats.confidenceLabel} ({stats.confidencePercentage}%)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stats.progressColorClass}`}
              style={{ width: `${stats.confidencePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Model Footnote */}
      <div className="border-t border-slate-50 dark:border-slate-800/50 pt-4 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <span>📈 Model: 6-Month Historical Revenue Average</span>
        <span>Based on {stats.wonLeadsCount} won deals</span>
      </div>
    </div>
  );
}

export default memo(ForecastCard);
