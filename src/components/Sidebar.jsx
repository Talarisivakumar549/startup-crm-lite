import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Settings, Sparkles, Menu, X } from 'lucide-react'
import DarkModeToggle from './common/DarkModeToggle'
import ProfileDropdown from './ProfileDropdown'

const navItems = [
  { path: '/', label: 'Dashboard', subLabel: 'Overview & Stats', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', subLabel: 'Sales Pipeline', icon: Users },
  { path: '/analytics', label: 'Analytics', subLabel: 'Reports & Forecasts', icon: BarChart3 },
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP HEADER (Visible on Mobile only)                             */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 transition-colors duration-200 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 shadow-xs shadow-blue-500/20">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold tracking-tight text-gray-900 dark:text-white">Startup CRM</span>
            <span className="text-[8px] text-gray-400 dark:text-gray-550 font-bold uppercase tracking-wider">LITE</span>
          </div>
        </div>

        {/* Mobile Actions: Profile and Hamburger Menu */}
        <div className="flex items-center gap-2">
          <ProfileDropdown />
          
          {/* Hamburger Menu Button (min 44x44px touch target) */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-555 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-IN OVERLAY DRAWER                                         */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-45 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 shadow-xs shadow-blue-500/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">Startup CRM</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-550 font-bold uppercase tracking-wider">LITE</span>
              </div>
            </div>
          </div>
          
          {/* Close button (min 44x44px touch target) */}
          <button
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700/50 dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links in Mobile Drawer */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-150 min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Settings and preferences inside Drawer */}
        <div className="border-t border-gray-200 pt-5 dark:border-gray-700 flex flex-col gap-4">
          <DarkModeToggle />
          <button
            onClick={closeMobileMenu}
            aria-label="Workspace Settings"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white transition-all duration-150 cursor-pointer min-h-[44px]"
          >
            <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span>Workspace Settings</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Icons only, always visible at bottom)     */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-colors duration-200 md:hidden shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-white'
                }`
              }
              aria-label={item.label}
            >
              {({ isActive }) => (
                <Icon className={`h-6 w-6 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. PERSISTENT SIDEBAR (Tablet: narrow w-20, Desktop: wide w-64)            */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex h-screen flex-col border-r border-gray-200 bg-white p-4 lg:p-6 dark:border-gray-700 dark:bg-gray-800 transition-all duration-200 shrink-0 sticky top-0 md:w-20 lg:w-64">
        
        {/* Brand logo/header */}
        <div className="mb-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 shadow-xs shadow-blue-500/20">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="hidden lg:flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">Startup CRM</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider">LITE</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3 rounded-lg transition-all duration-150 py-2.5 px-2 lg:px-3 text-center lg:text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    
                    {/* Tablet: Show text labels vertically below icon. Desktop: Show text labels + sub-labels horizontally */}
                    <div className="flex flex-col">
                      <span className="text-[10px] lg:text-sm font-semibold leading-tight">{item.label}</span>
                      <span className="hidden lg:inline text-3xs font-normal text-gray-400 dark:text-gray-500 leading-tight">
                        {item.subLabel}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Sidebar bottom */}
        <div className="border-t border-gray-200 pt-5 dark:border-gray-700 flex flex-col items-center lg:items-stretch gap-4">
          {/* Theme Switcher: compact (icon only) on tablet, full switch on desktop */}
          <div className="w-full lg:hidden flex justify-center">
            <DarkModeToggle compact={true} />
          </div>
          <div className="hidden lg:block w-full">
            <DarkModeToggle compact={false} />
          </div>

          {/* Workspace Settings button */}
          <button
            className="flex items-center justify-center lg:justify-start gap-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-white transition-all duration-150 cursor-pointer h-11 w-11 lg:h-auto lg:w-full lg:px-3 lg:py-2 text-sm font-medium"
            title="Workspace Settings"
            aria-label="Workspace Settings"
          >
            <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="hidden lg:inline">Workspace Settings</span>
          </button>
        </div>

      </aside>
    </>
  )
}
