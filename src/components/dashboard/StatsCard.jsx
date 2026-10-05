import { memo } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The name of the metric (e.g., "Total Leads").
 * @property {string|number} value - The numeric or string value to display (e.g., "$45,200", 124).
 * @property {React.ComponentType<{ className?: string }>} icon - The Lucide React icon component to render.
 * @property {number} change - The percentage change vs last month (e.g., 12.5 for +12.5%, -3.2 for -3.2%).
 * @property {'primary'|'success'|'warning'|'danger'} color - The theme color for the card's accent indicator.
 */

// Map color prop to specific Tailwind classes for borders, backgrounds, and text
const COLOR_MAP = {
  primary: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/30'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-100 dark:border-green-900/30'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/30'
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-100 dark:border-red-900/30'
  }
}

/**
 * StatsCard component that displays a single KPI metric.
 * Features an icon with a color-coded background, large value, and relative change percentage.
 */
function StatsCard({ title, value, icon: Icon, change, color }) {
  // Fallback to primary if color is not found or invalid
  const theme = COLOR_MAP[color] || COLOR_MAP.primary
  const isPositive = change >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        {/* Metric Title */}
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        
        {/* Metric Icon Container */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.bg} ${theme.text}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {/* Metric Value */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </span>
      </div>

      {/* Trend Percentage Change */}
      <div className="mt-4 flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isPositive
              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          vs last month
        </span>
      </div>
    </div>
  )
}

export default memo(StatsCard)
