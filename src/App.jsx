import { Suspense } from 'react'
import { BrowserRouter, useRoutes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import routes from './routes'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LeadProvider } from './context/LeadContext'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

/**
 * AppContent component.
 * Renders the layout grid, sidebar, notifications, and nested routes.
 * Accesses AuthContext to hide the Sidebar on login and register pages.
 */
function AppContent() {
  const element = useRoutes(routes)
  const location = useLocation()
  const { token } = useAuth()

  // Determine if we are on a login or register page, or if we have no token.
  // Sidebar should only show if user is authenticated and not on an authentication page.
  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const showSidebar = token && !isAuthPage

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      {/* Global Toast Notifications */}
      <Toaster position="top-right" />

      {/* Main Layout Grid */}
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Render Sidebar only for authenticated users outside auth pages */}
        {showSidebar && <Sidebar />}

        {/* Content Wrapper */}
        <div className={`flex-1 flex flex-col min-w-0 ${showSidebar ? 'pt-14 pb-16 md:pt-0 md:pb-0' : ''}`}>
          {showSidebar && <Header />}
          <div className="flex-1">
            {/* Suspense handles loading fallback for lazy-loaded route views */}
            <Suspense fallback={
              <div className="flex h-[80vh] items-center justify-center p-6 text-sm text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span>Loading view...</span>
                </div>
              </div>
            }>
              {element}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Root App Component.
 * Registers routing, authentication state, and lead data context providers.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LeadProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </LeadProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
