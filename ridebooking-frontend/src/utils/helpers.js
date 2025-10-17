// Utility functions for the Ride Booking Application
// This file contains reusable utility functions to improve code organization and maintainability

/**
 * Format status display text consistently across the application
 * @param {string} status - The status value from the backend
 * @returns {string} - User-friendly status text
 */
export const formatStatus = (status) => {
  switch (status) {
    case "REQUESTED": return "Pending";
    case "ACCEPTED": return "Accepted";
    case "COMPLETED": return "Completed";
    case "CANCELLED": return "Cancelled";
    default: return status;
  }
};

/**
 * Format message prefixes consistently
 * @param {string} type - Message type (success, error, warning)
 * @param {string} message - The message content
 * @returns {string} - Formatted message
 */
export const formatMessage = (type, message) => {
  const prefixes = {
    success: "Success: ",
    error: "Error: ",
    warning: "Warning: "
  };
  return `${prefixes[type] || ""}${message}`;
};

/**
 * Style configurations for consistent UI theming
 */
export const STYLES = {
  button: {
    primary: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    success: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "10px 20px", 
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    },
    danger: {
      backgroundColor: "#dc3545",
      color: "white",
      padding: "10px 20px",
      border: "none", 
      borderRadius: "5px",
      cursor: "pointer"
    }
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  }
};

/**
 * Validate form inputs
 * @param {Object} formData - The form data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Format currency values consistently
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format phone numbers for display
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  return phone;
};
