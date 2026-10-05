import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate a JWT token for a given user ID.
 * 
 * @param {string|mongoose.Types.ObjectId} userId - The ID of the user.
 * @returns {string} Signed JSON Web Token.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Register a new user in the system.
 * Checks for existing email, creates the user, and signs a JWT.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user already exists with this email address
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create the User (pre-save middleware handles bcrypt hashing)
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Convert document to JSON object, which automatically strips password field via toJSON override
    const userJson = user.toJSON();

    return successResponse(
      res,
      { token, user: userJson },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user with email and password.
 * Returns JWT token and User details on success.
 * 
 * PRODUCTION NOTE:
 * This endpoint is vulnerable to brute-force attacks.
 * To mitigate this risk, apply an 'express-rate-limit' middleware in production:
 * e.g., const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many login attempts' });
 * router.post('/login', loginLimiter, validateLogin, login);
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password field, which is excluded by default in schema definitions
    const user = await User.findOne({ email }).select('+password');

    // Return generic 'Invalid credentials' error for security (prevents user enumeration)
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Verify if account is active before validating password
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Verify plain text password against the stored hashed password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Convert document to JSON object to remove password field
    const userJson = user.toJSON();

    return successResponse(
      res,
      { token, user: userJson },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the currently logged-in user profile.
 * Expects user object to already be attached to request by protect middleware.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been populated and cleansed of the password by the 'protect' middleware
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Updates user profile details.
 * Restricts updates to the 'name' field by design (email changes require a dedicated validation flow).
 * Supports setting a new password, validating the current password first.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, profilePicture, oldPassword, newPassword } = req.body;

    // Fetch user including password field (needed for verification check)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // Only update name (email cannot be updated through this endpoint)
    if (name) {
      user.name = name;
    }

    // Update optional profile fields
    if (phoneNumber !== undefined) {
      user.phoneNumber = phoneNumber;
    }

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }

    // Handle password updates securely
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Please provide your current password to set a new password', 400);
      }

      // Check current password correctness
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Incorrect current password', 401);
      }

      // Update password (pre-save middleware automatically hashes this when saving)
      user.password = newPassword;
    }

    await user.save();

    // Clean user object for serialization
    const updatedUser = user.toJSON();

    return successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
