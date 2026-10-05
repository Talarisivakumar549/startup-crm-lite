import { STATUS_MAP, STATUS_COLORS } from '../constants';

/**
 * Normalizes a status name to the keys used in STATUS_COLORS and STATUS_MAP.
 * Handles "Meeting Scheduled" -> "Meeting", "Proposal Sent" -> "Proposal", etc.
 */
export function normalizeStatus(status) {
  if (!status) return 'New';
  return STATUS_MAP[status] || status;
}

/**
 * Safely parses a date string and returns a Date object, or null if invalid.
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calculates lead status distribution for Pie Chart.
 * Maps statuses to custom colors and calculates percentages.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getStatusDistribution(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const total = safeLeads.length;
  if (total === 0) return [];

  // Count leads per normalized status
  const counts = safeLeads.reduce((acc, lead) => {
    const status = normalizeStatus(lead?.status);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const order = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won', 'Lost'];

  return order
    .map((status) => {
      const count = counts[status] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        name: status,
        value: count,
        color: STATUS_COLORS[status] || 'var(--brand-new)',
        percentage: Math.round(percentage * 10) / 10,
      };
    })
    .filter((item) => item.value > 0); // Hide zero categories for visual clarity
}

/**
 * Generates the last 6 calendar months dynamically up to the current date.
 * Returns array of objects with label (e.g. 'Jun') and key ('2026-06').
 */
function getLast6Months() {
  const months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = d.toLocaleString('en-US', { month: 'short' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ key, label });
  }
  return months;
}

/**
 * Gets monthly lead counts for the last 6 months.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getMonthlyLeads(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const months = getLast6Months();
  
  const monthlyData = months.map((m) => ({
    month: m.label,
    key: m.key,
    count: 0,
  }));

  safeLeads.forEach((lead) => {
    const createdDate = parseDate(lead?.createdAt);
    if (!createdDate) return;
    const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    const found = monthlyData.find((m) => m.key === key);
    if (found) {
      found.count += 1;
    }
  });

  return monthlyData.map((d) => ({
    month: d.month,
    'Lead Count': d.count, // Tooltip refers to "24 Leads" etc.
  }));
}

/**
 * Gets monthly conversion rate (Won / Total) for the last 6 months.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getConversionByMonth(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const months = getLast6Months();

  const monthlyStats = months.map((m) => ({
    month: m.label,
    key: m.key,
    total: 0,
    won: 0,
  }));

  safeLeads.forEach((lead) => {
    const createdDate = parseDate(lead?.createdAt);
    if (!createdDate) return;
    const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    const found = monthlyStats.find((m) => m.key === key);
    if (found) {
      found.total += 1;
      if (lead.status === 'Won') {
        found.won += 1;
      }
    }
  });

  return monthlyStats.map((d) => {
    const rate = d.total > 0 ? (d.won / d.total) * 100 : 0;
    return {
      month: d.month,
      rate: Math.round(rate), // Integer percentage label for the line marker
    };
  });
}

/**
 * Calculates monthly won revenue totals for the last 6 months.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getRevenueByMonth(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const months = getLast6Months();

  const monthlyData = months.map((m) => ({
    month: m.label,
    key: m.key,
    revenue: 0,
  }));

  safeLeads.forEach((lead) => {
    if (lead?.status !== 'Won') return;
    const createdDate = parseDate(lead?.createdAt);
    if (!createdDate) return;
    const key = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    const found = monthlyData.find((m) => m.key === key);
    if (found) {
      found.revenue += Number(lead?.value || 0);
    }
  });

  return monthlyData.map((d) => ({
    month: d.month,
    revenue: d.revenue,
  }));
}

/**
 * Pipeline Value: Sum of all active lead values (stages other than Won and Lost)
 *
 * @param {Array} leads
 * @returns {number}
 */
export function getPipelineValue(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  return safeLeads
    .filter((l) => !['Won', 'Lost'].includes(l?.status))
    .reduce((sum, l) => sum + Number(l?.value || 0), 0);
}

/**
 * Won Revenue: Sum of Won lead values
 *
 * @param {Array} leads
 * @returns {number}
 */
