import { memo } from 'react'

/**
 * @typedef {Object} StatusBadgeProps
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - The pipeline status of the lead.
 */

// Mapping statuses to Tailwind class configurations - defined outside component to prevent recreation on render
const BADGE_MAP = {
  New: {
    text: 'New',
    classes: 'bg-slate-100 text-slate-800 ring-slate-600/10 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-slate-500/20',
    dot: 'bg-slate-400 dark:bg-slate-500'
  },
  Contacted: {
    text: 'Contacted',
    classes: 'bg-amber-50 text-amber-900 ring-amber-600/10 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-500/20',
    dot: 'bg-amber-500'
  },
  'Meeting Scheduled': {
    text: 'Meeting Scheduled',
    classes: 'bg-violet-50 text-violet-900 ring-violet-600/10 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-500/20',
    dot: 'bg-violet-500'
  },
  'Proposal Sent': {
    text: 'Proposal Sent',
    classes: 'bg-blue-50 text-blue-800 ring-blue-600/10 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-500/20',
    dot: 'bg-blue-500'
  },
  Won: {
    text: 'Won',
    classes: 'bg-green-50 text-green-800 ring-green-600/10 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-500/20',
    dot: 'bg-green-500'
  },
  Lost: {
    text: 'Lost',
    classes: 'bg-red-50 text-red-800 ring-red-600/10 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-500/20',
    dot: 'bg-red-500'
  }
}

/**
 * StatusBadge component.
 * Renders a stylized, pill-shaped colored badge corresponding to a lead status.
 */
function StatusBadge({ status }) {
  // Fallback class configuration for unknown statuses
  const config = BADGE_MAP[status] || {
    text: status,
    classes: 'bg-slate-100 text-slate-800 ring-slate-600/10 dark:bg-slate-900/60 dark:text-slate-300 dark:ring-slate-500/20',
    dot: 'bg-slate-400'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.text}</span>
    </span>
  )
}

export default memo(StatusBadge)
