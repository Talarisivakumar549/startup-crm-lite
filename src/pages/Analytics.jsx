
// Custom Hooks
import useAnalytics from '../hooks/useAnalytics';

// Helper Components
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

// Visual Chart Components
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import ForecastCard from '../components/analytics/ForecastCard';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';

/**
 * Analytics page component.
 * Serves as the dashboard workspace wrapper containing date presets,
 * high-level KPI cards, and interactive data visualizations.
 */
export default function Analytics() {
  const {
    leads,
    filteredLeads,
    previousLeads,
    filterType,
    setFilterType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    isLoading,
  } = useAnalytics();

  const hasNoLeadsAtAll = leads.length === 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-slate-950 transition-colors duration-200">
      {/* Page Header Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Analytics Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Track sales performance and growth trends.
        </p>
      </div>

      {hasNoLeadsAtAll ? (
        /* Empty Database State */
        <EmptyAnalyticsState />
      ) : (
        <div className="space-y-6">
          {/* Analytics Filter Toolbar */}
          <AnalyticsFilters
            filterType={filterType}
            setFilterType={setFilterType}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />

          {isLoading ? (
            /* Loading Pulse Skeletons */
            <LoadingSkeleton />
          ) : (
            /* Active Dashboard Layout */
            <div className="space-y-6 animate-fadeIn">
              {/* Row 1: KPI Cards */}
              <StatsCards leads={filteredLeads} previousLeads={previousLeads} />

              {/* Rows 2-6: Chart grids (2 columns on desktop/tablet, stacked on mobile) */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Visual Section 1: Lead Distribution & Funnel */}
                <PieChartCard leads={filteredLeads} />
                <FunnelChartCard leads={filteredLeads} />

                {/* Visual Section 2: Acquisition Trends */}
                <BarChartCard leads={filteredLeads} />
                <LineChartCard leads={filteredLeads} />

                {/* Visual Section 3: Value Trends */}
                <RevenueChartCard leads={filteredLeads} />
                <LeadSourceChart leads={filteredLeads} />

                {/* Visual Section 4: Activities & Leaderboards */}
                <ActivityHeatmap leads={filteredLeads} />
                <TopPerformersCard leads={filteredLeads} />

                {/* Visual Section 5: Forecasters */}
                <ForecastCard leads={filteredLeads} />
                <SalesVelocityCard leads={filteredLeads} previousLeads={previousLeads} />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
