import { memo } from 'react'

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Current pipeline status of the lead.
 * @property {string} dateAdded - ISO date string when the lead was created.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of lead objects in the system.
 */

// Define known pipeline statuses, color mappings, and sorting order outside to prevent recreation on render
const STATUS_CONFIG = {
  New: {
    label: 'New',
    bgClass: 'bg-slate-400 dark:bg-slate-500',
    textClass: 'text-slate-500 dark:text-slate-400',
    dotClass: 'bg-slate-400 dark:bg-slate-500',
    borderClass: 'border-slate-100 dark:border-slate-900/30'
  },
  Contacted: {
    label: 'Contacted',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-600 dark:text-blue-400',
    dotClass: 'bg-blue-600 dark:bg-blue-400',
    borderClass: 'border-blue-100 dark:border-blue-900/30'
  },
  'Meeting Scheduled': {
    label: 'Meeting',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-500 dark:text-amber-400',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
    borderClass: 'border-amber-100 dark:border-amber-900/30'
  },
  'Proposal Sent': {
    label: 'Proposal',
    bgClass: 'bg-purple-600',
    textClass: 'text-purple-600 dark:text-purple-400',
    dotClass: 'bg-purple-600 dark:bg-purple-400',
    borderClass: 'border-purple-100 dark:border-purple-900/30'
  },
  Won: {
    label: 'Won',
    bgClass: 'bg-green-500',
    textClass: 'text-green-500 dark:text-green-400',
    dotClass: 'bg-green-500 dark:bg-green-400',
    borderClass: 'border-green-100 dark:border-green-900/30'
  },
  Lost: {
    label: 'Lost',
    bgClass: 'bg-red-500',
    textClass: 'text-red-500 dark:text-red-400',
    dotClass: 'bg-red-500 dark:bg-red-400',
    borderClass: 'border-red-100 dark:border-red-900/30'
  }
}

/**
 * PipelineOverview component.
 * Displays a visual horizontal bar representing lead counts segmented by status,
 * together with a status legend indicating counts and conversion percentages.
 */
function PipelineOverview({ leads = [] }) {
  const totalLeads = leads.length
  
  // Calculate counts for each status in a single pass
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status || 'New'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Prepare segments representing statuses present in config keys (ordered for consistency)
  const segments = Object.keys(STATUS_CONFIG).map((status) => {
    const count = statusCounts[status] || 0
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0
    return {
      status,
      count,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
      config: STATUS_CONFIG[status]
    }
  })

  // Filter segments to show values for representation (only render sections > 0% to prevent visual bugs)
  const activeSegments = segments.filter(seg => seg.count > 0)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Pipeline Overview
        </h3>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {totalLeads} {totalLeads === 1 ? 'Lead' : 'Leads'} Total
        </span>
      </div>

      {totalLeads === 0 ? (
        <div className="mt-8 flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900/20">
          No active leads in pipeline
        </div>
      ) : (
        <div className="mt-6">
          {/* Segmented Horizontal Progress Bar */}
          <div className="flex h-4 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            {activeSegments.map((seg) => (
              <div
                key={seg.status}
                style={{ width: `${seg.percentage}%` }}
                className={`${seg.config.bgClass} transition-all duration-300 relative group`}
                title={`${seg.config.label}: ${seg.count} (${seg.percentage}%)`}
              >
                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-0 rounded bg-gray-950 px-2 py-1 text-2xs font-semibold text-white transition-all group-hover:scale-100 dark:bg-gray-750 whitespace-nowrap z-10 shadow-md">
                  {seg.config.label}: {seg.count} ({seg.percentage}%)
                </span>
              </div>
            ))}
          </div>

          {/* Legend and stats distribution grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {segments.map((seg) => (
              <div
                key={seg.status}
                className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/40 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700/40 dark:bg-gray-900/50 dark:hover:bg-gray-800/30"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className={`h-2.5 w-2.5 rounded-full ${seg.config.dotClass}`} />
                  <span className="truncate">{seg.config.label}</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {seg.count}
                  </span>
                  <span className="text-2xs text-gray-400 dark:text-gray-500">
                    ({seg.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(PipelineOverview)
