/**
 * Sends a consistent success response.
 * 
 * @param {Object} res - Express response object.
 * @param {any} data - Payload to return in response.
 * @param {string} message - User-friendly message explaining the success.
 * @param {number} [statusCode=200] - HTTP status code (defaults to 200).
 * @returns {Object} Express JSON response payload.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a consistent error response.
 * 
 * @param {Object} res - Express response object.
 * @param {string} message - User-friendly error message.
 * @param {number} [statusCode=500] - HTTP status code (defaults to 500).
 * @param {any} [errors=null] - Object containing granular error descriptions (e.g., field validation errors).
 * @returns {Object} Express JSON response payload.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a consistent paginated success response.
 * 
 * @param {Object} res - Express response object.
 * @param {Array} data - Array of paginated data.
 * @param {number} total - Total matching records count in database.
 * @param {number} page - Current page index.
 * @param {number} limit - Maximum number of records per page.
 * @returns {Object} Express JSON response payload.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
};
