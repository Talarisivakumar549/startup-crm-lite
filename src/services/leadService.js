import api from './api'

/**
 * Retrieve leads list with search and filtration parameters.
 * 
 * @param {Object} [params] - Query parameters (status, search, page, limit, sort).
 * @returns {Promise<Object>} Promise resolving to the paginated list of leads.
 */
export const getLeads = async (params) => {
  const response = await api.get('/api/leads', { params })
  return response.data
}

/**
 * Create a new lead record.
 * 
 * @param {Object} leadData - Fields required by lead validation schema (name, company, email, status, source, value).
 * @returns {Promise<Object>} Promise resolving to the newly created lead object.
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData)
  return response.data
}

/**
 * Update an existing lead's fields.
 * 
 * @param {string} id - Lead identifier.
 * @param {Object} leadData - Object containing updated fields.
 * @returns {Promise<Object>} Promise resolving to the updated lead.
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData)
  return response.data
}

/**
 * Update the status pipeline stage of a specific lead.
 * 
 * @param {string} id - Lead identifier.
 * @param {string} status - New pipeline status stage ('New', 'Contacted', etc.).
 * @returns {Promise<Object>} Promise resolving to the updated lead.
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status })
  return response.data
}

/**
 * Delete a lead record.
 * 
 * @param {string} id - Lead identifier.
 * @returns {Promise<Object>} Promise resolving to the deletion result status.
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`)
  return response.data
}

/**
 * Retrieve aggregated lead statistics (status counts, wins, conversion metrics).
 * 
 * @returns {Promise<Object>} Promise resolving to the leads summary statistics.
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary')
  return response.data
}

/**
 * Retrieve monthly sales pipeline trend aggregated data.
 * 
 * @returns {Promise<Object>} Promise resolving to monthly analytics trends.
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly')
  return response.data
}

const leadService = {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
}

export default leadService
