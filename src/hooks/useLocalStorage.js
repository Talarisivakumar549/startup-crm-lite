import { useState, useCallback } from 'react'

/**
 * Checks if localStorage is available and accessible in the current browser session.
 * Handles cases like private browsing sandbox limits or disabled cookies.
 *
 * @returns {boolean} True if localStorage is fully available.
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Custom React hook for persisting state in localStorage.
 * Automatically synchronizes state changes back to local storage.
 * Gracefully falls back to standard in-memory useState hook if localStorage is blocked or throws errors.
 *
 * @template T
 * @param {string} key - The localStorage key under which data is stored.
 * @param {T | (() => T)} initialValue - The fallback value if no data exists, or a function returning it.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} A stateful value and a function to update it.
 */
export default function useLocalStorage(key, initialValue) {
  // Read key value from localStorage or fallback to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    // Resolve initialValue if it's a function (standard useState lazy initialization support)
    const resolvedInitialValue = typeof initialValue === 'function' ? initialValue() : initialValue

    if (!isLocalStorageAvailable()) {
      return resolvedInitialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        // If key doesn't exist yet, save the initial value to localStorage for consistency
        window.localStorage.setItem(key, JSON.stringify(resolvedInitialValue))
        return resolvedInitialValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Error parsing localStorage key "${key}", falling back to initialValue:`, error)
      return resolvedInitialValue
    }
  })

  /**
   * Updates state value and writes to localStorage simultaneously.
   * Supports functional state updates: setValue(prev => next).
   * 
   * @param {T | ((val: T) => T)} value - New state value or state updater callback function.
   */
  const setValue = useCallback((value) => {
    try {
      setStoredValue((prevValue) => {
        // Resolve functional update state parameter
        const valueToStore = value instanceof Function ? value(prevValue) : value

        if (isLocalStorageAvailable()) {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          } catch (writeError) {
            console.warn(`Failed to write to localStorage key "${key}" (quota exceeded or sandboxed):`, writeError)
          }
        }

        return valueToStore
      })
    } catch (err) {
      console.error(`Error executing setValue for localStorage key "${key}":`, err)
    }
  }, [key])

  return [storedValue, setValue]
}
