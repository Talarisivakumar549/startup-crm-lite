import { useMemo, memo } from 'react'
import StatusBadge from '../leads/StatusBadge'
import { formatDate } from '../../utils/dateHelpers'

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier for the lead.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Current pipeline status of the lead.
 * @property {string} createdAt - ISO date string when the lead was created.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of all lead objects.
 */

/**
 * RecentLeads component.
 * Renders a clean list of the 5 most recently added leads in a responsive table,
 * showing their contact name, company, status badge, and creation date.
 */
function RecentLeads({ leads = [] }) {
  // Extract and sort the 5 most recent leads by createdAt descending - Memoized
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [leads])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200/50 pb-4 dark:border-gray-700/60">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Leads
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Latest additions to your sales pipeline
          </p>
        </div>
      </div>

      {recentLeads.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-sm text-gray-400 dark:text-gray-550">
          No leads registered yet.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full table-auto text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-700/60">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Company</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 pl-4 font-semibold text-right">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {recentLeads.map((lead) => (
                <tr
                   key={lead.id}
                   className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                >
                  <td className="py-3.5 pr-4 font-medium text-gray-900 dark:text-white">
                    {lead.name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                    {lead.company}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3.5 pl-4 text-right text-gray-500 dark:text-gray-400">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default memo(RecentLeads)
