import { validationResult } from 'express-validator';

/**
 * Higher-order middleware to run express-validator chains.
 * Accumulates validation errors and returns a standardized 400 Bad Request error response.
 * 
 * @param {Array} validations - Array of express-validator verification chains.
 * @returns {Function} Express middleware function.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation checks in parallel
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to match the requested format: { field, message }
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};
