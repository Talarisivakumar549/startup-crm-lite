import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * DarkModeToggle component.
 * Renders a switch to toggle dark/light mode with sun and moon icons
 * and smooth sliding animations.
 *
 * @returns {React.JSX.Element} The rendered DarkModeToggle component.
 */
export default function DarkModeToggle({ compact = false }) {
  const { isDarkMode, toggleTheme } = useTheme()

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 transition-all duration-200 cursor-pointer"
        aria-label="Toggle workspace color theme"
      >
        {isDarkMode ? (
          <Moon className="h-4.5 w-4.5 text-blue-400" />
        ) : (
          <Sun className="h-4.5 w-4.5 text-amber-500" />
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Visual accessibility label */}
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Theme Preferences
      </span>
      
      <button
        onClick={toggleTheme}
        type="button"
        className="relative flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-2.5 transition-all duration-200 hover:bg-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900 cursor-pointer"
        aria-label="Toggle workspace color theme"
      >
        <span className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          {isDarkMode ? (
            <>
              <Moon className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Light Mode</span>
            </>
          )}
        </span>

        {/* Sliding Switch representation */}
        <div className="relative h-5.5 w-10.5 rounded-full bg-gray-250 transition-colors duration-200 dark:bg-gray-700">
          <span
            className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </button>
    </div>
  )
}
