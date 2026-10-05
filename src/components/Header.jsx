import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import { Sparkles } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <header className="hidden md:flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800 transition-colors duration-200 sticky top-0 z-30 shadow-xs">
      {/* Left section: welcome statement */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Welcome back, <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
        </span>
      </div>

      {/* Right section: user actions */}
      <div className="flex items-center gap-4">
        <ProfileDropdown />
      </div>
    </header>
  )
}
