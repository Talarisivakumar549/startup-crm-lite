import { memo } from 'react'
import { Pencil, Trash2, Mail, Phone, Globe } from 'lucide-react'
import StatusBadge from './StatusBadge'

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} [phone] - Contact phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel.
 * @property {string} dateAdded - Date lead was created (ISO format).
 */

/**
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - Single lead details to render.
 * @property {(lead: Lead) => void} onEdit - Callback triggered when edit button is clicked.
 * @property {(lead: Lead) => void} onDelete - Callback triggered when delete button is clicked.
 */

/**
 * LeadCard component.
 * Renders a visual card displaying information of a single lead.
 * Includes status badge indicators, contact details, acquisition channel, and operation action buttons.
 */
function LeadCard({ lead, onEdit, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      
      {/* Header: Name, Company & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            {lead.name}
          </h4>
          <span className="text-xs font-semibold text-gray-555 dark:text-gray-400">
            {lead.company}
          </span>
        </div>

        {/* Action icons group: Edit and Delete buttons */}
        <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(lead)}
            aria-label={`Edit ${lead.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-750 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(lead)}
            aria-label={`Delete ${lead.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50/50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mid body: Status Badge and Value */}
      <div className="mt-3.5 flex items-center justify-between">
        <StatusBadge status={lead.status} />
        <span className="text-xs font-bold text-slate-900 bg-slate-50 dark:text-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700/50">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).format(lead.value || 0)}
        </span>
      </div>

      {/* Details list section: Email, Phone, Source */}
      <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700/60">
        
        {/* Email */}
        <div className="flex items-center gap-2.5 text-xs text-gray-650 dark:text-gray-400">
          <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          <a
            href={`mailto:${lead.email}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 truncate"
            title={lead.email}
          >
            {lead.email}
          </a>
        </div>

        {/* Phone */}
        {lead.phone && (
          <div className="flex items-center gap-2.5 text-xs text-gray-650 dark:text-gray-400">
            <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
            <a
              href={`tel:${lead.phone}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {lead.phone}
            </a>
          </div>
        )}

        {/* Source */}
        <div className="flex items-center gap-2.5 text-xs text-gray-650 dark:text-gray-400">
          <Globe className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="font-medium">
            Source: <span className="text-gray-500 dark:text-gray-400 font-normal">{lead.source || 'Other'}</span>
          </span>
        </div>
      </div>

    </div>
  )
}

export default memo(LeadCard)
