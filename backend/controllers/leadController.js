import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc      Get all leads for the authenticated user with advanced filtering, sorting, and pagination
 * @route     GET /api/leads
 * @access    Private
 * @param     {Object} req - Express request object containing user info and query params
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Paginated response containing list of leads and metadata
 * @sideEffect Queries MongoDB Lead collection
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      search,
      source,
      dateFrom,
      dateTo
    } = req.query;

    console.log(`[leadController:getLeads] Fetching leads for user ${req.user._id}. Params: page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}, status=${status}, hasSearch=${!!search}, source=${source}, dateFrom=${dateFrom}, dateTo=${dateTo}`);

    // Parse pagination parameters safely
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

    // Build the query filter - always isolate to the authenticated user
    const filter = { owner: req.user._id };

    // Apply status filter if provided and not equal to 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Apply source filter if provided and not equal to 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Apply date range filters on createdAt
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Apply regex search on name, company, or email if provided with case-insensitive options
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Setup sorting configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Run count and query in parallel to optimize DB performance
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Lead.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / parsedLimit);
    const hasNext = parsedPage < pages;
    const hasPrev = parsedPage > 1;

    console.log(`[leadController:getLeads] Found ${total} leads. Returning page ${parsedPage}/${pages}`);
    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    console.error('[leadController:getLeads] Error encountered:', error);
    next(error);
  }
};

/**
 * @desc      Create a new lead owned by the authenticated user
 * @route     POST /api/leads
 * @access    Private
 * @param     {Object} req - Express request object with lead details in body
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response containing the created lead object
 * @sideEffect Creates a new document in MongoDB Lead collection
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes, value } = req.body;
    console.log(`[leadController:createLead] Creating a new lead for owner: ${req.user._id}`);

    // Create new lead instance with requested body parameters and owner validation
    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      value: value !== undefined && value !== '' ? Number(value) : 0,
      owner: req.user._id
    });

    console.log(`[leadController:createLead] Lead created successfully with ID: ${newLead._id}`);
    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    console.error('[leadController:createLead] Error encountered:', error);
    next(error);
  }
};

/**
 * @desc      Retrieve details of a single lead by its ID
 * @route     GET /api/leads/:id
 * @access    Private
 * @param     {Object} req - Express request object containing lead ID parameter
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response with the lead document, or 404 error
 * @sideEffect Queries MongoDB Lead collection
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[leadController:getLeadById] Fetching lead ID: ${id} for owner: ${req.user._id}`);

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      console.log(`[leadController:getLeadById] Lead ID ${id} not found or unauthorized for user ${req.user._id}`);
      return errorResponse(res, 'Lead not found', 404);
    }

    console.log(`[leadController:getLeadById] Lead ID ${id} successfully retrieved`);
    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    console.error(`[leadController:getLeadById] Error fetching lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc      Update fields of an existing lead owned by the authenticated user
 * @route     PUT /api/leads/:id
 * @access    Private
 * @param     {Object} req - Express request object containing lead ID and update payloads
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response with the updated lead document, or 404 error
 * @sideEffect Modifies a document in MongoDB Lead collection
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[leadController:updateLead] Updating lead ID: ${id} for owner: ${req.user._id}`);

    // Destructure body elements to strip or ignore the owner field to ensure security
    const updateData = { ...req.body };
    delete updateData.owner;

    // Use { new: true, runValidators: true } options to run model schema rules on updates
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      console.log(`[leadController:updateLead] Lead ID ${id} not found or unauthorized for user ${req.user._id}`);
      return errorResponse(res, 'Lead not found', 404);
    }

    console.log(`[leadController:updateLead] Lead ID ${id} updated successfully`);
    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    console.error(`[leadController:updateLead] Error updating lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc      Update the status pipeline stage of a single lead in one operation
 * @route     PATCH /api/leads/:id/status
 * @access    Private
 * @param     {Object} req - Express request object containing lead ID and status update string
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response with the updated lead document, or 400/404 error
 * @sideEffect Modifies status field in MongoDB Lead document
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[leadController:updateLeadStatus] Updating status to '${status}' for lead: ${id}`);

    // Additional check to restrict status to valid enum options
    const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
    if (!status || !validStatuses.includes(status)) {
      console.log(`[leadController:updateLeadStatus] Invalid status received: ${status}`);
      return errorResponse(res, 'Invalid lead status value', 400);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      console.log(`[leadController:updateLeadStatus] Lead ID ${id} not found or unauthorized for user ${req.user._id}`);
      return errorResponse(res, 'Lead not found', 404);
    }

    console.log(`[leadController:updateLeadStatus] Lead ID ${id} status updated to: ${status}`);
    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    console.error(`[leadController:updateLeadStatus] Error updating status for lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc      Delete a lead belonging to the user
 * @route     DELETE /api/leads/:id
 * @access    Private
 * @param     {Object} req - Express request object with target lead ID
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response confirming deletion message, or 404 error
 * @sideEffect Deletes a document from MongoDB Lead collection
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[leadController:deleteLead] Attempting delete for lead ID: ${id} by owner: ${req.user._id}`);

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      console.log(`[leadController:deleteLead] Lead ID ${id} not found or unauthorized for user ${req.user._id}`);
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();
    console.log(`[leadController:deleteLead] Lead ID ${id} successfully deleted`);

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    console.error(`[leadController:deleteLead] Error deleting lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc      Get aggregate stats for leads belonging to the authenticated user in a single database query
 * @route     GET /api/leads/stats
 * @access    Private
 * @param     {Object} req - Express request object
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response with grouped and computed lead counts/conversions
 * @sideEffect Runs aggregation pipeline on MongoDB Lead collection
 */
