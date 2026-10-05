import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handling Middleware.
 * Captures all unhandled exceptions or explicitly passed errors, parses Mongoose and JWT-specific errors,
 * and formats the output into a standardized JSON response.
 * 
 * @param {Object} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} Standardized JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  // Log the complete error stack on the server console for developers
  console.error('Error Details:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Handle Mongoose validation errors (ValidationError)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    // Gather field-by-field error messages
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  // 2. Handle invalid Mongoose ObjectId format (CastError)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. Handle MongoDB duplicate key errors (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }
  // 4. Handle JSON Web Token Signature Verification Error
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  // 5. Handle JSON Web Token Expiration Error
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Construct response payload
  const responsePayload = {
    success: false,
    message,
    ...(errors && { errors })
  };

  // In development environment, include the call stack for debugging purposes
  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
