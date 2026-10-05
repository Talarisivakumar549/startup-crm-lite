import { useState, useMemo, memo } from 'react';
import { getActivityHeatmapData } from '../../utils/analyticsHelpers';

// Return background color class matching the activity level intensity - defined outside component
const getBlockColor = (intensity) => {
  switch (intensity) {
    case 0:
      return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/20 dark:border-slate-700/20';
    case 1:
      return 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border-green-200/30';
    case 2:
      return 'bg-green-300 dark:bg-green-800/50 text-green-955 dark:text-green-100 border-green-500/30';
    case 3:
      return 'bg-green-400 dark:bg-green-600/85 text-white border-green-500/30';
    case 4:
    default:
      return 'bg-green-500 dark:bg-green-500 text-white border-green-600/30';
  }
};

function ActivityHeatmap({ leads = [] }) {
  // Memoize activity heatmap data
  const data = useMemo(() => getActivityHeatmapData(leads), [leads]);

  // Memoize aggregated touchpoint details
  const summary = useMemo(() => {
    const activeDays = data.filter((d) => d.totalActivity > 0).length;
    const totalTouchpoints = data.reduce((sum, d) => sum + d.totalActivity, 0);
    return { activeDays, totalTouchpoints };
  }, [data]);

  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-96 relative">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Activity Heatmap
          </h3>
          <span className="text-2xs font-semibold text-slate-400 dark:text-slate-500">
            Last 30 Days
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          GitHub-style grid tracking Leads Created, Meetings Scheduled, and Calls Logged
        </p>
      </div>

      {/* Grid container with custom interactive tooltips */}
      <div className="my-auto flex flex-col items-center justify-center py-4 relative">
        <div className="grid grid-cols-10 gap-2.5 sm:gap-3">
          {data.map((day) => (
            <div
              key={day.dateString}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 cursor-pointer border ${getBlockColor(
                day.intensity
              )}`}
            >
              {day.totalActivity > 0 ? day.totalActivity : ''}
            </div>
          ))}
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredDay && (
          <div
            className="absolute bottom-full mb-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-3 rounded-xl shadow-xl text-3xs space-y-1 z-30 pointer-events-none animate-fadeIn border border-slate-800 dark:border-slate-200"
            style={{ minWidth: '150px' }}
          >
            <p className="font-extrabold border-b border-slate-800 dark:border-slate-100 pb-1 mb-1 text-2xs">
              {hoveredDay.label}
            </p>
            <div className="flex justify-between gap-4 font-medium">
              <span>Leads Created:</span>
              <span className="font-bold">{hoveredDay.leadsCreated}</span>
            </div>
            <div className="flex justify-between gap-4 font-medium">
              <span>Meetings Scheduled:</span>
              <span className="font-bold">{hoveredDay.meetingsScheduled}</span>
            </div>
            <div className="flex justify-between gap-4 font-medium">
              <span>Calls Logged:</span>
              <span className="font-bold">{hoveredDay.callsLogged}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-800 dark:border-slate-100 pt-1 font-bold">
              <span>Total Activity:</span>
              <span>{hoveredDay.totalActivity}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Legend */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 text-2xs text-slate-400 dark:text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-xs bg-green-100 dark:bg-green-950/40" />
          <span className="h-2.5 w-2.5 rounded-xs bg-green-300 dark:bg-green-800/50" />
          <span className="h-2.5 w-2.5 rounded-xs bg-green-500" />
          <span>More</span>
        </div>
        <div className="font-bold text-slate-700 dark:text-slate-300">
          {summary.activeDays}/30 Active Days ({summary.totalTouchpoints} Touchpoints)
        </div>
      </div>
    </div>
  );
}

export default memo(ActivityHeatmap);
