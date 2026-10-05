import { useMemo, memo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { getLeadSourceStats } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme, CHART_COLORS } from '../../constants';

// Custom colors for channels to add visual variety - defined outside component
const COLORS = [
  CHART_COLORS.purple,
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.slate,
];

// Custom Tooltip Renderer - defined outside component
const CustomTooltip = ({ active, payload, theme }) => {
  if (active && payload && payload.length) {
    const dataInfo = payload[0].payload;
    return (
      <div
        className="rounded-xl border p-2.5 shadow-md text-xs font-semibold"
        style={{
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          color: theme.tooltipText,
        }}
      >
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-0.5">{dataInfo.source}</p>
        <p className="text-purple-600 dark:text-purple-400">
          {dataInfo.count} {dataInfo.count === 1 ? 'Lead' : 'Leads'} ({dataInfo.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

function LeadSourceChart({ leads = [] }) {
  const { isDarkMode } = useTheme();
  
  const theme = useMemo(() => getChartTheme(isDarkMode), [isDarkMode]);
  const data = useMemo(() => getLeadSourceStats(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Lead Source Analytics
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparison of acquisition channels sorted by volume descending
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No source data available
        </div>
      ) : (
        <div className="flex-1 mt-6 h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.gridColor} />
              <XAxis
                type="number"
                tick={{ fill: theme.textColor, fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="source"
                tick={{ fill: theme.textColor, fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                maxBarSize={20}
                isAnimationActive={true}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default memo(LeadSourceChart);
