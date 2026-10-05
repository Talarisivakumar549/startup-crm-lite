import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Login page component.
 * Authenticates user credentials against the Express.js backend.
 * Provides real-time field validation, loading animations, error state feedback,
 * and maintains style parity with Startup CRM Lite's premium modern dark/light system.
 */
export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // Basic Client validation
    if (!email.trim() || !password) {
      setFormError('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      // The context already toast-alerts the error, but we show a local warning card as well
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setFormError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Main card wrapper */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:backdrop-blur-md animate-fade-in">
        
        {/* Brand logo header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/30">
            <Sparkles className="h-5.5 w-5.5 text-white animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            Enter your credentials to access your sales pipeline
          </p>
        </div>

        {/* Global Error Notice */}
        {formError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/50 p-3.5 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-900 transition-all placeholder-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-900 transition-all placeholder-gray-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-500/60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Signing you in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirection link footer */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          New to Startup CRM Lite?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  )
}
