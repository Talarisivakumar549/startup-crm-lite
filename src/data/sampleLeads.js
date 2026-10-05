/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier.
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Contact phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel.
 * @property {number} value - Monetary value of the deal (in INR/rupees).
 * @property {string} createdAt - Date lead was created (ISO format).
 */

/**
 * Predefined sample leads for initialization of the local leads database.
 * Realistically represents Indian founders, names, and organizations.
 *
 * @type {Lead[]}
 */
export const sampleLeads = [
  {
    id: 'lead-1',
    name: 'Amit Sharma',
    company: 'Sharma TechLabs',
    email: 'amit@sharmatechlabs.in',
    phone: '+91 98765 43210',
    status: 'New',
    source: 'Website',
    value: 18000,
    createdAt: '2026-06-25T08:30:00Z'
  },
  {
    id: 'lead-2',
    name: 'Priya Patel',
    company: 'Patel Consulting Services',
    email: 'priya@patelconsulting.com',
    phone: '+91 87654 32109',
    status: 'New',
    source: 'LinkedIn',
    value: 25000,
    createdAt: '2026-06-18T07:15:00Z'
  },
  {
    id: 'lead-3',
    name: 'Rajesh Kumar',
    company: 'Kumar Infrastructure Corp',
    email: 'rajesh@kumarinfra.co.in',
    phone: '+91 76543 21098',
    status: 'Contacted',
    source: 'Referral',
    value: 30000,
    createdAt: '2026-05-20T14:20:00Z'
  },
  {
    id: 'lead-4',
    name: 'Anjali Rao',
    company: 'Rao AgriExports',
    email: 'anjali@raoagriexports.com',
    phone: '+91 65432 10987',
    status: 'Meeting Scheduled',
    source: 'Email Campaign',
    value: 45000,
    createdAt: '2026-04-10T11:45:00Z'
  },
  {
    id: 'lead-5',
    name: 'Vikram Singh',
    company: 'Singh Logistics India',
    email: 'vikram@singhlogistics.co.in',
    phone: '+91 54321 09876',
    status: 'Won',
    source: 'Cold Call',
    value: 85000,
    createdAt: '2026-05-18T11:00:00Z'
  },
  {
    id: 'lead-6',
    name: 'Deepa Nair',
    company: 'Nair Solutions Group',
    email: 'deepa@nairsolutions.com',
    phone: '+91 43210 98765',
    status: 'Lost',
    source: 'Other',
    value: 20000,
    createdAt: '2026-02-15T09:30:00Z'
  }
]
