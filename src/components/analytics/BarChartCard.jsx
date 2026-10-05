import { useMemo, memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getMonthlyLeads } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme, CHART_COLORS } from '../../constants';

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
        <p className="font-bold text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
        <p className="text-blue-600 dark:text-blue-400">
          {payload[0].value} {payload[0].value === 1 ? 'Lead' : 'Leads'}
        </p>
      </div>
    );
  }
  return null;
};

function BarChartCard({ leads = [] }) {
  const { isDarkMode } = useTheme();
  
  const theme = useMemo(() => getChartTheme(isDarkMode), [isDarkMode]);
  const data = useMemo(() => getMonthlyLeads(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Monthly Leads Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monthly acquisition rate of new leads registered in the CRM
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No monthly data available
        </div>
      ) : (
        <div className="flex-1 mt-6 h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Bar
                dataKey="Lead Count"
                fill={CHART_COLORS.primary}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default memo(BarChartCard);
