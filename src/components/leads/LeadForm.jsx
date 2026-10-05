import { useState, useEffect, useRef } from 'react'
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants'


/**
 * @typedef {Object} LeadFormData
 * @property {string} name - Contact person's name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} [phone] - Contact phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel.
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {LeadFormData} [initialData] - Existing lead data when in edit mode.
 * @property {(data: LeadFormData) => void} onSubmit - Callback function executed on valid form submission.
 * @property {() => void} onCancel - Callback function executed when cancellation is triggered.
 */



/**
 * LeadForm component.
 * Handles creating a new lead or editing an existing lead.
 * Provides validation alerts, accessible input attributes, and automatic keyboard focus.
 *
 * @param {LeadFormProps} props - The component props.
 * @returns {React.JSX.Element} The rendered LeadForm component.
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const nameInputRef = useRef(null)
  
  // Set up form state object
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    value: initialData?.value !== undefined ? initialData.value : ''
  })

  // Set up validation error state
  const [errors, setErrors] = useState({})

  // Focus on name input on mount
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  /**
   * Universal change handler for input fields.
   * Clears corresponding validation errors on typing.
   * 
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => {
         const next = { ...prev }
         delete next[name]
         return next
      })
    }
  }

  /**
   * Form submission validation and dispatch.
   * 
   * @param {React.FormEvent} e - Submit event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}

    // Required field validation
    if (!formData.name.trim()) {
      nextErrors.name = 'Contact name is required'
    }
    if (!formData.company.trim()) {
      nextErrors.company = 'Company name is required'
    }
    
    // Email field validation
    const trimmedEmail = formData.email.trim()
    if (!trimmedEmail) {
      nextErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address'
    }

    // Value validation
    if (formData.value !== '') {
      const numValue = Number(formData.value)
      if (isNaN(numValue) || numValue < 0) {
        nextErrors.value = 'Deal value must be a valid positive number'
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      // Focus on the first element containing errors
      const firstErrorKey = Object.keys(nextErrors)[0]
      const errorElement = document.getElementById(firstErrorKey)
      errorElement?.focus()
      return
    }

    // Call submit handler with clean data
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      value: formData.value !== '' ? Number(formData.value) : 0
    })
  }

  const isEditMode = !!initialData

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 pb-3 dark:border-gray-700">
        {isEditMode ? 'Modify Lead Details' : 'Create New Lead'}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-3 md:py-2 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 ${
              errors.name
                ? 'border-red-350 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500'
            } text-gray-900 dark:text-white`}
          />
          {errors.name && (
            <span id="name-error" className="text-[10px] font-medium text-red-500">
              {errors.name}
            </span>
          )}
        </div>

        {/* Company Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? 'company-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-3 md:py-2 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 ${
              errors.company
                ? 'border-red-350 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500'
            } text-gray-900 dark:text-white`}
          />
          {errors.company && (
            <span id="company-error" className="text-[10px] font-medium text-red-500">
              {errors.company}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. contact@acme.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-3 md:py-2 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 ${
              errors.email
                ? 'border-red-350 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500'
            } text-gray-900 dark:text-white`}
          />
          {errors.email && (
            <span id="email-error" className="text-[10px] font-medium text-red-500">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 000-0000"
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 md:py-2 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Deal Value Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="value" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Deal Value (₹)
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g. 50000"
            aria-invalid={!!errors.value}
            aria-describedby={errors.value ? 'value-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-3 md:py-2 text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 ${
              errors.value
                ? 'border-red-350 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500'
            } text-gray-900 dark:text-white`}
          />
          {errors.value && (
            <span id="value-error" className="text-[10px] font-medium text-red-500">
              {errors.value}
            </span>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Pipeline Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 md:py-2 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="source" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Acquisition Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 md:py-2 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
          >
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 md:py-2 text-sm font-semibold text-gray-700 shadow-3xs transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-3 md:py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
        >
          {isEditMode ? 'Apply Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  )
}
