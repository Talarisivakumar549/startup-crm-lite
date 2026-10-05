// Import the Link component from react-router-dom to handle client-side transition without full page reloads.
import { Link } from 'react-router-dom'

// Import HelpCircle icon from lucide-react to render an error-themed illustration.
import { HelpCircle } from 'lucide-react'

// Default export the NotFound page component representing the 404 fallback page layout.
export default function NotFound() {
  return (
    // Flexbox wrapper that spans the viewport height and centers the card element horizontally and vertically.
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      
      {/* Central 404 card styled with Linear/Stripe aesthetics, thin border, and modern soft shadows */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Decorative circle container surrounding the icon to highlight warning/question state */}
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400">
          {/* Diagnostic question mark icon */}
          <HelpCircle className="h-6 w-6" />
        </div>
        
        {/* Error code heading */}
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Error 404</span>
        
        {/* Human-readable error message heading */}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Page Not Found</h2>
        
        {/* Detailed user explanation message */}
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          The view or route you requested does not exist. Please check the URL or select a valid category from the sidebar navigation.
        </p>
        
        {/* Action section containing navigation redirect back to safety */}
        <div className="mt-6">
          {/* Link component wraps the navigation call so transitions happen instantaneously in-memory */}
          <Link
            // Set target home destination path
            to="/"
            // Apply standard primary styling resembling high-contrast modern buttons
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Return to Dashboard
          </Link>
        </div>

      </div>

    </div>
  )
}
