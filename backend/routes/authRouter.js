import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';

const router = express.Router();

// NOTE FOR PRODUCTION: Apply express-rate-limit here for brute force protection on Auth routes.
// e.g., const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
// router.post('/login', authLimiter, validateLogin, login);

// Validation schema for registering a new user
const registerRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation schema for logging in a user
const loginRules = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register a new user account
router.post('/register', validate(registerRules), register);

// Authenticate user credentials
router.post('/login', validate(loginRules), login);

// Get current user's profile details (accepts both /profile and /me endpoints as aliases)
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);

// Update user profile details
router.put('/profile', protect, updateProfile);

export default router;
