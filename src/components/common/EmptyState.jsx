import { memo } from 'react'
import { Search, FolderOpen, RefreshCw } from 'lucide-react'

/**
 * @typedef {Object} EmptyStateProps
 * @property {number} totalLeadsCount - Total count of leads in database.
 * @property {() => void} onClearFilters - Callback to clear query and category filters.
 */

/**
 * EmptyState component.
 * Renders user-friendly state guidance when database is empty,
 * or when search queries yield zero matches, with triggers to clear filters.
 */
function EmptyState({ totalLeadsCount, onClearFilters }) {
  const hasNoLeadsAtAll = totalLeadsCount === 0

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 px-6 text-center dark:border-gray-700 dark:bg-gray-800/40">
      
      {/* Icon Container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-500">
        {hasNoLeadsAtAll ? (
          <FolderOpen className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Search className="h-6 w-6" aria-hidden="true" />
        )}
      </div>

      {/* Main Title and Descriptions */}
      <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
        {hasNoLeadsAtAll ? 'No Leads Registered Yet' : 'No Matching Leads Found'}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {hasNoLeadsAtAll
          ? 'Your sales pipeline is currently empty. Get started by clicking "Add New Lead" at the top of the page.'
          : 'We couldn\'t find any leads matching your current search parameters or filter category. Try adjusting your query.'}
      </p>

      {/* Operation Action triggers */}
      {!hasNoLeadsAtAll && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-3xs transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Clear Search & Filters</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(EmptyState)
