import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyAnalyticsState component.
 * Guidance shown when no leads are available in the CRM database.
 */
export default function EmptyAnalyticsState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
      {/* Icon Container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <BarChart3 className="h-6 w-6 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </div>

      {/* Main Title and Descriptions */}
      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        No analytics available yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Add your first lead to start tracking business performance.
      </p>

      {/* Action CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md transition-all cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Add Lead
        </button>
      </div>
    </div>
  );
}
