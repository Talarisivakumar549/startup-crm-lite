import { useMemo, memo } from 'react';
import { FunnelChart, Funnel, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getFunnelData } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme } from '../../constants';

// Custom Tooltip for the Funnel - defined outside component
const CustomTooltip = ({ active, payload, theme }) => {
  if (active && payload && payload.length) {
    const stage = payload[0].payload;
    return (
      <div
        className="rounded-xl border p-3 shadow-md text-xs font-semibold"
        style={{
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          color: theme.tooltipText,
        }}
      >
        <p style={{ color: stage.color }} className="font-bold uppercase tracking-wider text-2xs mb-0.5">
          {stage.name}
        </p>
        <p className="mt-0.5">{stage.value} Leads</p>
        <p className="text-slate-400 dark:text-slate-500 font-medium">Conversion: {stage.percentage}%</p>
        {stage.name !== 'New' && (
          <p className="text-red-500 dark:text-red-400 mt-0.5">
            Drop-off: {stage.dropOff}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

function FunnelChartCard({ leads = [] }) {
  const { isDarkMode } = useTheme();
  
  const theme = useMemo(() => getChartTheme(isDarkMode), [isDarkMode]);
  const data = useMemo(() => getFunnelData(leads), [leads]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Sales Conversion Funnel
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Cumulative conversion rate and leakages through each pipeline stage
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No funnel data available
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-around flex-1">
          {/* Recharts Funnel Chart Container */}
          <div className="h-44 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Funnel
                  dataKey="value"
                  data={data}
                  isAnimationActive
                  animationDuration={600}
                >
                  {data.map((entry, index) => (
                    <Cell key={`funnel-cell-${index}`} fill={entry.color} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Right sidebar listing stage details */}
          <div className="w-full flex-1 max-w-[220px] space-y-2">
            {data.map((item, idx) => (
              <div key={item.name} className="flex flex-col text-2xs border-b border-slate-50 dark:border-slate-800/40 pb-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.count}{' '}
                    <span className="text-slate-400 dark:text-slate-500 font-normal">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
                {idx > 0 && (
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pl-3.5 mt-0.5 font-medium">
                    <span>Conv: {item.conversionRate}% from prior</span>
                    <span className="text-red-500 dark:text-red-400">-{item.dropOff}% drop-off</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FunnelChartCard);
