import { useMemo, memo } from 'react';
import { UserPlus, ArrowUpRight, Database, TrendingUp, CalendarDays, XCircle } from 'lucide-react';
import {
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
} from '../../utils/analyticsHelpers';

// Helper to format currency in Indian Rupees - defined outside component
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

// Helper to render trend/growth badge - defined outside component
const renderTrend = (value, isPercentagePoints = false, invertSentiment = false) => {
  if (value === 0) {
    return (
      <span className="text-slate-400 dark:text-slate-500 font-medium">
        0% {isPercentagePoints ? 'change' : ''} vs prev
      </span>
    );
  }

  const isPositive = value > 0;
  const isGood = invertSentiment ? !isPositive : isPositive;
  const sign = isPositive ? '+' : '';
  const suffix = isPercentagePoints ? '%p' : '%';

  return (
    <span className="flex items-center gap-0.5">
      <span className={`font-bold ${isGood ? 'text-green-500' : 'text-red-500'}`}>
        {sign}
        {value}
        {suffix}
      </span>
      <span className="text-slate-400 dark:text-slate-500 font-medium">vs prev period</span>
    </span>
  );
};

function StatsCards({ leads = [], previousLeads = [] }) {
  // Memoize all statistics and growth calculations in a single block
  const metrics = useMemo(() => {
    // Current Period Metrics
    const totalLeads = leads.length;
    const wonLeadsCount = leads.filter((l) => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? (wonLeadsCount / totalLeads) * 100 : 0;
    const pipelineValue = getPipelineValue(leads);
    const wonRevenue = getWonRevenue(leads);
    const avgSalesCycle = getAverageSalesCycle(leads);
    const lostRate = getLostRate(leads);

    // Previous Period Metrics
    const prevTotalLeads = previousLeads.length;
    const prevWonLeadsCount = previousLeads.filter((l) => l.status === 'Won').length;
    const prevConversionRate = prevTotalLeads > 0 ? (prevWonLeadsCount / prevTotalLeads) * 100 : 0;
    const prevPipelineValue = getPipelineValue(previousLeads);
    const prevWonRevenue = getWonRevenue(previousLeads);
    const prevAvgSalesCycle = getAverageSalesCycle(previousLeads);
    const prevLostRate = getLostRate(previousLeads);

    // Growth percentages
    const leadsGrowth = prevTotalLeads === 0
      ? (totalLeads > 0 ? 100 : 0)
      : Math.round(((totalLeads - prevTotalLeads) / prevTotalLeads) * 100);

    const conversionChange = Math.round(conversionRate - prevConversionRate);

    const pipelineGrowth = prevPipelineValue === 0
      ? (pipelineValue > 0 ? 100 : 0)
      : Math.round(((pipelineValue - prevPipelineValue) / prevPipelineValue) * 100);

    const revenueGrowth = prevWonRevenue === 0
      ? (wonRevenue > 0 ? 100 : 0)
      : Math.round(((wonRevenue - prevWonRevenue) / prevWonRevenue) * 100);

    const lostRateChange = Math.round(lostRate - prevLostRate);

    return {
      totalLeads,
      conversionRate,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      lostRate,
      prevAvgSalesCycle,
      wonLeadsCount,
      leadsGrowth,
      conversionChange,
      pipelineGrowth,
      revenueGrowth,
      lostRateChange,
    };
  }, [leads, previousLeads]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
      {/* KPI 1: Total Leads */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total Leads
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/30">
            <UserPlus className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.totalLeads}
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {renderTrend(metrics.leadsGrowth)}
          </div>
        </div>
      </div>

      {/* KPI 2: Conversion Rate */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Conversion Rate
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-405 border border-green-100/30">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {Math.round(metrics.conversionRate)}%
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {renderTrend(metrics.conversionChange, true)}
          </div>
        </div>
      </div>

      {/* KPI 3: Pipeline Value */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Pipeline Value
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-450 border border-amber-100/30">
            <Database className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate" title={formatCurrency(metrics.pipelineValue)}>
            {formatCurrency(metrics.pipelineValue)}
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {renderTrend(metrics.pipelineGrowth)}
          </div>
        </div>
      </div>

      {/* KPI 4: Won Revenue */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Won Revenue
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/30">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate" title={formatCurrency(metrics.wonRevenue)}>
            {formatCurrency(metrics.wonRevenue)}
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {renderTrend(metrics.revenueGrowth)}
          </div>
        </div>
      </div>

      {/* KPI 5: Avg Sales Cycle */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Avg Sales Cycle
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100/30">
            <CalendarDays className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.avgSalesCycle} {metrics.avgSalesCycle === 1 ? 'Day' : 'Days'}
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {metrics.prevAvgSalesCycle > 0 ? (
              renderTrend(Math.round(((metrics.avgSalesCycle - metrics.prevAvgSalesCycle) / metrics.prevAvgSalesCycle) * 100), false, true)
            ) : (
              <span className="text-slate-400 dark:text-slate-500 font-medium">target 15d limit</span>
            )}
          </div>
        </div>
      </div>

      {/* KPI 6: Lost Rate */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Lost Rate
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-100/30">
            <XCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {metrics.lostRate}%
          </div>
          <div className="mt-1 text-3xs font-semibold flex items-center gap-1">
            {renderTrend(metrics.lostRateChange, true, true)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(StatsCards);
