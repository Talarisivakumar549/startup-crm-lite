/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isDarkMode - Flag showing whether dark mode is currently active.
 * @property {() => void} toggleTheme - Callback to switch between light and dark modes.
 */

// Create the Context object
export const ThemeContext = createContext(undefined)

/**
 * ThemeProvider component.
 * Manages the workspace theme, toggling the 'dark' style class on the documentElement,
 * and synchronizing choices with local storage.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.JSX.Element} The context Provider element.
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false)

  // Synchronize document elements when theme updates
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  /**
   * Toggles between light and dark mode settings.
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom React hook to consume the Theme context.
 * Throws a descriptive error if accessed outside a valid ThemeProvider tree.
 *
 * @returns {ThemeContextValue} The theme context values.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used inside a ThemeProvider. Make sure to wrap your application in <ThemeProvider>.')
  }
  return context
}
