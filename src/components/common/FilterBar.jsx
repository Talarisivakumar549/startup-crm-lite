import { useMemo, memo } from 'react'
import { STATUS_OPTIONS } from '../../constants'

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} [phone] - Contact phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {string} dateAdded - Date lead was created (ISO format).
 */

/**
 * @typedef {Object} FilterBarProps
 * @property {string} activeFilter - Currently selected status filter.
 * @property {(filter: string) => void} onFilterChange - Callback when filter is clicked.
 * @property {Lead[]} leads - List of leads to compute categories counts from.
 */

const FILTER_STAGES = ['All', ...STATUS_OPTIONS]

/**
 * FilterBar component.
 * Renders a row of category filter buttons with dynamically computed counts for each stage,
 * transition animations, and scroll boundaries for small screens.
 */
function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  // Precompute the count of leads in each stage in a single pass (O(N)) using useMemo
  const filterCounts = useMemo(() => {
    const counts = { All: leads.length }
    STATUS_OPTIONS.forEach((status) => {
      counts[status] = 0
    })
    leads.forEach((lead) => {
      const status = lead?.status
      if (status) {
        counts[status] = (counts[status] || 0) + 1
      }
    })
    return counts
  }, [leads])

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-hidden">
      <div className="flex items-center gap-2" role="tablist" aria-label="Filter leads by status">
        {FILTER_STAGES.map((filter) => {
          const isActive = activeFilter === filter
          const count = filterCounts[filter] || 0

          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(filter)}
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 md:py-2 text-xs font-semibold shadow-3xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 dark:hover:text-white'
              }`}
            >
              <span>{filter}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-3xs font-bold leading-none ${
                  isActive
                    ? 'bg-blue-700 text-blue-100 dark:bg-blue-500/30 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(FilterBar)
