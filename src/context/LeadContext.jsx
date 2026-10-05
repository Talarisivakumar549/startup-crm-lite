/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import leadService from '../services/leadService'
import { useAuth } from './AuthContext'

/**
 * @typedef {Object} Lead
 * @property {string} _id - The unique ID of the lead in MongoDB.
 * @property {string} name - The contact name of the lead.
 * @property {string} company - The company of the lead.
 * @property {string} email - The email address of the lead.
 * @property {string} phone - The phone number of the lead.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel.
 * @property {number} value - Financial value of the deal.
 * @property {string} createdAt - The creation timestamp in ISO date format.
 */

// Create the Context object
export const LeadContext = createContext(undefined)

/**
 * LeadProvider component.
 * Wraps the application to serve the global leads state and CRUD triggers via backend API.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  })

  const { token } = useAuth()

  /**
   * Fetch leads list with optional filters.
   */
  const fetchLeads = useCallback(async (params) => {
    setIsLoading(true)
    try {
      const result = await leadService.getLeads(params)
      if (result && result.success) {
        setLeads(result.data || [])
        setPagination(result.pagination || { total: 0, page: 1, limit: 10, pages: 1 })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch leads'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Appends a new lead to the list by calling backend.
   */
  const addLead = async (leadData) => {
    setIsLoading(true)
    try {
      const result = await leadService.createLead(leadData)
      if (result && result.success) {
        setLeads((prev) => [result.data, ...prev])
        toast.success(result.message || 'Lead created successfully!', {
          duration: 3000,
          style: {
            border: '1px solid var(--brand-success)',
            padding: '12px',
            color: 'var(--brand-success)',
            background: 'var(--brand-surface)',
          },
        })
        return result.data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create lead'
      toast.error(errorMsg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Updates properties of an existing lead.
   */
  const updateLead = async (id, updatedFields) => {
    setIsLoading(true)
    try {
      const result = await leadService.updateLead(id, updatedFields)
      if (result && result.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead._id === id || lead.id === id ? result.data : lead))
        )
        toast.success(result.message || 'Lead updated successfully!', {
          duration: 3000,
          style: {
            border: '1px solid var(--brand-success)',
            padding: '12px',
            color: 'var(--brand-success)',
            background: 'var(--brand-surface)',
          },
        })
        return result.data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update lead'
      toast.error(errorMsg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Deletes a lead from the list.
   */
  const deleteLead = async (id) => {
    setIsLoading(true)
    const leadToDelete = leads.find((lead) => lead._id === id || lead.id === id)
    const name = leadToDelete ? leadToDelete.name : 'Lead'
    try {
      const result = await leadService.deleteLead(id)
      if (result && result.success) {
        setLeads((prev) => prev.filter((lead) => lead._id !== id && lead.id !== id))
        toast.error(`Lead for ${name} has been removed.`, {
          icon: '🗑️',
          duration: 3500,
          style: {
            border: '1px solid var(--brand-error)',
            padding: '12px',
            color: 'var(--brand-error)',
            background: 'var(--brand-surface)',
          },
        })
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete lead'
      toast.error(errorMsg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Retrieves a single lead detail by its ID.
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead._id === id || lead.id === id)
  }

  // Fetch leads initially when token changes (logs in / restores session)
  useEffect(() => {
    if (token) {
      fetchLeads()
    } else {
      setLeads([])
    }
  }, [token, fetchLeads])

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

/**
 * Custom React hook to consume the Leads context.
 */
export function useLeads() {
  const context = useContext(LeadContext)
  if (context === undefined) {
    throw new Error('useLeads must be used inside a LeadProvider. Make sure to wrap your application in <LeadProvider>.')
  }
  return context
}
