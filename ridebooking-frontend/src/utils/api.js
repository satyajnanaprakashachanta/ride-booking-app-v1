// API utility functions for consistent HTTP requests
// This file centralizes all API calls to improve maintainability and error handling

const BASE_URL = 'http://localhost:8081';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise} - API response
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// User Authentication APIs
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
};

// Booking APIs
export const bookingAPI = {
  create: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  
  getStatus: (bookingId) => apiRequest(`/bookings/${bookingId}/status`),
  
  getUserBookings: (userId) => apiRequest(`/users/${userId}/bookings`),
  
  accept: (bookingId, driverData) => apiRequest(`/bookings/${bookingId}/accept`, {
    method: 'POST',
    body: JSON.stringify(driverData)
  })
};

// Admin APIs
export const adminAPI = {
  getStats: () => apiRequest('/admin/dashboard/stats', {
    headers: { 'Admin-Token': 'admin' }
  }),
  
  getUsers: () => apiRequest('/admin/dashboard/users', {
    headers: { 'Admin-Token': 'admin' }
  }),
  
  blockUser: (userId) => apiRequest(`/admin/dashboard/users/${userId}/status?status=BLOCKED`, {
    method: 'PUT',
    headers: { 'Admin-Token': 'admin' }
  }),
  
  unblockUser: (userId) => apiRequest(`/admin/dashboard/users/${userId}/status?status=ACTIVE`, {
    method: 'PUT', 
    headers: { 'Admin-Token': 'admin' }
  }),
  
  deleteUser: (userId) => apiRequest(`/admin/dashboard/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Admin-Token': 'admin' }
  })
};

// Driver APIs  
export const driverAPI = {
  register: (driverData) => apiRequest('/drivers/register', {
    method: 'POST',
    body: JSON.stringify(driverData)
  }),
  
  getPendingBookings: () => apiRequest('/bookings/pending'),
  
  getAcceptedBookings: (driverId) => apiRequest(`/drivers/${driverId}/accepted-bookings`)
};

export default apiRequest;
