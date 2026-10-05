import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value - The parent's search query state value.
 * @property {(query: string) => void} onChange - Callback triggered when the query value updates (debounced).
 */

/**
 * SearchBar component.
 * Renders a search input field with standard search glass icon, dynamic clear buttons,
 * and a 300ms typing debounce delay to optimize performance.
 *
 * @param {SearchBarProps} props - Component props.
 * @returns {React.JSX.Element} The rendered SearchBar component.
 */
export default function SearchBar({ value, onChange }) {
  const [prevValue, setPrevValue] = useState(value)
  const [localQuery, setLocalQuery] = useState(value)
  const timerRef = useRef(null)

  // Sync local query if parent value changes (e.g. cleared by reset action)
  if (value !== prevValue) {
    setPrevValue(value)
    setLocalQuery(value)
  }

  // Clean up debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  /**
   * Input value update handler.
   * Modifies local input state instantly for fast rendering,
   * then schedules the parent update callback using a debounce timer.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event.
   */
  const handleInputChange = (e) => {
    const nextVal = e.target.value
    setLocalQuery(nextVal)

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current)

    // Schedule parent update after 300ms
    timerRef.current = setTimeout(() => {
      onChange(nextVal)
    }, 300)
  }

  /**
   * Instantly clears the search query.
   */
  const handleClear = () => {
    setLocalQuery('')
    if (timerRef.current) clearTimeout(timerRef.current)
    onChange('')
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <span className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>

      {/* Input Field */}
      <input
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full rounded-xl border border-gray-200 bg-white py-3 md:py-2.5 pl-10 pr-10 text-sm transition-all hover:border-gray-300 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:focus:border-blue-500 text-gray-900 dark:text-white"
      />

      {/* Clear Button */}
      {localQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute top-1/2 right-1.5 md:right-3 flex h-10 w-10 md:h-6 md:w-6 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5 md:h-4 md:w-4" />
        </button>
      )}
    </div>
  )
}
