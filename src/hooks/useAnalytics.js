import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import { parseDate } from '../utils/analyticsHelpers';

export default function useAnalytics() {
  const { leads } = useLeads();
  const [filterType, setFilterType] = useState('Last 30 Days'); // default filter
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Trigger brief simulation loading state on filter change for polished UX skeleton display
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Setters wrapped to update isLoading state asynchronously, avoiding React 19 useEffect setState warnings
  const handleFilterTypeChange = useCallback((type) => {
    setFilterType(type);
    setIsLoading(true);
  }, []);

  const handleCustomStartDateChange = useCallback((date) => {
    setCustomStartDate(date);
    setIsLoading(true);
  }, []);

  const handleCustomEndDateChange = useCallback((date) => {
    setCustomEndDate(date);
    setIsLoading(true);
  }, []);

  // Compute date range objects for current and previous periods
  const dateRanges = useMemo(() => {
    const now = new Date();
    // Normalize now to end of day to include today's leads fully
    const currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let currentStart;
    let prevStart;
    let prevEnd;

    switch (filterType) {
      case 'Last 7 Days': {
        currentStart = new Date(currentEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      }
      case 'Last 90 Days': {
        currentStart = new Date(currentEnd.getTime() - 90 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      }
      case 'This Year': {
        const currentYear = now.getFullYear();
        currentStart = new Date(currentYear, 0, 1, 0, 0, 0, 0);
        
        prevStart = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
        prevEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
        break;
      }
      case 'Custom Range': {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);

          // If start/end are backwards, handle gracefully
          const durationMs = Math.max(0, end.getTime() - start.getTime());
          
          prevEnd = new Date(start.getTime() - 1);
          prevStart = new Date(prevEnd.getTime() - durationMs);
          // Overwrite end to ensure bounds are strictly respected
          return {
            currentStart: start,
            currentEnd: end,
            prevStart,
            prevEnd,
          };
        }
        // Fallback to Last 30 Days if custom is incomplete
        currentStart = new Date(currentEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      }
      case 'Last 30 Days':
      default: {
        currentStart = new Date(currentEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(currentStart.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      }
    }

    return { currentStart, currentEnd, prevStart, prevEnd };
  }, [filterType, customStartDate, customEndDate]);

  // Filter leads for the current active period
  const filteredLeads = useMemo(() => {
    const { currentStart, currentEnd } = dateRanges;
    if (!currentStart || !currentEnd) return leads;

    return leads.filter((lead) => {
      const created = parseDate(lead.createdAt);
      if (!created) return false;
      return created >= currentStart && created <= currentEnd;
    });
  }, [leads, dateRanges]);

  // Filter leads for the previous comparative period
  const previousLeads = useMemo(() => {
    const { prevStart, prevEnd } = dateRanges;
    if (!prevStart || !prevEnd) return [];

    return leads.filter((lead) => {
      const created = parseDate(lead.createdAt);
      if (!created) return false;
      return created >= prevStart && created <= prevEnd;
    });
  }, [leads, dateRanges]);

  return {
    leads, // raw leads
    filteredLeads, // filtered current period
    previousLeads, // filtered previous period
    filterType,
    setFilterType: handleFilterTypeChange,
    customStartDate,
    setCustomStartDate: handleCustomStartDateChange,
    customEndDate,
    setCustomEndDate: handleCustomEndDateChange,
    isLoading,
  };
}
