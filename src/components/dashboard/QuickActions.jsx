import { memo } from 'react'
import { Plus, Users, Download } from 'lucide-react'

/**
 * @typedef {Object} QuickActionsProps
 * @property {() => void} [onAddLead] - Callback triggered when "Add New Lead" is clicked.
 * @property {() => void} [onViewLeads] - Callback triggered when "View All Leads" is clicked.
 * @property {() => void} [onExportData] - Callback triggered when "Export Data" is clicked.
 */

/**
 * QuickActions component.
 * Renders a card containing call-to-action buttons for common operations:
 * adding a lead, viewing all leads, and exporting sales data.
 */
function QuickActions({ onAddLead, onViewLeads, onExportData }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Common tasks and pipeline management
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {/* Add New Lead button */}
        <button
          onClick={onAddLead}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-98 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Lead</span>
        </button>

        {/* View All Leads button */}
        <button
          onClick={onViewLeads}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-3xs transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-350 active:scale-98 cursor-pointer"
        >
          <Users className="h-4.5 w-4.5 text-gray-400 dark:text-gray-555" />
          <span>View All Leads</span>
        </button>

        {/* Export Data button */}
        <button
          onClick={onExportData}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-3xs transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-350 active:scale-98 cursor-pointer"
        >
          <Download className="h-4.5 w-4.5 text-gray-400 dark:text-gray-555" />
          <span>Export Data (CSV)</span>
        </button>
      </div>
    </div>
  )
}

export default memo(QuickActions)
