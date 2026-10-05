/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Lazy-load page components for optimized bundle splitting
const DashboardPage = lazy(() => import('../pages/Dashboard'))
const LeadsPage = lazy(() => import('../pages/Leads'))
const AnalyticsPage = lazy(() => import('../pages/Analytics'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))
const LoginPage = lazy(() => import('../pages/Login'))
const RegisterPage = lazy(() => import('../pages/Register'))
const ProfilePage = lazy(() => import('../pages/Profile'))

/**
 * ProtectedRoute component.
 * Validates the user session state. If authentication is loading, displays a loading indicator.
 * If the user has a session token, renders the nested route child outlet (<Outlet />).
 * Otherwise, forces a redirect to the public login screen (/login).
 */
export function ProtectedRoute() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Loading requested view...</span>
        </div>
      </div>
    )
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Route Configuration Array
 * 
 * Defines routing structures with element outputs and protected children layouts.
 */
const routes = [
  // Public Routes (Accessible without authentication)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // Protected Routes (Require a valid user session token)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/leads',
        element: <LeadsPage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  // Catch-all NotFound Route (Public)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export default routes
