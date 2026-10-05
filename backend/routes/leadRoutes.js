import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';

const router = express.Router();

// Apply protect middleware to ALL routes defined in this router
router.use(protect);

/**
 * Validation rules for creating and updating a lead.
 * Validates:
 * - name: Not empty and minimum length of 2.
 * - company: Not empty.
 * - email: Valid email structure.
 * - status: Must be one of the 6 valid pipeline values (optional/fallback in model).
 * - source: Must be one of the 6 valid channels (optional/fallback in model).
 */
const leadValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .trim(),
  body('company')
    .notEmpty()
    .withMessage('Company name is required')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail()
    .trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'),
  body('value')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Deal value must be a non-negative number')
];

/**
 * Validation rules for updating lead status specifically.
 * Validates:
 * - status: Must be present and belong to the valid pipeline status enum values.
 */
const statusValidationRules = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost')
];

// Endpoint 1: Get aggregate statistics for Leads (registered before /:id parameter to prevent route collision)
router.get('/stats', getLeadStats);
router.get('/stats/summary', getLeadStats);

// Endpoint 2: Get 6-month trends/acquisition stats for Leads
router.get('/monthly-stats', getMonthlyStats);
router.get('/stats/monthly', getMonthlyStats);

// Endpoint 3: Get all leads with pagination, search query, and sorting filters
router.get('/', getLeads);

// Endpoint 4: Create a new Lead record
router.post('/', validate(leadValidationRules), createLead);

// Endpoint 4.5: Autocomplete search for leads
router.get('/search', searchLeads);

// Endpoint 5: Get details of a single Lead by ID
router.get('/:id', getLeadById);

// Endpoint 6: Update all/any editable fields on a Lead
router.put('/:id', validate(leadValidationRules), updateLead);

// Endpoint 7: Update only the status field on a Lead
router.patch('/:id/status', validate(statusValidationRules), updateLeadStatus);
router.put('/:id/status', validate(statusValidationRules), updateLeadStatus); // Support PUT status as alias

// Endpoint 8: Delete a Lead by ID
router.delete('/:id', deleteLead);

export default router;
