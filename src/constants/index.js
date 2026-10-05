export const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost'
];

export const SOURCE_OPTIONS = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other'
];

export const STATUS_COLORS = {
  New: 'var(--brand-new)',
  Contacted: 'var(--brand-primary)',
  Meeting: 'var(--brand-warning)',
  Proposal: 'var(--brand-secondary)',
  Won: 'var(--brand-success)',
  Lost: 'var(--brand-error)',
};

// Map full statuses from lead objects to shortened forms
export const STATUS_MAP = {
  'New': 'New',
  'Contacted': 'Contacted',
  'Meeting Scheduled': 'Meeting',
  'Proposal Sent': 'Proposal',
  'Won': 'Won',
  'Lost': 'Lost',
};

// Standard primary colors for non-status charts
export const CHART_COLORS = {
  primary: 'var(--brand-primary)',
  success: 'var(--brand-success)',
  warning: 'var(--brand-warning)',
  purple: 'var(--brand-secondary)',
  danger: 'var(--brand-error)',
  slate: 'var(--brand-accent)',
};

// Recharts theme styling variables for Light vs Dark Modes
export const getChartTheme = (isDarkMode) => ({
  gridColor: 'var(--brand-border)',
  textColor: 'var(--brand-text-secondary)',
  tooltipBg: 'var(--brand-surface)',
  tooltipBorder: 'var(--brand-border)',
  tooltipText: 'var(--brand-text)',
});
