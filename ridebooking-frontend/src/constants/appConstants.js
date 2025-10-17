/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081',
  ENDPOINTS: {
    BOOKINGS: '/bookings',
    RIDES: '/rides',
    USERS: '/users',
    HISTORY: '/history'
  }
};

// Booking Status Constants
export const BOOKING_STATUS = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  RIDER: 'RIDER',
  DRIVER: 'DRIVER'
};

// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#007bff',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  },
  BREAKPOINTS: {
    MOBILE: '576px',
    TABLET: '768px',
    DESKTOP: '992px'
  }
};

// Default Values
export const DEFAULTS = {
  DISTANCE_MILES: 5.0,
  ESTIMATED_DURATION: 15,
  DEFAULT_PRICE: 15.0
};