export function getWonRevenue(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  return safeLeads
    .filter((l) => l?.status === 'Won')
    .reduce((sum, l) => sum + Number(l?.value || 0), 0);
}

/**
 * Average Sales Cycle (in days): Average duration between wonAt and createdAt for Won deals
 *
 * @param {Array} leads
 * @returns {number} Average days, rounded
 */
export function getAverageSalesCycle(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const wonLeads = safeLeads.filter((l) => l?.status === 'Won');
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let validCount = 0;

  wonLeads.forEach((lead) => {
    const start = parseDate(lead?.createdAt);
    const end = parseDate(lead?.wonAt || lead?.updatedAt); // fallback if wonAt isn't explicitly set
    if (start && end && end >= start) {
      const diffTime = Math.abs(end - start);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      totalDays += diffDays;
      validCount += 1;
    }
  });

  // Fallback simulation value if dates are exact same or unavailable
  if (validCount === 0) {
    // If no dates match, return a standard average sales cycle of 15 days or 0
    return 0;
  }

  return Math.round(totalDays / validCount);
}

/**
 * Lost Rate: Lost Leads / Total Leads
 *
 * @param {Array} leads
 * @returns {number} Percentage (integer)
 */
export function getLostRate(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const total = safeLeads.length;
  if (total === 0) return 0;

  const lostCount = safeLeads.filter((l) => l?.status === 'Lost').length;
  return Math.round((lostCount / total) * 100);
}

/**
 * Lead Source Analytics: Group by source, sort descending
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getLeadSourceStats(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const counts = safeLeads.reduce((acc, lead) => {
    const source = lead?.source || 'Other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const total = safeLeads.length;

  return Object.keys(counts)
    .map((source) => ({
      source,
      count: counts[source],
      percentage: total > 0 ? Math.round((counts[source] / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculates cumulative funnel stage data.
 * New (100%) -> Contacted -> Meeting -> Proposal -> Won.
 * A lead at a later stage is counted in all previous stages.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getFunnelData(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const total = safeLeads.length;
  if (total === 0) return [];

  // Funnel order map
  const newCount = safeLeads.length;
  const contactedCount = safeLeads.filter(l => ['Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status)).length;
  const meetingCount = safeLeads.filter(l => ['Meeting Scheduled', 'Proposal Sent', 'Won'].includes(l.status)).length;
  const proposalCount = safeLeads.filter(l => ['Proposal Sent', 'Won'].includes(l.status)).length;
  const wonCount = safeLeads.filter(l => l.status === 'Won').length;

  const rawStages = [
    { name: 'New', count: newCount },
    { name: 'Contacted', count: contactedCount },
    { name: 'Meeting', count: meetingCount },
    { name: 'Proposal', count: proposalCount },
    { name: 'Won', count: wonCount },
  ];

  return rawStages.map((stage, idx) => {
    const percentageOfTotal = total > 0 ? (stage.count / total) * 100 : 0;
    
    // Stage Conversion (conversion from the previous stage)
    let conversionFromPrior = 100;
    let dropOff = 0;
    
    if (idx > 0) {
      const priorCount = rawStages[idx - 1].count;
      conversionFromPrior = priorCount > 0 ? (stage.count / priorCount) * 100 : 0;
      dropOff = priorCount > 0 ? ((priorCount - stage.count) / priorCount) * 100 : 0;
    }

    return {
      name: stage.name,
      value: stage.count, // Recharts FunnelChart uses value
      count: stage.count,
      conversionRate: Math.round(conversionFromPrior),
      dropOff: Math.round(dropOff),
      percentage: Math.round(percentageOfTotal),
    };
  });
}

/**
 * Sales Velocity Formula:
 * (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length (in days)
 *
 * @param {Array} leads
 * @returns {number} Sales Velocity per day (currency units)
 */
