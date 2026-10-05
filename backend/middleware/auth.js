import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect middleware to secure routes.
 * Authenticates requests by verifying the JWT token passed in the Authorization header.
 * Attaches the authenticated user to the request object.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token is present
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // 3. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in database, excluding password from query for security
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // 5. Attach the authenticated user to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    // 6. Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token is invalid', 401);
    }
    // Generic fallback for authorized error scenarios
    return errorResponse(res, 'Not authorized to access this route', 401);
  }
};
