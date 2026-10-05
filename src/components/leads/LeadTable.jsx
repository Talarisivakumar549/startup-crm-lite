import { memo } from 'react'
import { Pencil, Trash2, Calendar, Globe } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/dateHelpers'

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} [phone] - Contact phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel.
 * @property {string} createdAt - Date lead was created (ISO format).
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of leads to render inside the table.
 * @property {(lead: Lead) => void} onEdit - Callback triggered when edit button is clicked.
 * @property {(lead: Lead) => void} onDelete - Callback triggered when delete button is clicked.
 */

/**
 * LeadTable component.
 * Renders lead information in a tabular layout for tablet and desktop widths.
 * Employs responsive horizontal scrolling, hover highlighting, and formatted date values.
 */
function LeadTable({ leads = [], onEdit, onDelete }) {
  if (leads.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
        No leads registered in database
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700/60 dark:bg-gray-900/50 dark:text-gray-400">
              <th className="py-4 px-6 font-semibold">Name</th>
              <th className="py-4 px-6 font-semibold">Company</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Deal Value</th>
              <th className="py-4 px-6 font-semibold hidden lg:table-cell">Email</th>
              <th className="py-4 px-6 font-semibold hidden lg:table-cell">Source</th>
              <th className="py-4 px-6 font-semibold hidden lg:table-cell">Date Added</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/25"
              >
                {/* Name */}
                <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  <div className="flex flex-col">
                    <span>{lead.name}</span>
                    {lead.phone && (
                      <span className="text-2xs font-normal text-gray-400 dark:text-gray-500 sm:hidden">
                        {lead.phone}
                      </span>
                    )}
                  </div>
                </td>

                {/* Company */}
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                  {lead.company}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={lead.status} />
                </td>

                {/* Deal Value */}
                <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(lead.value || 0)}
                </td>

                {/* Email (and Phone in subtitle on desktop) */}
                <td className="py-4 px-6 hidden lg:table-cell">
                  <div className="flex flex-col gap-0.5 max-w-[200px] truncate">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 truncate"
                      title={lead.email}
                    >
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <span className="text-2xs text-gray-400 dark:text-gray-500 font-medium">
                        {lead.phone}
                      </span>
                    )}
                  </div>
                </td>

                {/* Source */}
                <td className="py-4 px-6 hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Globe className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                    {lead.source || 'Other'}
                  </span>
                </td>

                {/* Date Added */}
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                    {formatDate(lead.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-85 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(lead)}
                      aria-label={`Edit ${lead.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-555 dark:hover:bg-gray-750 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      aria-label={`Delete ${lead.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50/50 hover:text-red-600 dark:text-gray-555 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(LeadTable)
