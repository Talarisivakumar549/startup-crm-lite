import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, LogOut, ChevronDown, Shield, Mail } from 'lucide-react'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  if (!user) return null

  // Generate initials for default avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const initials = getInitials(user.name)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer focus:outline-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
            onError={(e) => {
              // Fallback to initials if image URL fails
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Initials Avatar fallback */}
        <div
          className="h-8 w-8 items-center justify-center rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 text-white text-xs font-bold shadow-xs"
          style={{ display: user.profilePicture ? 'none' : 'flex' }}
        >
          {initials}
        </div>

        <span className="hidden sm:inline text-sm font-semibold text-gray-750 dark:text-gray-300">
          {user.name}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-550 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800 transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Brief Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 mb-1.5">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-550 dark:text-gray-400">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.role && (
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                <Shield className="h-2.5 w-2.5" />
                <span>{user.role}</span>
              </div>
            )}
          </div>

          {/* Menu Options */}
          <div className="space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white transition-all duration-150"
            >
              <User className="h-4 w-4 text-gray-400 dark:text-gray-550" />
              <span>My Profile</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
