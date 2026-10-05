import { useMemo, memo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getRevenueByMonth } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme, CHART_COLORS } from '../../constants';

// Formatting currency helper - defined outside component
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

// Custom Tooltip Renderer - defined outside component
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border p-2.5 shadow-md text-xs font-semibold"
        style={{
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          color: theme.tooltipText,
        }}
      >
        <p className="font-bold text-slate-500 mb-0.5">{label} Revenue</p>
        <p className="text-green-500 dark:text-green-400 font-extrabold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

function RevenueChartCard({ leads = [] }) {
  const { isDarkMode } = useTheme();
  
  const theme = useMemo(() => getChartTheme(isDarkMode), [isDarkMode]);
  const data = useMemo(() => getRevenueByMonth(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Revenue Growth Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monthly aggregate revenue closed from Won deals over the last 6 months
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No revenue data available
        </div>
      ) : (
        <div className="flex-1 mt-6 h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fill: theme.textColor, fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.textColor, fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.success}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default memo(RevenueChartCard);
