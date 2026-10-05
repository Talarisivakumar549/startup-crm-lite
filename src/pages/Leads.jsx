import { useState, useEffect } from 'react'
import { Plus, LayoutGrid, List, X } from 'lucide-react'

// Hooks and subcomponents
import useLocalStorage from '../hooks/useLocalStorage'
import { useLeads } from '../context/LeadContext'
import LeadForm from '../components/leads/LeadForm'
import LeadCard from '../components/leads/LeadCard'
import LeadTable from '../components/leads/LeadTable'

// Common components
import SearchBar from '../components/common/SearchBar'
import FilterBar from '../components/common/FilterBar'
import EmptyState from '../components/common/EmptyState'

/**
 * Leads page component.
 * Orchestrates CRUD operations for lead management,
 * handles search & filtration state, supports card/table views,
 * manages modal dialog controls, and serves operations notifications.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads()
  const [viewMode, setViewMode] = useLocalStorage('crm_leads_view_mode', 'table')
  
  // Dialog modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadToDelete, setLeadToDelete] = useState(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  /**
   * Resets search query and active status filters back to default.
   */
  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveFilter('All')
  }

  /**
   * Triggers the edit modal for a specific lead.
   * 
   * @param {import('../components/leads/LeadCard').Lead} lead - The lead to edit.
   */
  const handleEditClick = (lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  /**
   * Triggers the create modal.
   */
  const handleAddClick = () => {
    setSelectedLead(null)
    setIsModalOpen(true)
  }

  /**
   * Closes the creation/edit modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLead(null)
  }

  /**
   * Submits form data to create a new lead or update an existing lead.
   * 
   * @param {import('../components/leads/LeadForm').LeadFormData} formData - Validated form entries.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit mode: update existing lead
      updateLead(selectedLead.id, formData)
    } else {
      // Create mode: add new lead
      addLead(formData)
    }
    handleCloseModal()
  }

  /**
   * Confirms and triggers lead deletion.
   */
  const handleConfirmDelete = () => {
    if (!leadToDelete) return
    deleteLead(leadToDelete.id)
    setLeadToDelete(null)
  }

  // Escape key handler to close the modal (accessibility)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) handleCloseModal()
        if (leadToDelete) setLeadToDelete(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, leadToDelete])

  // Filter leads based on active status filter and search query
  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter((lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Page Title Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lead Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create, qualify, monitor, and configure lead pipelines.
          </p>
        </div>
        
        {/* Create Lead Button */}
        <button
          onClick={handleAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Toolbar Container */}
      <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-row md:items-center md:justify-between">
        
        {/* Debounced Search Component */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Layout Switch Toggle Buttons (Visible on Tablet only) */}
        <div className="hidden md:flex lg:hidden items-center gap-1 border-t border-gray-200 pt-3 dark:border-gray-700 md:border-t-0 md:pt-0">
          <span className="mr-2 text-xs font-medium text-gray-400 dark:text-gray-500">
            Layout:
          </span>
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table Layout"
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-700/50'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            aria-label="Card Layout"
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors cursor-pointer ${
              viewMode === 'card'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-700/50'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Category Toolbar */}
      <div className="mb-6">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {/* Main content display section */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          totalLeadsCount={leads.length}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          {/* Table layout: shown on desktop always, and on tablet if viewMode is table */}
          <div className={viewMode === 'table' ? "hidden md:block" : "hidden lg:block"}>
            <LeadTable
              leads={filteredLeads}
              onEdit={handleEditClick}
              onDelete={setLeadToDelete}
            />
          </div>

          {/* Card layout: shown on mobile always, and on tablet if viewMode is card. Hidden on desktop. */}
          <div className={viewMode === 'card' ? "block lg:hidden" : "block md:hidden"}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditClick}
                  onDelete={setLeadToDelete}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* CRUD Creation & Editor Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-gray-900/60 backdrop-blur-xs"
        >
          {/* Modal box container: full-screen on mobile, centered max-w-lg on tablet+ */}
          <div className="relative w-full h-full md:h-auto overflow-y-auto max-h-screen md:max-h-[90vh] md:max-w-lg rounded-none md:rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-fade-in">
            {/* Close trigger button (min 44x44px touch target) */}
            <button
              onClick={handleCloseModal}
              aria-label="Close form"
              className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:hover:text-gray-300 cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Form component insertion */}
            <LeadForm
              key={selectedLead?.id || 'new'}
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal overlay for deletion */}
      {leadToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs"
        >
          {/* Confirmation Box container */}
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800 animate-fade-in">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Confirm Delete Lead
            </h3>
            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Are you sure you want to delete lead <strong className="text-gray-800 dark:text-gray-200">{leadToDelete.name}</strong> ({leadToDelete.company})? This action is permanent and cannot be undone.
            </p>
            
            {/* Operation actions buttons */}
            <div className="mt-5 flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 md:py-1.5 text-sm md:text-xs font-semibold text-gray-700 shadow-3xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer min-h-[44px] md:min-h-0"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-3 md:py-1.5 text-sm md:text-xs font-semibold text-white shadow-xs transition-colors hover:bg-red-700 cursor-pointer min-h-[44px] md:min-h-0"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
