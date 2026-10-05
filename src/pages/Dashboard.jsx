import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, TrendingUp, TrendingDown, Info, Calendar } from 'lucide-react'

// Context Hook
import { useLeads } from '../context/LeadContext'

// Import Dashboard components
import StatsCard from '../components/dashboard/StatsCard'
import PipelineOverview from '../components/dashboard/PipelineOverview'
import RecentLeads from '../components/dashboard/RecentLeads'
import QuickActions from '../components/dashboard/QuickActions'

/**
 * Dashboard page component.
 * Assembles Stats Cards, Pipeline Overview, Recent Leads, and Quick Actions.
 * Pulls leads dynamically from the global LeadContext.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
export default function Dashboard() {
  const navigate = useNavigate()
  const { leads } = useLeads()
  const [notification, setNotification] = useState(null)

  /**
   * Triggers a temporary toast notification in the Dashboard.
   * 
   * @param {string} message - Notification text
   * @param {'success'|'info'|'warning'} type - Accent color type
   */
  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }, [])

  // Quick Action: Add New Lead (Redirects to Leads page)
  const handleAddNewLead = useCallback(() => {
    showToast('Redirecting to Lead Creation Form...', 'info')
    setTimeout(() => {
      navigate('/leads')
    }, 800)
  }, [navigate, showToast])

  // Quick Action: View All Leads (Navigates to Leads list)
  const handleViewAllLeads = useCallback(() => {
    navigate('/leads')
  }, [navigate])

  // Quick Action: Export Data (Triggers mock CSV download process)
  const handleExportData = useCallback(() => {
    showToast('Preparing report... Lead CRM data exported successfully!', 'success')
  }, [showToast])

  // Get current date string formatted nicely
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 dark:bg-gray-900 transition-colors duration-200">
      {/* Toast Notification HUD */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 animate-slide-in dark:border-gray-700 dark:bg-gray-800">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'warning'
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.message}
          </span>
        </div>
      )}

      {/* Header section */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Workspace Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review your startup pipeline conversions, recent activities, and metrics.
          </p>
        </div>

        {/* Date Indicator Badge */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-3xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span>{formattedToday}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={leads.length}
          icon={Users}
          change={12.4}
          color="primary"
        />
        <StatsCard
          title="Active Proposals"
          value={leads.filter((l) => l.status === 'Proposal Sent').length}
          icon={FileText}
          change={8.2}
          color="warning"
        />
        <StatsCard
          title="Conversion Success"
          value={leads.filter((l) => l.status === 'Won').length}
          icon={TrendingUp}
          change={24.5}
          color="success"
        />
        <StatsCard
          title="Churned / Lost"
          value={leads.filter((l) => l.status === 'Lost').length}
          icon={TrendingDown}
          change={-5.1}
          color="danger"
        />
      </div>

      {/* Main Grid: Left Section (Pipeline + Recent Table), Right Section (Quick Actions + Info Card) */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PipelineOverview leads={leads} />
            <RecentLeads leads={leads} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <QuickActions
            onAddLead={handleAddNewLead}
            onViewLeads={handleViewAllLeads}
            onExportData={handleExportData}
          />

          {/* Info Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <Info className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                CRM Active Database
              </h4>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
              You are viewing the CRM Workspace. Real-time updates entered on the Lead Management page are reflected here instantly through the React Context API architecture.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
