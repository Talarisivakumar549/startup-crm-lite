import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../services/authService'

// Create the AuthContext
export const AuthContext = createContext(undefined)

/**
 * AuthProvider component that wraps the application to serve global authentication state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // On mount: check localStorage for a session token and restore the user session.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token')
      if (storedToken) {
        try {
          const result = await authService.getProfile()
          // If the profile fetch succeeds, update the state
          if (result && result.success) {
            setUser(result.data)
            setToken(storedToken)
          } else {
            // If the format isn't success, purge the session
            authService.logout()
            setUser(null)
            setToken(null)
          }
        } catch (error) {
          console.error('[AuthContext:restoreSession] Failed to restore session:', error.message)
          // Purge session locally only if it is a real 401/client-auth error,
          // rather than a temporary server connection failure (which would throw a different error)
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            authService.logout()
            setUser(null)
            setToken(null)
          }
        }
      }
      setIsLoading(false)
    }

    restoreSession()
  }, [])

  /**
   * Log in user using email and password.
   * On success: stores JWT token, sets user/token state, and redirects to dashboard (/).
   */
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      const result = await authService.login(email, password)
      if (result && result.success) {
        const { token: userToken, user: userObj } = result.data
        localStorage.setItem('crm-token', userToken)
        setToken(userToken)
        setUser(userObj)
        toast.success(result.message || 'Login successful!')
        navigate('/')
        return result.data
      } else {
        throw new Error(result.message || 'Failed to login')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMsg)
      throw error // Re-throw to allow form component to handle state/errors
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register a new user account.
   * On success: automatically logs the user in and redirects to dashboard (/).
   */
  const register = async (name, email, password) => {
    setIsLoading(true)
    try {
      const result = await authService.register(name, email, password)
      if (result && result.success) {
        const { token: userToken, user: userObj } = result.data
        localStorage.setItem('crm-token', userToken)
        setToken(userToken)
        setUser(userObj)
        toast.success(result.message || 'Registration successful!')
        navigate('/')
        return result.data
      } else {
        throw new Error(result.message || 'Registration failed')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMsg)
      throw error // Re-throw to allow form component to handle state/errors
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Log out the current user session.
   * Purges states and localStorage token, then redirects to the login screen (/login).
   */
  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom React hook to consume the AuthContext values.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider. Make sure to wrap your application in <AuthProvider>.')
  }
  return context
}