export const getLeadStats = async (req, res, next) => {
  try {
    console.log(`[leadController:getLeadStats] Aggregating advanced stats in a single query for user: ${req.user._id}`);

    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1; // 1-12

    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth() + 1; // 1-12

    const aggregationResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalCount: [
            { $count: 'count' }
          ],
          statusGroup: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceGroup: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          monthlyCounts: [
            {
              $project: {
                isThisMonth: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, thisYear] },
                    { $eq: [{ $month: '$createdAt' }, thisMonth] }
                  ]
                },
                isLastMonth: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, lastYear] },
                    { $eq: [{ $month: '$createdAt' }, lastMonth] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                thisMonthCount: { $sum: { $cond: ['$isThisMonth', 1, 0] } },
                lastMonthCount: { $sum: { $cond: ['$isLastMonth', 1, 0] } }
              }
            }
          ]
        }
      }
    ]);

    const result = aggregationResult[0];

    const totalLeads = result.totalCount[0]?.count || 0;

    // Build status breakdown
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0
    };
    if (result.statusGroup) {
      result.statusGroup.forEach((item) => {
        if (item._id && statusBreakdown[item._id] !== undefined) {
          statusBreakdown[item._id] = item.count;
        }
      });
    }

    // Build source breakdown
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Other: 0
    };
    if (result.sourceGroup) {
      result.sourceGroup.forEach((item) => {
        if (item._id && sourceBreakdown[item._id] !== undefined) {
          sourceBreakdown[item._id] = item.count;
        }
      });
    }

    // Compute conversion rate with division-by-zero check
    const wonCount = statusBreakdown.Won || 0;
    const conversionRate = totalLeads > 0 
      ? Math.round((wonCount / totalLeads) * 100 * 10) / 10 
      : 0.0;

    // Compute monthly counts and growth rate
    const thisMonthLeads = result.monthlyCounts[0]?.thisMonthCount || 0;
    const lastMonthLeads = result.monthlyCounts[0]?.lastMonthCount || 0;

    // Growth rate: check division-by-zero
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100 * 10) / 10;
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0; // 100% growth if starting from 0
    }

    const leadStats = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate
    };

    console.log(`[leadController:getLeadStats] Completed aggregation. Total: ${totalLeads}, Conversion Rate: ${conversionRate}%`);
    return successResponse(res, leadStats, 'Lead statistics fetched successfully');
  } catch (error) {
    console.error('[leadController:getLeadStats] Error generating statistics:', error);
    next(error);
  }
};

/**
 * @desc      Get chronological monthly acquisition metrics for the past 6 calendar months
 * @route     GET /api/leads/monthly-stats
 * @access    Private
 * @param     {Object} req - Express request object
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response containing array of monthly data records
 * @sideEffect Runs aggregation pipeline on MongoDB Lead collection
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    console.log(`[leadController:getMonthlyStats] Generating chronologically sorted 6-month trends for user: ${req.user._id}`);

    // Generate the last 6 calendar months list, from oldest to newest
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsList = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = `${monthsShort[d.getMonth()]} ${d.getFullYear()}`;
      const yearVal = d.getFullYear();
      const monthVal = d.getMonth() + 1; // 1-12 (Mongoose $month format)
      const key = `${yearVal}-${monthVal}`;
      monthsList.push({
        month: label,
        year: yearVal,
        monthNum: monthVal,
        key,
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0
      });
    }

    // Determine starting date bound (first day of the oldest month)
    const startDate = new Date(monthsList[0].year, monthsList[0].monthNum - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const aggregationResult = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] }
          }
        }
      }
    ]);

    // Map query results to the dynamic chronological month list
    aggregationResult.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      const matchingMonth = monthsList.find((m) => m.key === key);
      if (matchingMonth) {
        matchingMonth.total = item.total;
        matchingMonth.won = item.won;
        matchingMonth.lost = item.lost;
        matchingMonth.conversionRate = item.total > 0
          ? Math.round((item.won / item.total) * 100 * 10) / 10
          : 0.0;
      }
    });

    // Clean up output fields to match requirements
    const formattedStats = monthsList.map((m) => ({
      month: m.month,
      total: m.total,
      won: m.won,
      lost: m.lost,
      conversionRate: m.conversionRate
    }));

    console.log(`[leadController:getMonthlyStats] Monthly breakdown prepared:`, JSON.stringify(formattedStats));
    return successResponse(res, formattedStats, 'Monthly statistics fetched successfully');
  } catch (error) {
    console.error('[leadController:getMonthlyStats] Error generating monthly trends:', error);
    next(error);
  }
};

/**
 * @desc      Quick search for autocomplete (React SearchBar debounce)
 * @route     GET /api/leads/search
 * @access    Private
 * @param     {Object} req - Express request object containing query param 'q' and optional 'limit'
 * @param     {Object} res - Express response object
 * @param     {Function} next - Express next middleware function
 * @returns   {Object} Success response containing list of leads matching query q with limited fields
 * @sideEffect Queries MongoDB Lead collection
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    console.log(`[leadController:searchLeads] Autocomplete search requested, limit: ${limit} for user ${req.user._id}`);

    if (!q || q.trim() === '') {
      return successResponse(res, [], 'Search query is empty');
    }

    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 5));

    const filter = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q.trim(), $options: 'i' } },
        { company: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } }
      ]
    };

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(parsedLimit);

    return successResponse(res, leads, 'Search completed successfully');
  } catch (error) {
    console.error('[leadController:searchLeads] Error during search:', error);
    next(error);
  }
};
