import axios from 'axios'
import toast from 'react-hot-toast'

// Create Axios instance with API base URL configured dynamically.
// In development, always use the local backend. In production, use VITE_API_URL or fall back to Railway.
console.log("API URL =", import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_API_URL || 'https://startup-crmlite-production.up.railway.app'),
})

// Request interceptor to automatically attach the Authorization bearer token to every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle global API responses, intercepting auth errors and network issues.
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 1. Check if the error response exists (server responded with a status code outside the 2xx range)
    if (error.response) {
      // On 401 Unauthorized, clear local session token and redirect the user to the login screen
      if (error.response.status === 401) {
        localStorage.removeItem('crm-token')
        // Only redirect if the user is not already on the login or registration page to avoid reload loops
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login'
        }
      }
    } else if (error.request) {
      // 2. The request was made but no response was received (network or connectivity issue)
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-error-toast', // Dedupes multiple rapid connection error alerts
      })
    }
    return Promise.reject(error)
  }
)

export default api
