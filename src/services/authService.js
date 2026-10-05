import api from './api'

/**
 * Register a new user account.
 * 
 * @param {string} name - User's full name.
 * @param {string} email - User's email address.
 * @param {string} password - User's password (min 6 characters).
 * @returns {Promise<Object>} Promise resolving to the unwrapped response data containing the token and user.
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password })
  return response.data
}

/**
 * Authenticate user credentials and retrieve a session token.
 * 
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Promise resolving to the unwrapped response data containing the token and user.
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

/**
 * Log out the current user by removing the stored JWT token locally.
 * Since the backend is stateless, logout is handled client-side by purging localStorage.
 */
export const logout = () => {
  localStorage.removeItem('crm-token')
}

/**
 * Retrieve the current user's profile information.
 * Requires a valid Authorization bearer header (handled automatically by api.js interceptor).
 * 
 * @returns {Promise<Object>} Promise resolving to the user profile object.
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile')
  return response.data
}

/**
 * Update current user profile fields (e.g. name, password).
 * 
 * @param {Object} data - Object containing fields to update (name, oldPassword, newPassword).
 * @returns {Promise<Object>} Promise resolving to the updated user profile.
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data)
  return response.data
}

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
}

export default authService