export function getSalesVelocity(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  
  // Opportunities = Active deals (not Won, not Lost)
  const opportunities = safeLeads.filter(l => !['Won', 'Lost'].includes(l?.status)).length;

  // Win Rate = Won leads / Total leads in period
  const total = safeLeads.length;
  const wonCount = safeLeads.filter(l => l?.status === 'Won').length;
  const winRate = total > 0 ? wonCount / total : 0;

  // Avg Deal Size = Sum of Won Deal Values / Won Deal Count
  const wonLeads = safeLeads.filter(l => l?.status === 'Won');
  let avgDealSize = 0;
  if (wonLeads.length > 0) {
    const totalWonVal = wonLeads.reduce((sum, l) => sum + Number(l?.value || 0), 0);
    avgDealSize = totalWonVal / wonLeads.length;
  } else if (safeLeads.length > 0) {
    // fallback to average of all deals with value if no won deals exist yet
    const totalVal = safeLeads.reduce((sum, l) => sum + Number(l?.value || 0), 0);
    avgDealSize = totalVal / safeLeads.length;
  }

  // Sales Cycle length
  let cycleDays = getAverageSalesCycle(safeLeads);
  if (cycleDays <= 0) {
    cycleDays = 15; // default fallback sales cycle to prevent divide-by-zero
  }

  const velocity = (opportunities * winRate * avgDealSize) / cycleDays;
  return Math.round(velocity);
}

/**
 * Forecast Revenue: Average Won Revenue of Last 6 Months.
 *
 * @param {Array} leads
 * @returns {number}
 */
export function getForecastRevenue(leads = []) {
  const monthlyRevenueData = getRevenueByMonth(leads);
  if (monthlyRevenueData.length === 0) return 0;
  
  const sum = monthlyRevenueData.reduce((acc, d) => acc + d.revenue, 0);
  return Math.round(sum / monthlyRevenueData.length);
}

/**
 * Top Performers: Rank sales reps by Won Revenue.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getTopPerformers(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const wonLeads = safeLeads.filter(l => l?.status === 'Won');

  const repStats = wonLeads.reduce((acc, lead) => {
    const owner = lead?.owner || 'Unassigned';
    if (!acc[owner]) {
      acc[owner] = { name: owner, revenue: 0, wonCount: 0 };
    }
    acc[owner].revenue += Number(lead?.value || 0);
    acc[owner].wonCount += 1;
    return acc;
  }, {});

  return Object.values(repStats)
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Activity Heatmap Data: GitHub-style contribution heatmap.
 * Tracks: Leads Created (createdAt), Meetings Scheduled (meetingAt), Calls Logged/Contacted (contactedAt).
 *
 * Returns data for the last 30 days.
 *
 * @param {Array} leads
 * @returns {Array}
 */
export function getActivityHeatmapData(leads = []) {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const grid = [];
  const today = new Date();

  // Generate the last 30 calendar days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dateString = d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const label = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    
    grid.push({
      dateString,
      label,
      leadsCreated: 0,
      meetingsScheduled: 0,
      callsLogged: 0,
      totalActivity: 0,
    });
  }

  // Count actions per day
  safeLeads.forEach((lead) => {
    // 1. Lead Created
    const createdDate = parseDate(lead?.createdAt);
    if (createdDate) {
      const createdStr = createdDate.toISOString().split('T')[0];
      const cell = grid.find((c) => c.dateString === createdStr);
      if (cell) cell.leadsCreated += 1;
    }

    // 2. Meeting Scheduled
    const meetingDate = parseDate(lead?.meetingAt);
    if (meetingDate) {
      const meetingStr = meetingDate.toISOString().split('T')[0];
      const cell = grid.find((c) => c.dateString === meetingStr);
      if (cell) cell.meetingsScheduled += 1;
    }

    // 3. Call Logged (contactedAt)
    const contactedDate = parseDate(lead?.contactedAt);
    if (contactedDate) {
      const contactedStr = contactedDate.toISOString().split('T')[0];
      const cell = grid.find((c) => c.dateString === contactedStr);
      if (cell) cell.callsLogged += 1;
    }
  });

  // Calculate totals and intensity levels (0 to 4)
  return grid.map((day) => {
    const totalActivity = day.leadsCreated + day.meetingsScheduled + day.callsLogged;
    let intensity = 0;
    if (totalActivity > 0) {
      if (totalActivity === 1) intensity = 1;
      else if (totalActivity <= 3) intensity = 2;
      else if (totalActivity <= 5) intensity = 3;
      else intensity = 4;
    }
    return {
      ...day,
      totalActivity,
      intensity,
    };
  });
}
