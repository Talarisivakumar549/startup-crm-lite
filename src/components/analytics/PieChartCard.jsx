import { useState, useMemo, useCallback, memo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector, Tooltip } from 'recharts';
import { getStatusDistribution } from '../../utils/analyticsHelpers';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme } from '../../constants';

// Renders the highlighted slice on hover with extra outer radius
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

// Custom Tooltip Renderer - defined outside of rendering cycles
const CustomTooltip = ({ active, payload, theme }) => {
  if (active && payload && payload.length) {
    const dataInfo = payload[0].payload;
    return (
      <div
        className="rounded-xl border p-3 shadow-md text-xs font-semibold"
        style={{
          backgroundColor: theme.tooltipBg,
          borderColor: theme.tooltipBorder,
          color: theme.tooltipText,
        }}
      >
        <p style={{ color: dataInfo.color }} className="font-bold uppercase tracking-wider text-2xs mb-0.5">
          {dataInfo.name}
        </p>
        <p className="mt-0.5">{dataInfo.value} Leads</p>
        <p className="text-slate-500 font-medium">{dataInfo.percentage}%</p>
      </div>
    );
  }
  return null;
};

function PieChartCard({ leads = [] }) {
  const { isDarkMode } = useTheme();
  
  // Memoize theme resolution
  const theme = useMemo(() => getChartTheme(isDarkMode), [isDarkMode]);
  
  // Memoize data calculations
  const data = useMemo(() => getStatusDistribution(leads), [leads]);
  
  const [activeIndex, setActiveIndex] = useState(-1);
  const totalLeads = leads.length;

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Lead Status Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution of lead conversions across the pipeline stages
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          No leads data available
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-around flex-1 relative">
          
          {/* Doughnut Chart with Center Count */}
          <div className="relative h-44 w-44 shrink-0">
            {/* Absolute Centered Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {totalLeads}
              </span>
              <span className="text-4xs uppercase tracking-widest font-extrabold text-slate-400 dark:text-slate-500">
                Total Leads
              </span>
            </div>
 
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  isAnimationActive={true}
                  animationDuration={600}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip theme={theme} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend displaying stage details */}
          <div className="w-full flex-1 max-w-[220px] space-y-1.5 overflow-y-auto max-h-[180px] pr-1 scrollbar-thin">
            {data.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-2xs border-b border-slate-50 dark:border-slate-800/40 pb-1 cursor-pointer transition-all"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
                style={{ opacity: activeIndex === -1 || activeIndex === idx ? 1 : 0.4 }}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex gap-1.5">
                  <span>{item.value}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PieChartCard);
